/* Krypton IELTS Practice enhancements. Original questions only. */
const KRYPTON_EXTRA = {
  listening: [
    {id:"listen-cycle",course:"Both",title:"Joining the city cycle scheme",level:"Intermediate",format:"Part 1 · Enquiry",transcript:"STAFF: Good morning, CityCycle. How can I help?\nMAYA: I’d like to join. Is there a registration fee?\nSTAFF: It is twelve pounds for the year, and the first half-hour of each ride is free.\nMAYA: Where can I collect a bicycle?\nSTAFF: The station beside the central market is open all day. The riverside station closes at ten in the evening.\nMAYA: Do I need to bring anything?\nSTAFF: Please bring photo identification and a bank card. We will send your membership number by email.",questions:[
      {q:"How much is annual registration?",options:["£10","£12","£20"],answer:1,why:"The staff member says the annual fee is twelve pounds."},
      {q:"How long is each ride free?",options:["The first 30 minutes","The first hour","The first two hours"],answer:0,why:"The first half-hour of each ride is free."},
      {q:"Which station is open all day?",options:["The riverside station","The central market station","The university station"],answer:1,why:"The central market station is open all day."},
      {q:"What should Maya bring?",options:["A passport and cash","Photo ID and a bank card","A driving licence only"],answer:1,why:"The staff member requests photo identification and a bank card."}
    ]},
    {id:"listen-fieldwork",course:"Both",title:"Preparing for coastal fieldwork",level:"Upper intermediate",format:"Part 3 · Student discussion",transcript:"TUTOR: Your coastal survey begins on Monday. Have you checked the equipment list?\nRAVI: Yes. The department can lend us sample jars, but we need to bring our own waterproof notebooks.\nELLA: I booked the minibus for half past seven. The tide is lowest at nine, so we should reach the beach before then.\nTUTOR: Good. Work in pairs and record the location of every sample. Please upload your first results by Wednesday afternoon.\nRAVI: I’ll create the map tonight. Ella, could you label the sample jars?\nELLA: Of course. I’ll do that after my seminar.",questions:[
      {q:"Which item must the students bring themselves?",options:["Sample jars","Waterproof notebooks","A measuring tape"],answer:1,why:"The department lends jars, but students bring notebooks."},
      {q:"When is the minibus booked?",options:["7:00","7:30","9:00"],answer:1,why:"Ella booked it for half past seven."},
      {q:"What will Ravi do that evening?",options:["Create a map","Label the jars","Upload the results"],answer:0,why:"Ravi says he will create the map that night."},
      {q:"When are the first results due?",options:["Monday morning","Wednesday afternoon","Friday evening"],answer:1,why:"The tutor asks for the first results by Wednesday afternoon."}
    ]},
    {id:"listen-arts",course:"Both",title:"A community arts centre",level:"Intermediate",format:"Part 2 · Information",transcript:"Welcome to the new Harbour Arts Centre. The main gallery is open Tuesday to Sunday, from ten in the morning until five. Our pottery workshop takes place on Thursday evenings, and beginner places must be booked online. The photography club meets on the first Saturday of each month in Studio Two. Families can borrow free audio guides from the reception desk. The café is currently closed for renovation, but the garden terrace is open whenever the centre is open.",questions:[
      {q:"On which day is the centre closed?",options:["Monday","Thursday","Sunday"],answer:0,why:"Opening days are Tuesday through Sunday."},
      {q:"How should beginners reserve a pottery place?",options:["By phone","At reception","Online"],answer:2,why:"Beginner places must be booked online."},
      {q:"Where does the photography club meet?",options:["The main gallery","Studio Two","The garden terrace"],answer:1,why:"The club meets in Studio Two."},
      {q:"Where can families borrow audio guides?",options:["The reception desk","The café","The pottery room"],answer:0,why:"Audio guides are available at reception."}
    ]},
    {id:"listen-trail",course:"Both",title:"A guided walk in the national park",level:"Upper intermediate",format:"Part 4 · Visitor briefing",transcript:"Before we set off, please check that your water bottle is full. The walk is six kilometres and usually takes about two hours. We will stop at the old observatory for lunch, so keep your food in your day bag. The northern path is closed because of fallen trees; our route follows the lower valley instead. If the weather changes, the ranger station is the nearest shelter. Please stay with the group near the nesting area and avoid using flash photography.",questions:[
      {q:"How long is the walk?",options:["Four kilometres","Six kilometres","Eight kilometres"],answer:1,why:"The guide describes a six-kilometre route."},
      {q:"Where will the group eat lunch?",options:["At the ranger station","By the lake","At the old observatory"],answer:2,why:"Lunch is planned at the old observatory."},
      {q:"Why is the northern path unavailable?",options:["It is flooded","Trees have fallen","It is being resurfaced"],answer:1,why:"The northern path is closed because of fallen trees."},
      {q:"What should visitors avoid near the nesting area?",options:["Using flash photography","Carrying water","Taking notes"],answer:0,why:"The guide asks visitors to avoid flash photography."}
    ]}
  ],
  reading: [
    {id:"read-seeds",course:"Academic",title:"Seed libraries and local food",level:"Intermediate",format:"Academic passage · Multiple choice",passage:"A seed library allows residents to borrow seeds for a growing season and return some of the seeds they harvest. The idea can preserve locally adapted plant varieties and make gardening more affordable. Successful projects usually provide clear instructions because saving seeds from every plant is not straightforward. Some crops cross-pollinate easily, while others produce seeds that do not resemble the parent plant. Organisers therefore publish guidance on which varieties are suitable for beginners. Seed libraries also host workshops, turning a simple exchange into a place where neighbours share practical knowledge.",questions:[
      {q:"What is one aim of a seed library?",options:["To protect local plant varieties","To replace public gardens","To sell rare vegetables"],answer:0,why:"The passage says seed libraries can preserve locally adapted varieties."},
      {q:"Why do projects provide instructions?",options:["Seed saving can be difficult","Residents cannot borrow seeds","All crops need the same treatment"],answer:0,why:"The passage explains that seed saving is not straightforward."},
      {q:"What do organisers do for beginners?",options:["Provide suitable-variety guidance","Guarantee a harvest","Deliver plants to homes"],answer:0,why:"They publish guidance on varieties suitable for beginners."},
      {q:"What can workshops encourage?",options:["Neighbour-to-neighbour learning","Commercial seed sales","Fewer growing seasons"],answer:0,why:"Workshops let neighbours exchange practical knowledge."}
    ]},
    {id:"read-nightlight",course:"Academic",title:"Reducing artificial light at night",level:"Upper intermediate",format:"Academic passage · True/False/Not Given",passage:"Street lighting improves visibility, but poorly directed light can spill into homes and alter the behaviour of nocturnal animals. Several towns have tested warmer-coloured lamps and shields that point light towards the pavement. In one pilot, energy use fell after lights were dimmed on streets with little late-night traffic. Residents were consulted before the change, and safety concerns were monitored through local reports. Researchers caution that results from one district cannot automatically be applied to every road, since traffic patterns and building layouts differ.",questions:[
      {q:"Some street lights can shine into nearby homes.",options:["True","False","Not Given"],answer:0,why:"The passage says poorly directed light can spill into homes."},
      {q:"The pilot used colder-coloured lamps to reduce energy use.",options:["True","False","Not Given"],answer:1,why:"The pilot tested warmer-coloured lamps."},
      {q:"Every resident supported dimming the lights.",options:["True","False","Not Given"],answer:2,why:"The passage says residents were consulted but does not state that every resident supported it."},
      {q:"The same lighting plan will work on every road.",options:["True","False","Not Given"],answer:1,why:"The researchers say local conditions differ and results cannot be assumed to transfer."}
    ]},
    {id:"read-repair",course:"Academic",title:"The rise of repair cafés",level:"Upper intermediate",format:"Academic passage · Matching information",passage:"Repair cafés invite people to bring damaged household items to a shared venue where volunteer repairers offer advice. The events are not intended to replace professional services; their value lies partly in teaching practical skills. Organisers have found that a well-stocked tool library helps, although specialist parts remain difficult to source. Some councils support the events because extending the life of appliances can reduce waste. Others see them as useful social spaces, especially for residents who might otherwise have few opportunities to meet neighbours.",questions:[
      {q:"What is a main educational benefit of repair cafés?",options:["Visitors learn practical skills","People avoid all professional repairs","Products are replaced more quickly"],answer:0,why:"The passage identifies teaching practical skills as part of their value."},
      {q:"What can be hard to obtain?",options:["Volunteer time","Specialist parts","Public venues"],answer:1,why:"The passage says specialist parts remain difficult to source."},
      {q:"Why do some councils support the events?",options:["They may reduce waste","They create new appliances","They raise household bills"],answer:0,why:"Extending appliance life can reduce waste."},
      {q:"What social role can the cafés play?",options:["They give neighbours a place to meet","They provide private offices","They replace local libraries"],answer:0,why:"They can be social spaces where residents meet."}
    ]},
    {id:"read-rent",course:"General Training",title:"Noticeboard: changes to a rental building",level:"Intermediate",format:"General Training · Notice",passage:"BUILDING NOTICE: From 12 June, the front entrance will be unavailable for three days while the access ramp is repaired. Residents should use the side entrance beside the bicycle store. Deliveries can be left with the caretaker between 8:00 and 16:00. The lift will remain in service. Please move bicycles away from the marked work area by 10 June. If you need help carrying large items, contact the management office before the work begins.",questions:[
      {q:"How long will the front entrance be closed?",options:["Two days","Three days","One week"],answer:1,why:"The notice says the entrance is unavailable for three days."},
      {q:"Where should residents enter the building?",options:["Beside the bicycle store","Through the management office","At the rear car park"],answer:0,why:"Residents are asked to use the side entrance by the bicycle store."},
      {q:"When can the caretaker receive deliveries?",options:["8:00–16:00","9:00–17:00","All night"],answer:0,why:"The delivery window is from 8:00 to 16:00."},
      {q:"What should residents do by 10 June?",options:["Book the lift","Move their bicycles","Collect a new key"],answer:1,why:"Bicycles must be moved away from the work area."}
    ]},
    {id:"read-course",course:"General Training",title:"Course information: evening language classes",level:"Intermediate",format:"General Training · Course notice",passage:"The Westbridge Learning Centre is enrolling adults for its autumn evening classes. Lessons begin on 3 September and run for ten weeks. The registration form must be submitted by 20 August. Learners who need to change level can attend a free placement interview on Tuesday or Thursday afternoons. Course books are not included in the fee, but the centre library keeps reference copies. If a lesson is cancelled by the centre, a replacement class will be arranged.",questions:[
      {q:"When do lessons begin?",options:["20 August","3 September","10 September"],answer:1,why:"The notice gives 3 September as the start date."},
      {q:"By when must the form be sent?",options:["20 August","3 September","The first lesson"],answer:0,why:"Registration closes on 20 August."},
      {q:"What can learners do if they need a different level?",options:["Book a free placement interview","Buy a new course","Wait until the next term"],answer:0,why:"The centre offers a free placement interview."},
      {q:"What happens if the centre cancels a lesson?",options:["The fee is doubled","A replacement class is arranged","Learners receive course books"],answer:1,why:"The centre arranges a replacement class."}
    ]},
    {id:"read-volunteer",course:"General Training",title:"Volunteer rota for the food garden",level:"Upper intermediate",format:"General Training · Email",passage:"Hello volunteers, Our community food garden is changing its Saturday rota next month. The morning team will work from 8:30 until 11:30, while the afternoon group will meet from 13:00 to 15:30. Please reply to this email by Friday if you need to swap a shift. New volunteers should attend the safety briefing in the tool shed at 8:15. Gloves are provided, but please bring a reusable water bottle. In heavy rain, check the group message before travelling because the session may be postponed.",questions:[
      {q:"How long does the morning shift last?",options:["Two hours","Three hours","Three and a half hours"],answer:1,why:"The morning team works from 8:30 until 11:30."},
      {q:"When should a volunteer request a shift change?",options:["By Friday","On Saturday morning","After the session"],answer:0,why:"The email asks people to reply by Friday."},
      {q:"Where is the safety briefing?",options:["At the entrance","In the tool shed","In the library"],answer:1,why:"New volunteers meet in the tool shed."},
      {q:"What should volunteers check in heavy rain?",options:["The group message","The local newspaper","The centre website"],answer:0,why:"They should check the group message before travelling."}
    ]}
  ],
  writing: [
    {id:"write-chart-water",course:"Academic",title:"Household water use",level:"Academic · Task 1",format:"Report practice",time:20,prompt:"The table shows the share of household water used for three purposes in one town in 2010 and 2025: showers 28% and 34%; laundry 24% and 21%; gardening 18% and 12%. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",hint:"Write at least 150 words. Lead with the largest overall change, then compare all three categories without giving an opinion."},
    {id:"write-process",course:"Academic",title:"How recycled paper is made",level:"Academic · Task 1",format:"Process practice",time:20,prompt:"The diagram describes how used paper is collected, sorted, pulped, cleaned and turned into new sheets. Summarise the process by selecting and reporting the main features.",hint:"Write at least 150 words. Describe the stages in order and use clear process language."},
    {id:"write-community",course:"Academic",title:"Public transport investment",level:"Academic · Task 2",format:"Essay practice",time:40,prompt:"Some cities are considering making public transport free for all residents. Do the advantages of this policy outweigh the disadvantages? Give reasons and examples for your answer.",hint:"Write at least 250 words. Weigh accessibility and congestion against funding and capacity, then make your position clear."},
    {id:"write-remote",course:"Academic",title:"Working from home",level:"Academic · Task 2",format:"Essay practice",time:40,prompt:"Many employees now work from home for part of the week. Is this a positive or negative development? Explain your view with relevant examples.",hint:"Write at least 250 words. Discuss effects on workers and organisations, and support your judgement."},
    {id:"write-repair-letter",course:"General Training",title:"A problem with a repaired laptop",level:"General Training · Task 1",format:"Letter practice",time:20,prompt:"You recently paid a shop to repair your laptop, but it is still not working properly. Write a letter to the manager. Explain the problem, describe what happened when you returned, and say what you would like the shop to do.",hint:"Write at least 150 words. Use a suitable tone and cover all three points."},
    {id:"write-neighbour",course:"General Training",title:"Inviting a neighbour to a local event",level:"General Training · Task 1",format:"Letter practice",time:20,prompt:"A community event is taking place in your area next month. Write a letter to a neighbour inviting them, describing the event, and explaining how you can travel there together.",hint:"Write at least 150 words. Keep the invitation friendly and include clear practical details."},
    {id:"write-library-letter",course:"General Training",title:"Requesting a library service",level:"General Training · Task 1",format:"Letter practice",time:20,prompt:"Your local library has changed its opening hours. Write to the librarian explaining why the new hours are difficult for you, describing when you usually visit, and suggesting a change.",hint:"Write at least 150 words. Explain your situation politely and make a realistic suggestion."},
    {id:"write-online",course:"General Training",title:"Learning new skills at work",level:"General Training · Task 2",format:"Essay practice",time:40,prompt:"Some people believe employers should provide regular training for all staff, while others think workers should arrange their own learning. Discuss both views and give your opinion.",hint:"Write at least 250 words. Develop both positions and state your own view clearly."}
  ],
  speaking: [
    {id:"speak-routine",course:"Both",title:"Daily routines",level:"Part 1 · Interview",format:"Speaking practice",time:4,prompt:"What is the busiest part of your day? Do you prefer planning your day or deciding as you go? Has your routine changed in recent years?",hint:"Answer each question naturally. Add a reason or a brief example rather than giving one-word answers."},
    {id:"speak-object",course:"Both",title:"An object you use often",level:"Part 2 · Cue card",format:"Speaking practice",time:3,prompt:"Describe an object you use regularly. You should say what it is, when you first got it, how you use it, and explain why it is useful to you.",hint:"Make brief notes for one minute, then speak for up to two minutes. Include one specific example."},
    {id:"speak-colleague",course:"Both",title:"A helpful person",level:"Part 2 · Cue card",format:"Speaking practice",time:3,prompt:"Describe a person who helped you learn something. You should say who the person is, what you learned, how they helped, and explain how you felt about the experience.",hint:"Organise the answer as context, example, result and reflection."},
    {id:"speak-book",course:"Both",title:"A book or article you found useful",level:"Part 2 · Cue card",format:"Speaking practice",time:3,prompt:"Describe a book or article that you found useful. You should say what it was about, when you read it, what you learned, and explain why it was useful.",hint:"Give enough detail for a two-minute talk and explain how you used what you learned."},
    {id:"speak-volunteering",course:"Both",title:"Volunteering and communities",level:"Part 3 · Discussion",format:"Speaking practice",time:5,prompt:"Why do people volunteer? Should schools encourage students to help in their communities? What kinds of volunteering may become more common in the future?",hint:"Develop each answer with a reason, example and consequence."},
    {id:"speak-publicspaces",course:"Both",title:"Public spaces",level:"Part 3 · Discussion",format:"Speaking practice",time:5,prompt:"What makes a public space enjoyable? How can parks serve people of different ages? Should local residents influence how public spaces are designed?",hint:"Compare different users’ needs and support your opinion with a specific example."},
    {id:"speak-milestone",course:"Both",title:"A goal you achieved",level:"Part 2 · Cue card",format:"Speaking practice",time:3,prompt:"Describe a goal you achieved. You should say what the goal was, why it mattered, what you did to achieve it, and explain how you felt afterwards.",hint:"Tell the story in order and include one obstacle and how you responded."},
    {id:"speak-media",course:"Both",title:"News and social media",level:"Part 3 · Discussion",format:"Speaking practice",time:5,prompt:"Where do people get news today? How can readers judge whether a story is reliable? Do you think social media has changed public discussion for the better?",hint:"Give balanced answers. Explain your view and use a relevant example."}
  ]
};
Object.keys(KRYPTON_EXTRA).forEach(function(skill){PACKS[skill].push.apply(PACKS[skill],KRYPTON_EXTRA[skill]);});
PACKS.listening.forEach(function(task){if(!task.course)task.course="Both";});
PACKS.speaking.forEach(function(task){if(!task.course)task.course="Both";});
PACKS.reading.forEach(function(task){if(!task.course)task.course="Academic";});
PACKS.writing.forEach(function(task){if(!task.course)task.course=task.level.indexOf("General Training")>=0?"General Training":"Academic";});
SKILL_META.listening.count=PACKS.listening.length+" practice sets";
SKILL_META.reading.count=PACKS.reading.length+" practice sets";
SKILL_META.writing.count=PACKS.writing.length+" task prompts";
SKILL_META.speaking.count=PACKS.speaking.length+" speaking prompts";

