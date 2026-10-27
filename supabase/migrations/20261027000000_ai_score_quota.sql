-- Server-only atomic quotas for expensive AI scoring calls.
CREATE TABLE IF NOT EXISTS private.ai_score_rate_limits (
  bucket_start timestamptz NOT NULL,
  scope text NOT NULL CHECK (scope IN ('user_minute', 'global_hour')),
  subject text NOT NULL,
  request_count integer NOT NULL DEFAULT 1 CHECK (request_count >= 1),
  PRIMARY KEY (scope, subject, bucket_start)
);

CREATE INDEX IF NOT EXISTS ai_score_rate_limits_bucket_idx
  ON private.ai_score_rate_limits (bucket_start);

REVOKE ALL ON TABLE private.ai_score_rate_limits FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE private.ai_score_rate_limits TO service_role;

CREATE OR REPLACE FUNCTION public.consume_ai_score_quota(p_user_id uuid)
RETURNS TABLE (allowed boolean, retry_after_seconds integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_now timestamptz := clock_timestamp();
  v_minute timestamptz := date_trunc('minute', v_now);
  v_hour timestamptz := date_trunc('hour', v_now);
  v_user_count integer;
  v_global_count integer;
  v_retry integer;
BEGIN
  IF current_setting('request.jwt.claim.role', true) IS DISTINCT FROM 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
  END IF;
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'user id required' USING ERRCODE = '22023';
  END IF;

  PERFORM pg_advisory_xact_lock(91731, 0);
  PERFORM pg_advisory_xact_lock(91731, hashtext(p_user_id::text));

  INSERT INTO private.ai_score_rate_limits AS limits (bucket_start, scope, subject, request_count)
  VALUES (v_minute, 'user_minute', p_user_id::text, 1)
  ON CONFLICT (scope, subject, bucket_start)
  DO UPDATE SET request_count = LEAST(limits.request_count + 1, 11)
  RETURNING request_count INTO v_user_count;

  INSERT INTO private.ai_score_rate_limits AS limits (bucket_start, scope, subject, request_count)
  VALUES (v_hour, 'global_hour', 'all', 1)
  ON CONFLICT (scope, subject, bucket_start)
  DO UPDATE SET request_count = LEAST(limits.request_count + 1, 501)
  RETURNING request_count INTO v_global_count;

  DELETE FROM private.ai_score_rate_limits
  WHERE bucket_start < v_hour - interval '2 hours';

  IF v_user_count > 10 OR v_global_count > 500 THEN
    v_retry := GREATEST(
      CASE WHEN v_user_count > 10 THEN EXTRACT(EPOCH FROM (v_minute + interval '1 minute' - v_now))::integer ELSE 0 END,
      CASE WHEN v_global_count > 500 THEN EXTRACT(EPOCH FROM (v_hour + interval '1 hour' - v_now))::integer ELSE 0 END
    );
    RETURN QUERY SELECT false, GREATEST(1, v_retry);
  ELSE
    RETURN QUERY SELECT true, 0;
  END IF;
END;
$function$;

REVOKE ALL ON FUNCTION public.consume_ai_score_quota(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_ai_score_quota(uuid) TO service_role;
