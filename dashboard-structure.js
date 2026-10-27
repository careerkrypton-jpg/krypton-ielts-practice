
/* Krypton dashboard refresh: progress-led home, quick practice, and supplied-source references. */
(function(){
  var originalOverview=renderOverview;
  var sourceGroups=[
    {title:"Official format and guidance",items:["Official IELTS Practice Material","Official IELTS Practice Materials 2","The Official Cambridge Guide to IELTS","IELTS Trainer"]},
    {title:"Cambridge practice test series",items:["Cambridge IELTS 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 and 20"]},
    {title:"Skill building and exam language",items:["Writing for IELTS","IELTS Grammar for Bands 6.5 and above","Barron’s Essential Words for IELTS","Common Mistakes at IELTS · Intermediate and Advanced","Barron’s IELTS Practice Exams"]}
  ];
  function performanceHTML(){
    return '<div class="performance-snapshot" hidden>'+SKILLS.map(function(skill){
      var rows=sessions.filter(function(row){return row.module===skill;});
      var objective=rows.filter(function(row){return row.score!==null&&row.total;});
      var total=objective.reduce(function(n,row){return n+(Number(row.total)||0);},0);
      var accuracy=total?Math.round(objective.reduce(function(n,row){return n+(Number(row.score)||0);},0)/total*100):null;
      var headline=accuracy===null?(rows.length?rows.length+" saved":"Start here"):accuracy+"%";
      var caption=accuracy===null?(rows.length?"responses saved":"No sessions yet"):"practice accuracy · not an IELTS band";
      return '<article class="performance-skill"><span>'+esc(SKILL_META[skill].label)+'</span><strong>'+headline+'</strong><small>'+caption+'</small></article>';
    }).join("")+'</div>';
  }
  function sourceShelf(){
    return '<details class="source-shelf"><summary><span class="source-shelf-title">Study sources supplied by Krypton</span><span class="source-shelf-hint">Show reading list ↓</span></summary><div class="source-groups">'+sourceGroups.map(function(group){return '<section class="source-group"><strong>'+esc(group.title)+'</strong><p>'+group.items.map(esc).join(" · ")+'</p></section>';}).join("")+'</div><p class="source-note">These titles guide Krypton’s original practice plans. The public student site does not host or reproduce the supplied commercial book PDFs; students should use their own authorised copies for the full materials.</p></details>';
  }
  function todayFocus(){
    return '<section class="today-focus"><div class="today-focus-head"><div><p class="eyebrow">TODAY’S TASK</p><h2>Choose your next skill</h2></div><span class="tag">FREE</span></div><div class="today-focus-list">'+SKILLS.map(function(skill){
      var task=PACKS[skill]&&PACKS[skill][(new Date().getDate()-1)%PACKS[skill].length];
      if(!task)return "";
      return '<article class="today-focus-item"><span class="today-focus-icon">'+esc(SKILL_META[skill].icon)+'</span><span><strong>'+esc(SKILL_META[skill].label)+'</strong><small>'+esc(task.title)+'</small></span><button data-start-skill="'+esc(skill)+'" data-task="'+esc(task.id)+'">Start →</button></article>';
    }).join("")+'</div></section>';
  }
  function searchResults(query){
    var box=document.querySelector("#overview-search-results");if(!box)return;
    var q=query.trim().toLowerCase();if(!q){box.hidden=true;box.innerHTML="";return}
    var found=[];
    SKILLS.forEach(function(skill){(PACKS[skill]||[]).forEach(function(task){if((task.title+" "+(task.level||"")+" "+(task.format||"")).toLowerCase().indexOf(q)>=0&&found.length<8)found.push({skill:skill,task:task})})});
    box.innerHTML=found.length?found.map(function(item){return '<button data-start-skill="'+esc(item.skill)+'" data-task="'+esc(item.task.id)+'"><span><strong>'+esc(item.task.title)+'</strong><small>'+esc(SKILL_META[item.skill].label)+' · '+esc(item.task.level||item.task.format||"Practice")+'</small></span><b>Start →</b></button>'}).join(""):'<div class="empty-state">No matching practice found. Try a skill, topic, or task type.</div>';
    box.hidden=false;
  }
  renderOverview=function(){
    originalOverview();
    var hero=root.querySelector(".hero-row"),plan=root.querySelector(".plan-banner"),metrics=root.querySelector(".metrics"),moduleHead=root.querySelector(".section-head"),modules=root.querySelector(".module-grid"),dashboard=root.querySelector(".dashboard-grid");
    var notes=Array.from(root.querySelectorAll(".note-banner")),note=notes.find(function(node){return node.textContent.indexOf("original questions")>=0});
    if(!hero||!metrics||!moduleHead||!modules)return;
    var recent=dashboard&&dashboard.children[0],guidance=dashboard&&dashboard.children[1];
    var search=document.createElement("div");
    search.innerHTML='<label class="overview-search"><span class="search-mark" aria-hidden="true">⌕</span><input id="overview-practice-search" type="search" placeholder="Search a topic, skill, or practice set" aria-label="Search practice sets"><button type="button" data-search-practice>Find practice</button></label><div class="overview-results" id="overview-search-results" hidden></div>';
    var tabs=document.createElement("div");tabs.className="progress-panel";
    tabs.innerHTML='<div class="progress-panel-top"><div class="progress-tabs" role="tablist" aria-label="Progress view"><button class="active" type="button" role="tab" aria-selected="true" data-dashboard-tab="practice">Practice progress</button><button type="button" role="tab" aria-selected="false" data-dashboard-tab="performance">Performance</button></div><span class="progress-note">Saved to your student account</span></div>';
    tabs.appendChild(metrics);var perf=document.createElement("div");perf.innerHTML=performanceHTML();tabs.appendChild(perf.firstElementChild);
    var columns=document.createElement("div");columns.className="overview-columns";
    var main=document.createElement("div");main.className="overview-main";
    var aside=document.createElement("div");aside.className="overview-aside";
    main.append(tabs,moduleHead,modules);if(recent)main.appendChild(recent);
    if(plan)aside.appendChild(plan);
    aside.insertAdjacentHTML("beforeend",todayFocus());if(guidance)aside.appendChild(guidance);
    columns.append(main,aside);
    hero.insertAdjacentElement("afterend",search);
    if(dashboard)dashboard.remove();
    if(note){note.insertAdjacentElement("beforebegin",columns);note.insertAdjacentHTML("beforebegin",sourceShelf());}
    else{root.append(columns);root.insertAdjacentHTML("beforeend",sourceShelf());}
  };
  document.addEventListener("input",function(event){if(event.target&&event.target.id==="overview-practice-search")searchResults(event.target.value)});
  document.addEventListener("click",function(event){
    var search=event.target.closest("[data-search-practice]");
    if(search){var input=document.querySelector("#overview-practice-search");searchResults(input?input.value:"");return}
    var tab=event.target.closest("[data-dashboard-tab]");
    if(tab){
      var panel=tab.closest(".progress-panel");if(!panel)return;
      panel.querySelectorAll("[data-dashboard-tab]").forEach(function(button){var active=button===tab;button.classList.toggle("active",active);button.setAttribute("aria-selected",String(active))});
      var metrics=panel.querySelector(".metrics"),performance=panel.querySelector(".performance-snapshot");
      if(metrics)metrics.hidden=tab.dataset.dashboardTab!=="practice";
      if(performance)performance.hidden=tab.dataset.dashboardTab!=="performance";
    }
  });
})();

// Re-render after the practice banks have loaded so overview counts include every set.
if(currentView==="overview")renderOverview();

