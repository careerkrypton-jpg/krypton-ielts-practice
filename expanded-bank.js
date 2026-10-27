/* Expanded original practice bank and extended 100-question mocks. */
(function(){
  const choose=(items,n)=>items[((n%items.length)+items.length)%items.length];
  const mixOptions=(answer,decoys,index)=>{
    const items=[answer];
    for(const candidate of decoys){if(!items.includes(candidate))items.push(candidate);if(items.length===3)break;}
    while(items.length<3)items.push("Another option");
    const offset=((index%3)+3)%3;
    return items.map((_,i)=>items[(i+offset)%3]);
  };
  const q=(text,answer,decoys,index,why)=>({q:text,options:mixOptions(answer,decoys,index),answer:(3-(index%3))%3,why});
  const people=["Asha","Milan","Sara","Ravi","Nora","Daniel","Pema","Leah","Omar","Tara"];
  const topics=["a bicycle repair course","a weekend language class","a community garden","a student art show","a science field visit","a local history walk","a library workshop","a music festival","a research project","a sports centre"];
  const places=["the north entrance","room 204","the riverside hall","the central library","the student union","the west gate","the garden office","the main gallery","the research centre","the station desk"];
  const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const times=["8:15","9:30","10:45","12:00","13:20","14:30","16:00","17:15"];
  const prices=["£6","£8","£10","£12","£15","£18","£20","£24"];
  const items=["photo identification","a notebook","a reusable bottle","a bank card","a printed form","comfortable shoes","a student card","a packed lunch"];
  const listenFormats=["Part 1 · Enquiry","Part 2 · Visitor information","Part 3 · Student discussion","Part 4 · Short lecture"];
  const listening=Array.from({length:100},(_,i)=>{
    const name=choose(people,i),topic=choose(topics,i*3+1),place=choose(places,i*5+2),day=choose(days,i*2+3),time=choose(times,i*7+4),price=choose(prices,i*3+5),item=choose(items,i*5+6);
    const fees=prices,dayChoices=days,timeChoices=times,placeChoices=places,itemChoices=items;
    const transcript=i%4===0
      ? `STAFF: Hello, ${topic}. How can I help?\n${name.toUpperCase()}: I would like to register.\nSTAFF: The fee is ${price}, and the next session is on ${day} at ${time}. Please meet at ${place}.\n${name.toUpperCase()}: Is there anything I should bring?\nSTAFF: Yes, please bring ${item}. You can collect your welcome pack when you arrive.`
      : i%4===1
      ? `Welcome to ${topic}. Visitors should enter through ${place}. The next guided session begins at ${time} on ${day}. Tickets cost ${price}. Please bring ${item}; staff can help at the information desk if you have questions.`
      : i%4===2
      ? `TUTOR: Have you finished planning ${topic}?\n${name.toUpperCase()}: Almost. We are meeting at ${place} on ${day} at ${time}.\nTUTOR: Good. Remember the registration fee is ${price}.\n${name.toUpperCase()}: I will bring ${item} and share the notes with the group.`
      : `Today's short lecture is about ${topic}. The programme begins at ${time} on ${day}, with participants gathering at ${place}. The materials fee is ${price}. Each person should bring ${item}. The organisers will send a summary to everyone after the session.`;
    const label=`Practice set ${String(i+1).padStart(3,"0")}`;
    return {id:`bank-listen-${i+1}`,course:"Both",title:`${label} · ${topic}`,level:i%3===0?"Intermediate":"Upper intermediate",format:listenFormats[i%4],transcript,questions:[
      q("How much is the fee?",price,fees.filter(x=>x!==price),i,"The speaker states the fee directly in the recording."),
      q("When does the session take place?",day,dayChoices.filter(x=>x!==day),i+1,"The day is stated in the schedule."),
      q("What time does it begin?",time,timeChoices.filter(x=>x!==time),i+2,"The start time is given in the announcement."),
      q("What should the participant bring?",item,itemChoices.filter(x=>x!==item),i+3,"The speaker names the item participants should bring.")
    ]};
  });

  const subjects=["urban trees","community transport","public libraries","water conservation","local food markets","museum learning","coastal habitats","renewable energy","public parks","adult education","wildlife corridors","historic buildings","shared workspaces","school gardens","city cycling","recycling services","night-time lighting","language exchanges","heritage trails","public health campaigns"];
  const aims=["make a service easier for residents to access","preserve knowledge that might otherwise be lost","reduce waste while keeping useful materials in circulation","help people learn practical skills together","collect evidence before a wider change is introduced","make public spaces more welcoming to different age groups","support small local organisations with shared resources","improve access without increasing the amount of new construction","encourage residents to take part in local decisions","protect a resource while maintaining everyday use"];
  const challenges=["limited staff time","uneven participation across neighbourhoods","the cost of maintaining equipment","a shortage of suitable public space","difficulty comparing results between locations","the need to communicate changes clearly","seasonal changes in demand","the availability of reliable long-term data","different needs among first-time and experienced users","the time required to train volunteers"];
  const findings=["participants returned more often when sessions were scheduled regularly","clear signs helped visitors use the service independently","the trial worked best when local groups helped shape its design","sharing equipment reduced the need for duplicate purchases","short training sessions improved confidence among new volunteers","the results varied according to the size and layout of each location","residents valued practical advice as much as access to the facility","a small pilot revealed problems that were not obvious during planning","participation increased when information was offered in several formats","the strongest gains appeared after organisers adjusted the timetable"];
  const actions=["publish a simple guide before expanding the programme","repeat the trial in a different neighbourhood","invite users to review the service twice a year","record both costs and participation over a longer period","provide a short induction for new participants","keep the original option available during the transition","share the findings with nearby organisations","make the timetable easier to find online","collect feedback from people who did not take part","review the plan after the first full season"];
  const reading=Array.from({length:100},(_,i)=>{
    const isGT=i>=50,n=isGT?i-50:i,subject=choose(subjects,n*3+1),aim=choose(aims,n*7+2),challenge=choose(challenges,n*5+3),finding=choose(findings,n*9+4),action=choose(actions,n*11+5),year=2018+(n%9);
    const title=isGT?`Community notice ${String(n+1).padStart(2,"0")} · ${subject}`:`Research brief ${String(n+1).padStart(2,"0")} · ${subject}`;
    const passage=isGT
      ? `The ${subject} project will begin its next six-week trial on ${choose(days,n)}. Its aim is to ${aim}. The main challenge so far has been ${challenge}. In the previous trial, organisers found that ${finding}. Residents can join a short information session at ${choose(times,n*2)}; no previous experience is required. Participants are asked to register before ${choose(days,n+2)} so the team can prepare enough materials. The organisers plan to ${action}. Updated dates will be posted at the local information desk.`
      : `A research group studied how local programmes related to ${subject} could be improved. The work began in ${year} with a small pilot involving three neighbourhoods. Its purpose was to ${aim}. Researchers identified ${challenge} as a factor that could affect results. They also observed that ${finding}. The team cautioned that the pilot did not represent every location, because resources and local priorities differed. On the basis of the evidence, the report recommends that organisers ${action}. It concludes that further observation is needed before the approach is treated as a general solution.`;
    const fmt=isGT?"General Training · Multiple choice":"Academic · Multiple choice";
    return {id:`bank-read-${i+1}`,course:isGT?"General Training":"Academic",title,level:"Intermediate",format:fmt,passage,questions:[
      q("What is the main aim of the project?",aim,aims.filter(x=>x!==aim),n,"The first paragraph states the project’s purpose."),
      q("Which challenge did the organisers identify?",challenge,challenges.filter(x=>x!==challenge),n+1,"The passage names this as a factor affecting the work."),
      q("What did the earlier trial show?",finding,findings.filter(x=>x!==finding),n+2,"This finding is reported from the previous trial."),
      q("What action is recommended next?",action,actions.filter(x=>x!==action),n+3,"The final part of the passage gives this recommendation.")
    ]};
  });

  const chartTopics=["weekly study hours in two colleges","household recycling rates in three towns","commuting methods used by office workers","visitor numbers at four museums","energy use in two public buildings","monthly rainfall in three regions","library membership by age group","water use in four neighbourhoods","online course completion rates","household spending on transport"];
  const essayTopics=["public transport","school uniforms","remote work","online learning","city green spaces","public libraries","consumer recycling","international tourism","technology in classrooms","community volunteering","urban housing","healthy eating","public art","working hours","university fees","children and screen time","local sports facilities","career training","public information services","environmental rules"];
  const letterTopics=["a delayed delivery","a noisy building repair","a changed class timetable","a missing item at a hotel","a local event invitation","a request for work experience","a faulty household appliance","a volunteer schedule change","a new neighbour introduction","a community facility suggestion"];
  const writeAcademic=Array.from({length:50},(_,i)=>{
    const topic=choose(chartTopics,i*3+1),essay=choose(essayTopics,i*7+2);
    const type=i%5;
    if(type<2)return {id:`bank-write-a1-${i+1}`,course:"Academic",title:`Academic Task 1 · ${topic} · ${i+1}`,level:"Academic · Task 1",format:"Report practice",time:20,prompt:`The chart compares ${topic} across the period shown. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Use the figures supplied in the task card: group A: ${28+i%17}%, group B: ${19+i%13}%, and group C: ${14+i%11}% in the first year; group A: ${33+i%17}%, group B: ${22+i%13}%, and group C: ${17+i%11}% in the final year.`,hint:"Write at least 150 words. Give an overview, select key comparisons, and avoid explaining causes that are not shown."};
    if(type===2)return {id:`bank-write-process-${i}`,course:"Academic",title:`Academic Task 1 · Process ${i+1}`,level:"Academic · Task 1",format:"Process practice",time:20,prompt:`The diagram shows how a neighbourhood ${choose(["community garden","recycling centre","bike-share service","public library","water filter"],i)} is organised, from the first stage to the final outcome. Summarise the process by selecting and reporting the main features.`,hint:"Write at least 150 words. Describe the stages in sequence and identify where the process begins and ends."};
    if(type===3)return {id:`bank-write-map-${i}`,course:"Academic",title:`Academic Task 1 · Map ${i+1}`,level:"Academic · Task 1",format:"Map practice",time:20,prompt:`The maps show a ${choose(["riverside district","university campus","public park","small town centre","coastal village"],i)} before and after redevelopment. Summarise the main changes and make relevant comparisons.`,hint:"Write at least 150 words. Group related changes and use accurate language for location and development."};
    return {id:`bank-write-essay-${i}`,course:"Academic",title:`Academic Task 2 · ${essay} · ${i+1}`,level:"Academic · Task 2",format:"Essay practice",time:40,prompt:`Some people think that ${choose(["governments should invest more in","individuals should take greater responsibility for","schools should place greater emphasis on","cities should limit the growth of","employers should provide more support for"],i)} ${essay}. To what extent do you agree or disagree? Give reasons for your answer and include relevant examples from your knowledge or experience.`,hint:"Write at least 250 words. Present a clear position, develop each main idea, and use relevant examples."};
  });
  const writeGeneral=Array.from({length:50},(_,i)=>{
    const topic=choose(letterTopics,i*3+1),essay=choose(essayTopics,i*5+4),task2=i%4===3;
    if(task2)return {id:`bank-write-gt2-${i+1}`,course:"General Training",title:`General Training Task 2 · ${essay} · ${i+1}`,level:"General Training · Task 2",format:"Essay practice",time:40,prompt:`People have different views about the role of ${essay} in everyday life. Discuss both views and give your own opinion. Support your ideas with reasons and examples.`,hint:"Write at least 250 words. Discuss both sides and make your own opinion clear."};
    return {id:`bank-write-letter-${i+1}`,course:"General Training",title:`General Training Task 1 · ${topic} · ${i+1}`,level:"General Training · Task 1",format:"Letter practice",time:20,prompt:`You have experienced ${topic}. Write a letter to the relevant person. Explain what happened, describe how it affected you, and say what action you would like them to take.`,hint:"Write at least 150 words. Cover all three points and choose a suitable formal, semi-formal, or friendly tone."};
  });
  const speakingTopics=["a useful skill","a memorable journey","a person who inspires you","a place to relax","a helpful piece of advice","a book you enjoyed","a local celebration","a piece of technology","a meal you shared","a time you solved a problem","a teacher who influenced you","a photograph you value","a sport you tried","a job you would like","a public place you visit","a goal you achieved","a gift you gave","a change in your area","a film you watched","a time you worked in a team","a subject you want to learn","an environmental change","a quiet place","a tradition in your family","a decision that was difficult"];
  const speaking=Array.from({length:100},(_,i)=>{
    const topic=choose(speakingTopics,i*7+2),part=i%4;
    const prompt=part===0?`Part 1 interview: ${topic}. What do you think about this topic? How often does it affect your daily life? Has your opinion changed over time? Give a reason or example for each answer.`
      :part===1?`Part 2 cue card: Describe ${topic}. You should say what it is or who is involved, when you experienced it, what happened, and explain why it was important to you. Prepare notes for one minute and speak for up to two minutes.`
      :part===2?`Part 3 discussion: ${topic}. Why do people have different experiences of this? How might it change in the future? What could communities or institutions do to improve the situation?`
      :`Part 1 interview: Talk about ${topic}. Do you enjoy it? What do people your age usually think about it? Would you like to do more of it in the future? Explain your answers.`;
    return {id:`bank-speak-${i+1}`,course:"Both",title:`Speaking practice ${String(i+1).padStart(3,"0")} · ${topic}`,level:`Part ${part===1?"2":part===2?"3":"1"} · ${part===1?"Cue card":part===2?"Discussion":"Interview"}`,format:"Speaking practice",time:3,prompt,hint:part===1?"Use the one-minute preparation timer, then speak for up to two minutes.":"Respond in complete thoughts and support your answers with a reason, comparison, or specific example."};
  });

  PACKS.listening.push(...listening);
  PACKS.reading.push(...reading);
  PACKS.writing.push(...writeAcademic,...writeGeneral);
  PACKS.speaking.push(...speaking);
  for(const skill of ["listening","reading","writing","speaking"]){
    const total=PACKS[skill].length;
    const qCount=PACKS[skill].reduce((n,t)=>n+(t.questions?.length||0),0);
    SKILL_META[skill].count=skill==="listening"||skill==="reading"
      ? total+" practice sets · "+qCount+" questions"
      : total+" original practice prompts";
  }

  const previousCurrentMockTask=currentMockTask;
  currentMockTask=function(){
    if(mockState?.mock?.extendedTasks)return mockState.mock.extendedTasks[mockState.index]||null;
    return previousCurrentMockTask();
  };
  const previousStartMock=startMock;
  startMock=function(id){
    if(id!=="full-academic"&&id!=="full-general"){previousStartMock(id);return}
    if(!requireLogin())return;
    const course=id==="full-general"?"General Training":"Academic";
    const pick=(skill,count)=>PACKS[skill].filter(t=>t.course==="Both"||t.course===course).filter(t=>Array.isArray(t.questions));
    const sample=(arr,n)=>{const pool=arr.slice(),out=[];while(pool.length&&out.length<n){out.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0])}return out};
    const listenSets=sample(pick("listening"),13),readSets=sample(pick("reading"),13);
    const listenQuestions=listenSets.flatMap(t=>t.questions).slice(0,50);
    const readQuestions=readSets.flatMap(t=>t.questions).slice(0,50);
    const listenTask={id:"extended-listening-"+Date.now(),course,title:"Listening · 50 questions",level:"Extended mock · Listening",format:"50-question listening section",transcript:listenSets.map((t,i)=>"Recording "+(i+1)+": "+t.title+"\n"+t.transcript).join("\n\n"),questions:listenQuestions};
    const readTask={id:"extended-reading-"+Date.now(),course,title:"Reading · 50 questions",level:"Extended mock · Reading",format:"50-question reading section",passage:readSets.map((t,i)=>"PASSAGE "+(i+1)+": "+t.title+"\n"+t.passage).join("\n\n"),questions:readQuestions};
    const eligibleWriting=PACKS.writing.filter(t=>t.course===course);
    const eligibleSpeaking=PACKS.speaking;
    const writingTask=eligibleWriting[Math.floor(Math.random()*eligibleWriting.length)];
    const speakingTask=eligibleSpeaking[Math.floor(Math.random()*eligibleSpeaking.length)];
    const mock={id:"extended-"+Date.now(),title:course+" Extended IELTS Mock",type:course,extendedTasks:[
      {skill:"listening",task:listenTask},{skill:"reading",task:readTask},{skill:"writing",task:writingTask},{skill:"speaking",task:speakingTask}
    ]};
    mockState={mock,index:0,results:[]};activeActivity=null;activeSkill="listening";currentView="activity";
    document.querySelectorAll(".nav-link").forEach(n=>n.classList.remove("active"));
    document.querySelector("#crumb-title").textContent="FULL MOCK TEST";
    renderMockStep();
  };
  const previousRenderStep=renderMockStep;
  renderMockStep=function(){
    previousRenderStep();
    if(!mockState?.mock?.extendedTasks)return;
    const eyebrow=root.querySelector(".page-intro .eyebrow");
    if(eyebrow)eyebrow.textContent=mockState.mock.type+" · EXTENDED MOCK";
    const intro=root.querySelector(".page-intro p:last-child");
    const part=currentMockTask();
    if(intro&&part)intro.textContent="Section "+(mockState.index+1)+" of 4 · "+SKILL_META[part.skill].label+" · "+(part.task.questions?.length||1)+" question"+((part.task.questions?.length||1)===1?"":"s");
    const badge=root.querySelector(".runner-step");
    if(badge)badge.textContent="SECTION "+(mockState.index+1)+" / 4 · "+SKILL_META[part.skill].label.toUpperCase();
  };
  const previousRenderMocks=renderMocks;
  renderMocks=function(){
    previousRenderMocks();
    const card=root.querySelector(".mock-generator");
    if(!card)return;
    const title=card.querySelector("h2"),description=card.querySelector("p:not(.eyebrow)");
    if(title)title.textContent="Build a fresh 100-question mock";
    if(description)description.textContent="Each attempt selects 50 original Listening questions and 50 Reading questions, plus one Writing task and one Speaking task. There is no attempt limit.";
    card.querySelectorAll("[data-start-mock]").forEach(button=>{
      const course=button.dataset.startMock==="fresh-general"?"general":"academic";
      button.dataset.startMock="full-"+course;
      button.textContent="Start "+(course==="general"?"General Training":"Academic")+" extended mock";
    });
  };
})();
