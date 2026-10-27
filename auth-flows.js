/* Password, email-code, and Google sign-in for Krypton students. */
(function(){
  let pendingEmail=null,pendingMetadata=null,pendingIsSignup=false;
  const authForm=document.querySelector("#auth-form");
  const otpForm=document.querySelector("#otp-form");
  const authSwitch=document.querySelector(".auth-switch");
  const passwordField=document.querySelector("#password-field");
  const emailCodeButton=document.querySelector("#email-code-open");
  const passwordInput=document.querySelector('[name="password"]');

  const baseRenderAuthMode=renderAuthMode;
  renderAuthMode=function(){
    baseRenderAuthMode();
    const signup=authMode==="signup";
    if(passwordField)passwordField.hidden=signup;
    if(passwordInput)passwordInput.required=!signup;
    if(emailCodeButton)emailCodeButton.hidden=signup;
    const submit=document.querySelector("#auth-submit");
    if(submit)submit.textContent=signup?"Create account and send code":"Sign in";
    if(otpForm)otpForm.hidden=true;
    if(authForm)authForm.hidden=false;
    if(authSwitch)authSwitch.hidden=false;
  };

  function setAuthError(message){
    const error=document.querySelector("#auth-error");
    if(error)error.textContent=message||"";
  }
  function showOtp(email,metadata,isSignup){
    pendingEmail=email;pendingMetadata=metadata;pendingIsSignup=isSignup;
    authForm.hidden=true;
    authSwitch.hidden=true;
    otpForm.hidden=false;
    otpForm.elements.otp_email.value=email;
    otpForm.elements.otp_token.value="";
    document.querySelector("#otp-error").textContent="";
    document.querySelector("#otp-stage-message").textContent=
      "We sent a verification email to "+email+". If it contains a code, enter it below. If it contains a sign-in link, click that link to finish.";
    document.querySelector("#otp-submit").textContent=isSignup?"Verify email and create account":"Verify code and sign in";
    otpForm.elements.otp_token.focus();
  }
  async function sendEmail(email,metadata,isSignup){
    if(!db)throw new Error("Student accounts are not connected to Supabase.");
    const options={shouldCreateUser:Boolean(isSignup),emailRedirectTo:window.location.origin+window.location.pathname};
    if(isSignup)options.data=metadata;
    const result=await db.auth.signInWithOtp({email,options});
    if(result.error)throw result.error;
    showOtp(email,metadata,isSignup);
  }

  document.querySelector("#google-auth").addEventListener("click",async function(){
    if(!db){setAuthError("Student accounts are not connected to Supabase.");return}
    const button=this;button.disabled=true;button.textContent="Opening Google…";setAuthError("");
    try{
      const result=await db.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin+window.location.pathname}});
      if(result.error)throw result.error;
    }catch(error){
      const msg=String(error?.message||"");
      setAuthError(/provider|google|unsupported/i.test(msg)
        ?"Google sign-in is not enabled in Supabase yet. The project needs its Google OAuth Client ID and Secret."
        :msg||"Could not start Google sign-in. Try the email option.");
      button.disabled=false;button.innerHTML='<span aria-hidden="true">G</span> Continue with Google';
    }
  });

  emailCodeButton.addEventListener("click",async function(){
    const email=String(authForm.elements.email.value||"").trim();
    if(!email){setAuthError("Enter your email address first.");authForm.elements.email.focus();return}
    this.disabled=true;this.textContent="Sending verification email…";setAuthError("");
    try{await sendEmail(email,null,false)}
    catch(error){setAuthError("We could not send a student sign-in email. Student delivery needs a configured email service in Supabase. "+(error.message||""))}
    finally{this.disabled=false;this.textContent="Email me a sign-in code"}
  });

  document.addEventListener("submit",async function(event){
    if(event.target?.id!=="auth-form"||authMode!=="signup")return;
    event.preventDefault();event.stopImmediatePropagation();
    const form=authForm,fd=new FormData(form),email=String(fd.get("email")||"").trim(),name=String(fd.get("name")||"").trim();
    const button=document.querySelector("#auth-submit");
    if(!name){setAuthError("Enter your full name to create your student account.");form.elements.name.focus();return}
    const metadata={
      full_name:name,
      test_type:String(fd.get("test_type")||"Academic"),
      target_band:String(fd.get("target_band")||"7.0"),
      daily_study_minutes:String(fd.get("daily_study_minutes")||"60"),
      exam_date:String(fd.get("exam_date")||"")
    };
    button.disabled=true;button.textContent="Sending verification email…";setAuthError("");
    try{await sendEmail(email,metadata,true)}
    catch(error){setAuthError("We could not send the verification email to this student address. Supabase needs a production email delivery service configured. "+(error.message||""))}
    finally{button.disabled=false;button.textContent="Create account and send code"}
  },true);

  otpForm.addEventListener("submit",async function(event){
    event.preventDefault();
    const email=String(otpForm.elements.otp_email.value||pendingEmail||"").trim();
    const token=String(otpForm.elements.otp_token.value||"").trim();
    const button=document.querySelector("#otp-submit"),error=document.querySelector("#otp-error");
    if(!email||!token){error.textContent="Enter the verification code from the email.";return}
    button.disabled=true;button.textContent="Verifying…";error.textContent="";
    try{
      const result=await db.auth.verifyOtp({email,token,type:"email"});
      if(result.error)throw result.error;
      pendingEmail=null;pendingMetadata=null;pendingIsSignup=false;
      closeAuth();await refreshApp();
      toast("Email verified. Your student progress is ready.");
    }catch(err){error.textContent=err.message||"That code could not be verified. Check it and try again."}
    finally{button.disabled=false;button.textContent=pendingIsSignup?"Verify email and create account":"Verify code and sign in"}
  });

  document.querySelector("#otp-resend").addEventListener("click",async function(){
    if(!pendingEmail)return;
    const button=this;button.disabled=true;button.textContent="Sending…";
    try{await sendEmail(pendingEmail,pendingMetadata,pendingIsSignup);toast("A fresh verification email was sent.")}
    catch(error){document.querySelector("#otp-error").textContent=error.message||"Could not resend the verification email."}
    finally{button.disabled=false;button.textContent="Send another code"}
  });
  document.querySelector("#otp-back").addEventListener("click",function(){
    pendingEmail=null;pendingMetadata=null;pendingIsSignup=false;
    otpForm.hidden=true;authForm.hidden=false;authSwitch.hidden=false;renderAuthMode();
  });

  applySavedCourse();
  refreshApp();
})();