let kryptonCourse="Academic";
let kryptonAiFeedback=null;
let kryptonAiError="";
let kryptonAudioBlob=null;
let kryptonMediaRecorder=null;
let kryptonAudioTimer=null;
const kryptonOriginalSubmitActivity=submitActivity;
const kryptonUsedMocks=new Set();
const kryptonProfileColumns="full_name,target_band,test_type,daily_study_minutes,exam_date";

loadProfile=async function(){
  if(!db||!currentUser)return;
  const result=await db.from("profiles").select(kryptonProfileColumns).eq("id",currentUser.id).maybeSingle();
  if(result.error){console.error(result.error);return}
  if(result.data){profile=result.data;return}
  const metadata=currentUser.user_metadata||{};
  const name=metadata.full_name||currentUser.email?.split("@")[0]||"Student";
  const row={id:currentUser.id,full_name:name,target_band:Number(metadata.target_band)||7,test_type:metadata.test_type==="General Training"?"General Training":"Academic",daily_study_minutes:Number(metadata.daily_study_minutes)||60,exam_date:metadata.exam_date||null};
  const created=await db.from("profiles").upsert(row,{onConflict:"id"}).select(kryptonProfileColumns).single();
  profile=created.data||row;
};
loadSessions=async function(){
  if(!db||!currentUser)return;
  const result=await db.from("practice_sessions").select("id,module,activity_id,title,score,total,duration_seconds,mock_id,answer_data,created_at").eq("user_id",currentUser.id).order("created_at",{ascending:false}).limit(100);
  if(result.error){console.error(result.error);setSync("Database setup needed",false);return}
  sessions=result.data||[];
};
const kryptonOriginalRenderAuthMode=renderAuthMode;
renderAuthMode=function(){
  kryptonOriginalRenderAuthMode();
  const signup=authMode==="signup";
  const plan=document.querySelector("#onboarding-fields");
  if(plan)plan.hidden=!signup;
};
const kryptonOriginalRenderOverview=renderOverview;
renderOverview=function(){
  kryptonOriginalRenderOverview();
  const node=root.querySelector(".hero-row");
  if(!node)return;
  const mins=Number(profile?.daily_study_minutes)||60;
  const hours=mins%60===0?(mins/60)+" hour"+(mins===60?"":"s"):Math.floor(mins/60)+"h "+(mins%60)+"m";
  const target=profile?.target_band?Number(profile.target_band).toFixed(1):"7.0";
  const course=profile?.test_type||"Academic";
  const today=stats().today*60;
  const percent=Math.min(100,Math.round(today/mins*100));
  const text=currentUser
    ? "Your "+course+" plan: "+hours+" each day"+(profile?.exam_date?" · test date "+formatDate(profile.exam_date):"")
    : "Create a free account to set your test type, target band and daily study time.";
  const banner='<section class="plan-banner"><div><p class="eyebrow">YOUR PERSONAL STUDY PLAN</p><h2>'+(currentUser?"Target band "+esc(target):"A plan built around your goal")+'</h2><p>'+esc(text)+'</p><div class="plan-progress"><span style="width:'+percent+'%"></span></div></div><div class="plan-target"><span>'+esc(course)+'</span><strong>'+(currentUser?percent+"%":"FREE")+'</strong><span>'+(currentUser?"of today's study target":"No subscriptions")+'</span></div></section>';
  node.insertAdjacentHTML("afterend",banner);
};
function courseForTask(skill,task,course){
  if(skill==="listening"||skill==="speaking")return true;
  return (task.course||"Academic")===course;
}
function courseSwitchMarkup(){
  return '<div class="course-switch" role="group" aria-label="IELTS test type"><button class="course-choice '+(kryptonCourse==="Academic"?"active":"")+'" data-course="Academic">IELTS Academic</button><button class="course-choice '+(kryptonCourse==="General Training"?"active":"")+'" data-course="General Training">General Training</button></div>';
}
renderLibrary=function(){
  const skills=selectedFilter==="all"?SKILLS:[selectedFilter];
  root.innerHTML='<section class="page-intro"><p class="eyebrow">ORIGINAL QUESTIONS · FREE FOR KRYPTON STUDENTS</p><h1>Practice modules</h1><p>Choose your test pathway and practise one skill at a time. Every question set is original Krypton material; new mock combinations are available whenever you want another run.</p></section>'+courseSwitchMarkup()+'<div class="filters"><button class="filter-pill '+(selectedFilter==="all"?"selected":"")+'" data-filter="all">All skills</button>'+SKILLS.map(function(skill){return '<button class="filter-pill '+(selectedFilter===skill?"selected":"")+'" data-filter="'+skill+'">'+SKILL_META[skill].label+'</button>'}).join("")+'</div><section class="lesson-list">'+skills.map(function(skill){return PACKS[skill].filter(function(task){return courseForTask(skill,task,kryptonCourse)}).map(function(task){return lessonCard(skill,task)}).join("")}).join("")+'</section><div class="note-banner">All practice here is free. Questions are written for Krypton and reflect common IELTS task formats. They are not reproduced from Cambridge, British Council or IDP materials.</div>';
};
function coursePracticeCount(course){return SKILLS.reduce(function(sum,skill){return sum+PACKS[skill].filter(function(task){return courseForTask(skill,task,course)}).length},0)}
renderMocks=function(){
  const visible=MOCKS.filter(function(mock){return mock.type===kryptonCourse});
  const possible=SKILLS.reduce(function(product,skill){return product*PACKS[skill].filter(function(task){return courseForTask(skill,task,kryptonCourse)}).length},1);
  root.innerHTML='<section class="page-intro"><p class="eyebrow">UNLIMITED PRACTICE · NO PAYWALLS</p><h1>Mock test studio</h1><p>Start a fresh mixed-skill practice run as often as you like. Each run draws from your selected pathway and rotates original Krypton questions.</p></section>'+courseSwitchMarkup()+'<section class="mock-generator"><div><p class="eyebrow">FRESH FOUR-SKILL PRACTICE</p><h2>Build another mini mock</h2><p>New random Listening, Reading, Writing and Speaking activities on every run. '+possible.toLocaleString()+" possible combinations for "+esc(kryptonCourse)+'. Objective questions are self-marked; AI feedback is available for Writing and Speaking when connected.</p></div><div class="mock-generator-actions"><button class="button button-outline" data-start-mock="fresh-academic">New Academic mock</button><button class="button button-outline" data-start-mock="fresh-general">New General mock</button></div></section><section class="section-head"><div><p class="eyebrow">GUIDED PRACTICE SETS</p><h2>Start from a practice set</h2></div></section><section class="mock-grid">'+visible.map(function(mock){return '<article class="mock-card"><span class="mock-type">'+esc(mock.type)+'</span><h3>'+esc(mock.title)+'</h3><p>One original activity from each of the four skills.</p><div class="mock-steps"><i></i><i></i><i></i><i></i></div><div class="mock-label"><span>4 skills</span><span>Guided practice</span></div><button class="button button-blue" data-start-mock="'+esc(mock.id)+'">Start this mock</button></article>'}).join("")+'</section>';
};
const kryptonOriginalStartMock=startMock;
startMock=function(id){
  if(id!=="fresh-academic"&&id!=="fresh-general"){kryptonOriginalStartMock(id);return}
  if(!requireLogin())return;
  const course=id==="fresh-general"?"General Training":"Academic";
  kryptonCourse=course;
  const picks=SKILLS.map(function(skill){
    const eligible=PACKS[skill].map(function(task,index){return {task:task,index:index}}).filter(function(item){return courseForTask(skill,item.task,course)});
    return eligible[Math.floor(Math.random()*eligible.length)].index;
  });
  const fingerprint=course+":"+picks.join("-");
  kryptonUsedMocks.add(fingerprint);
  const mock={id:"fresh-"+Date.now(),title:course+" practice mix",type:course,picks:picks};
  mockState={mock:mock,index:0,results:[]};
  activeActivity=null;
  activeSkill="listening";
  currentView="activity";
  document.querySelectorAll(".nav-link").forEach(function(n){n.classList.remove("active")});
  document.querySelector("#crumb-title").textContent="MOCK TEST";
  renderMockStep();
};
const kryptonOriginalActivityMarkup=activityMarkup;
activityMarkup=function(skill,task,inMock){
  let html=kryptonOriginalActivityMarkup(skill,task,inMock);
  if(skill==="writing"||skill==="speaking"){
    const label=skill==="writing"?"AI score and save →":"AI score and save →";
    html=html.replace("data-action=\"submit-activity\">"+(inMock?"Save and continue →":"Finish practice and save"),"data-action=\"submit-activity\">"+label);
    html=html.replace('<div class="runner-actions">','<div class="ai-consent">Your response is sent securely to Krypton’s AI scoring service only after you press the scoring button. Feedback is an estimate for practice, not an official IELTS result. Students practise free; each AI score may use Krypton consultancy provider credits.</div><div class="runner-actions">');
  }
  if(skill==="speaking"){
    const controls='<div class="ai-consent"><strong>Optional speaking recording.</strong> If you record, the audio is sent for transcription when you score it and is not kept in your progress history. Your browser will ask before the microphone starts.</div><div class="recording-panel"><button class="audio-btn" type="button" data-action="krypton-record-start">● Record answer</button><button class="audio-btn" type="button" data-action="krypton-record-stop" disabled>■ Stop recording</button><button class="audio-btn" type="button" data-action="krypton-record-clear">Remove recording</button><span class="recording-status" id="krypton-recording-status">No recording yet. You can also submit a written response.</span></div>';
    html=html.replace('<div class="runner-actions">',controls+'<div class="runner-actions">');
  }
  return html;
};
function renderAiFeedbackCard(feedback){
  if(!feedback)return "";
  const criteria=(feedback.criteria||[]).map(function(item){return '<div class="ai-criterion"><strong>'+esc(item.name)+'</strong><span>Estimated band '+esc(item.band)+'</span><p>'+esc(item.feedback)+'</p></div>'}).join("");
  const strengths=(feedback.strengths||[]).map(function(item){return '<li>'+esc(item)+'</li>'}).join("");
  const next=(feedback.next_steps||[]).map(function(item){return '<li>'+esc(item)+'</li>'}).join("");
  const transcript=feedback.transcript?'<details><summary>View the transcript used for feedback</summary><div class="reading-passage">'+esc(feedback.transcript)+'</div></details>':"";
  return '<section class="ai-feedback"><p class="eyebrow">KRYPTON AI PRACTICE FEEDBACK</p><h2>Indicative band estimate</h2><div class="ai-band"><strong>'+esc(feedback.estimated_band)+'</strong><span>practice estimate</span></div><div class="ai-criteria">'+criteria+'</div><h3>What is working</h3><ul>'+strengths+'</ul><h3>Focus for your next attempt</h3><ul>'+next+'</ul><p>'+esc(feedback.next_step||"Choose one suggestion and apply it in your next response.")+'</p>'+transcript+'<p class="ai-disclaimer">AI feedback is for learning only. It is not an official IELTS score. Speaking feedback is based on the transcript and does not judge accent or pronunciation.</p></section>';
}
const kryptonOriginalRenderResult=renderResult;
renderResult=function(skill,task,score,total,response){
  kryptonOriginalRenderResult(skill,task,score,total,response);
  const card=renderAiFeedbackCard(kryptonAiFeedback);
  if(card)root.insertAdjacentHTML("beforeend",card);
  if(kryptonAiError)root.insertAdjacentHTML("beforeend",'<div class="note-banner">'+esc(kryptonAiError)+'</div>');
};
const kryptonOriginalRenderHistory=renderHistory;
renderHistory=function(){
  kryptonOriginalRenderHistory();
  const scored=sessions.filter(function(session){return session.answer_data&&session.answer_data.ai_feedback});
  if(!currentUser||!scored.length)return;
  const items=scored.slice(0,8).map(function(session){
    const feedback=session.answer_data.ai_feedback;
    return '<div class="recent-item"><span class="recent-badge">✦</span><span class="recent-info"><strong>'+esc(session.title)+'</strong><small>'+esc(SKILL_META[session.module]?.label||session.module)+' · '+formatDate(session.created_at)+'</small></span><span class="score-chip">AI '+esc(feedback.estimated_band)+'</span><details><summary>Feedback</summary>'+renderAiFeedbackCard(feedback)+'</details></div>';
  }).join("");
  root.insertAdjacentHTML("beforeend",'<section class="card" style="margin-top:14px"><div class="card-head"><div><p class="eyebrow">WRITING & SPEAKING COACH</p><h2 class="card-title">Saved AI feedback</h2></div></div><div class="recent-list">'+items+'</div></section>');
};
const kryptonOriginalSaveSession=saveSession;
saveSession=async function(skill,task,score,total,response,mockId){
  const answer=Object.assign({},response||{});
  if(kryptonAiFeedback)answer.ai_feedback=kryptonAiFeedback;
  if(kryptonAiFeedback?.transcript)answer.transcript=kryptonAiFeedback.transcript;
  return await kryptonOriginalSaveSession(skill,task,score,total,answer,mockId);
};
function currentKryptonTask(){
  if(mockState)return currentMockTask();
  return activeActivity;
}
function setKryptonRecordingStatus(text){
  const el=document.querySelector("#krypton-recording-status");
  if(el)el.textContent=text;
}
async function startKryptonRecording(){
  if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){toast("Audio recording is not available in this browser. You can type a response instead.");return}
  try{
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});
    const preferred=MediaRecorder.isTypeSupported("audio/webm;codecs=opus")?"audio/webm;codecs=opus":undefined;
    kryptonMediaRecorder=new MediaRecorder(stream,preferred?{mimeType:preferred}:{});
    const chunks=[];
    kryptonMediaRecorder.addEventListener("dataavailable",function(e){if(e.data&&e.data.size)chunks.push(e.data)});
    kryptonMediaRecorder.addEventListener("stop",function(){
      kryptonAudioBlob=new Blob(chunks,{type:kryptonMediaRecorder.mimeType||"audio/webm"});
      stream.getTracks().forEach(function(track){track.stop()});
      setKryptonRecordingStatus("Recording ready · "+Math.max(1,Math.round(kryptonAudioBlob.size/1024))+" KB. It will be sent only when you score.");
      const start=document.querySelector('[data-action="krypton-record-start"]');
      const stop=document.querySelector('[data-action="krypton-record-stop"]');
      if(start)start.disabled=false;
      if(stop)stop.disabled=true;
      clearTimeout(kryptonAudioTimer);
    });
    kryptonMediaRecorder.start();
    const start=document.querySelector('[data-action="krypton-record-start"]');
    const stop=document.querySelector('[data-action="krypton-record-stop"]');
    if(start)start.disabled=true;
    if(stop)stop.disabled=false;
    setKryptonRecordingStatus("Recording. Speak naturally, then press Stop.");
    kryptonAudioTimer=setTimeout(function(){if(kryptonMediaRecorder?.state==="recording")kryptonMediaRecorder.stop()},90000);
  }catch(error){console.error(error);toast("Microphone permission was not granted. You can still type a response.");}
}
function base64FromBlob(blob){
  return blob.arrayBuffer().then(function(buffer){
    const bytes=new Uint8Array(buffer);let binary="";
    for(let offset=0;offset<bytes.length;offset+=0x8000)binary+=String.fromCharCode.apply(null,bytes.subarray(offset,Math.min(offset+0x8000,bytes.length)));
    return btoa(binary);
  });
}
function showScoringError(message){
  const old=document.querySelector("#krypton-ai-inline-error");
  if(old)old.remove();
  const host=document.querySelector(".runner-actions");
  if(host)host.insertAdjacentHTML("beforebegin",'<div class="note-banner" id="krypton-ai-inline-error">'+esc(message)+'</div>');
}
async function scoreKryptonResponse(button){
  const part=currentKryptonTask();
  if(!part)return;
  const skill=part.skill,task=part.task;
  const box=document.querySelector("#student-response");
  let response=(box?.value||"").trim();
  if(skill==="speaking"&&!response&&!kryptonAudioBlob){toast("Write a response or record your speaking answer first.");return}
  if(skill==="writing"&&!response){toast("Write your response before asking for feedback.");box?.focus();return}
  const oldLabel=button.textContent;
  button.disabled=true;button.textContent="Scoring and saving…";
  kryptonAiFeedback=null;kryptonAiError="";
  try{
    const payload={module:skill,course:profile?.test_type||kryptonCourse,task_type:task.level||task.format||skill,prompt:task.prompt||"",response:response};
    if(skill==="speaking"&&kryptonAudioBlob){payload.audio_base64=await base64FromBlob(kryptonAudioBlob);payload.audio_mime_type=kryptonAudioBlob.type||"audio/webm";}
    const result=await db.functions.invoke("score-ielts-response",{body:payload});
    if(result.error)throw result.error;
    kryptonAiFeedback=result.data?.feedback||null;
    if(!kryptonAiFeedback)throw new Error("The scoring service returned no feedback.");
    if(kryptonAiFeedback.transcript&&box){box.value=kryptonAiFeedback.transcript;response=kryptonAiFeedback.transcript}
    if(!response&&kryptonAiFeedback.transcript)response=kryptonAiFeedback.transcript;
    button.textContent=oldLabel;
    await kryptonOriginalSubmitActivity();
  }catch(error){
    console.error("AI scoring unavailable",error);
    kryptonAiFeedback=null;
    kryptonAiError="AI feedback is temporarily unavailable. Your response will still be saved; check the Groq secret or free-tier limit if this continues.";
    showScoringError(kryptonAiError);
    button.disabled=false;button.textContent=skill==="writing"||skill==="speaking"?"Save response":"Save response";
    kryptonAiError="AI feedback is temporarily unavailable. Your response was saved without an AI score.";
    await kryptonOriginalSubmitActivity();
  }finally{
    clearTimeout(kryptonAudioTimer);
    kryptonAudioBlob=null;
    kryptonMediaRecorder=null;
  }
}
/* Authentication is handled by auth-flows.js. */
document.addEventListener("click",function(event){
  const courseButton=event.target.closest("[data-course]");
  if(courseButton){kryptonCourse=courseButton.dataset.course;try{localStorage.setItem("kryptonCourse",kryptonCourse)}catch(_){};render();return}
  const recordStart=event.target.closest('[data-action="krypton-record-start"]');
  if(recordStart){event.preventDefault();event.stopImmediatePropagation();startKryptonRecording();return}
  const recordStop=event.target.closest('[data-action="krypton-record-stop"]');
  if(recordStop){event.preventDefault();event.stopImmediatePropagation();if(kryptonMediaRecorder?.state==="recording")kryptonMediaRecorder.stop();return}
  const clear=event.target.closest('[data-action="krypton-record-clear"]');
  if(clear){event.preventDefault();event.stopImmediatePropagation();if(kryptonMediaRecorder?.state==="recording")kryptonMediaRecorder.stop();kryptonAudioBlob=null;setKryptonRecordingStatus("Recording removed. Nothing will be sent.");return}
  const submit=event.target.closest('[data-action="submit-activity"]');
  if(submit){
    const part=currentKryptonTask();
    if(part&&(part.skill==="writing"||part.skill==="speaking")){
      event.preventDefault();event.stopImmediatePropagation();scoreKryptonResponse(submit);
    }
  }
},true);
function applySavedCourse(){
  const fromProfile=profile?.test_type;
  let saved="";
  try{saved=localStorage.getItem("kryptonCourse")||""}catch(_){}
  kryptonCourse=fromProfile||saved||"Academic";
}
applySavedCourse();
refreshApp();

