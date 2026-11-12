const types={R:{name:'Практик',text:'Тебе нравится работать с техникой, материалами и видеть конкретный результат.',color:'#ff6542'},I:{name:'Исследователь',text:'Тебя привлекают задачи, закономерности, эксперименты и поиск объяснений.',color:'#177f79'},A:{name:'Автор',text:'Ты ценишь идеи, самовыражение, визуальный язык и нестандартные решения.',color:'#a64d79'},S:{name:'Наставник',text:'Тебе важно помогать, обучать, общаться и делать жизнь людей лучше.',color:'#4967d8'},E:{name:'Инициатор',text:'Тебя заряжают лидерство, влияние, переговоры и запуск новых проектов.',color:'#dc8b20'},C:{name:'Организатор',text:'Твоя сила — порядок, точность, данные, регламенты и надежные процессы.',color:'#687080'}};
const dirs={R:[['Инженерия','машиностроение, робототехника'],['Строительство','архитектура, городская среда'],['Транспорт','авиация, логистика']],I:[['IT и данные','программирование, ИИ, аналитика'],['Фундаментальные науки','математика, физика, химия'],['Медицина и биотех','исследования, диагностика']],A:[['Дизайн','коммуникационный и цифровой дизайн'],['Медиа','журналистика, кино, реклама'],['Архитектура','пространства и город']],S:[['Психология','консультирование, исследования'],['Образование','педагогика, EdTech'],['Здравоохранение','лечебное дело, общественное здоровье']],E:[['Менеджмент','управление проектами и продуктами'],['Экономика','финансы, предпринимательство'],['Право и коммуникации','юриспруденция, PR']],C:[['Бизнес-аналитика','процессы, учет, аудит'],['Экономика','статистика и финансы'],['Госуправление','администрирование, право']]};

const questions = [
 ['Мне интересно собирать и настраивать устройства','R'],
 ['Мне нравится искать причины явлений','I'],
 ['Мне интересно придумывать визуальные образы','A'],
 ['Мне нравится объяснять другим новую тему','S'],
 ['Мне интересно организовывать работу команды','E'],
 ['Мне нравится упорядочивать информацию в таблицах','C'],
 ['Мне хотелось бы работать с инструментами и материалами','R'],
 ['Мне интересно проверять гипотезы с помощью экспериментов','I'],
 ['Мне нравится писать истории или сценарии','A'],
 ['Мне интересно помогать человеку разобраться с трудностями','S'],
 ['Мне хотелось бы запустить собственный проект','E'],
 ['Мне нравится замечать и исправлять ошибки в документах','C'],
 ['Мне интересно создавать модели механизмов','R'],
 ['Мне нравится анализировать данные и искать закономерности','I'],
 ['Мне хотелось бы создавать музыку или звуковое оформление','A'],
 ['Мне нравится обучать младших или начинающих','S'],
 ['Мне интересно убеждать людей поддержать мою идею','E'],
 ['Мне нравится составлять подробный план работы','C'],
 ['Мне хотелось бы заниматься ремонтом техники','R'],
 ['Мне интересно решать сложные логические задачи','I'],
 ['Мне нравится придумывать необычные способы самовыражения','A'],
 ['Мне хотелось бы участвовать в помощи людям, которым нужна поддержка','S'],
 ['Мне нравится обсуждать условия и договариваться с людьми','E'],
 ['Мне интересно вести учет расходов и проверять расчеты','C'],
 ['Мне интересно изготавливать полезные предметы своими руками','R'],
 ['Мне хотелось бы изучать научные объяснения устройства мира','I'],
 ['Мне нравится выступать на сцене или создавать видео','A'],
 ['Мне интересно слушать людей и понимать их переживания','S'],
 ['Мне хотелось бы отвечать за развитие общего дела','E'],
 ['Мне нравится выполнять задачи, где важны точность и порядок','C']
];
const options=[['Совсем не про меня',0],['Скорее не про меня',1],['Скорее про меня',2],['Точно про меня',3]];
let q=0, answers=Array(questions.length).fill(null), topTypes=[], profile=null, only=false;
const $=id=>document.querySelector('#'+id);
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sessionKey='vektor_session_v1';
const storageKey='vektor_answers_v2';
function storageWarning(){
 const note=$('storage-warning');
 if(note){note.hidden=false;note.textContent='Браузер не разрешает сохранять ответы. После перехода или закрытия страницы они могут потеряться.';}
}
function saveSession(completed=false){
 try{localStorage.setItem(storageKey,JSON.stringify({version:2,answers,q,completed}));}
 catch{storageWarning();}
}
function restoreSession(){
 try{
  let raw=localStorage.getItem(storageKey);
  if(!raw){try{raw=sessionStorage.getItem(sessionKey);}catch{}}
  const state=JSON.parse(raw||'null');
  if(!state||![1,2].includes(state.version)||!Array.isArray(state.answers)||state.answers.length!==questions.length||state.answers.some(v=>v!==null&&(!Number.isInteger(v)||v<0||v>3))||!Number.isInteger(state.q)||state.q<0||state.q>=questions.length)return;
  answers=state.answers;q=state.q;
  const completed=state.completed===true&&answers.every(v=>v!==null);
  if(completed){profile=calculateProfile(answers);topTypes=profile.leading;}
  if(state.version===1){saveSession(completed);try{sessionStorage.removeItem(sessionKey);}catch{}}
 }catch{storageWarning();}
}
function clearSavedAnswers(){
 q=0;answers=Array(questions.length).fill(null);profile=null;topTypes=[];only=false;
 let failed=false;
 try{localStorage.removeItem(storageKey);}catch{failed=true;}
 try{sessionStorage.removeItem(sessionKey);}catch{failed=true;}
 if(page==='test'){
  $('quiz').classList.remove('active');$('result').classList.remove('active');
  $('intro').hidden=false;$('begin').textContent='Перейти к вопросам';
 }else renderUnis();
 const note=$('storage-warning');
 note.hidden=false;note.textContent=failed?'Ответы сброшены на странице, но браузер не подтвердил удаление сохранения. Очисти данные сайта в настройках браузера.':'Ответы и результат удалены с этого устройства.';
}
function calculateProfile(values){
 // Only complete arrays of integer answers are accepted.
 if(!Array.isArray(values)||values.length!==questions.length||
    values.some(v=>!Number.isInteger(v)||v<0||v>3)){
  throw new Error('Ответь на все вопросы');
 }
 const keys=Object.keys(types);
 const scores=Object.fromEntries(keys.map(t=>[t,0]));
 const counts={...scores};
 questions.forEach((item,i)=>{
  scores[item[1]]+=values[i];
  counts[item[1]]++;
 });
 const percentages=Object.fromEntries(keys.map(t=>
  [t,Math.round(scores[t]/(counts[t]*3)*100)]));
 const ranked=keys.sort((a,b)=>scores[b]-scores[a]);
 const equal=new Set(Object.values(scores)).size===1;
 // Recommend only the highest-scoring sphere(s), including ties.
 const maximum=scores[ranked[0]];
 const leading=equal?[]:ranked.filter(t=>scores[t]===maximum);
 const rest=ranked.filter(t=>scores[t]<maximum&&scores[t]>0);
 const secondary=rest.filter(t=>scores[t]===scores[rest[0]]);
 return {scores,percentages,ranked,leading,secondary,equal,
  zero:maximum===0};
}
function showQuiz(){
 $('intro').hidden=true;$('quiz').classList.add('active');
 $('result').classList.remove('active');profile=null;topTypes=[];only=false;saveSession();
 renderQ();location.hash='test';$('question').focus({preventScroll:true});
}
function renderQ(){
 const completed=answers.filter(v=>v!==null).length;
 $('counter').textContent=`Вопрос ${q+1} из ${questions.length}`;
 $('percent').textContent=`${completed} / ${questions.length}`;
 $('progress').style.width=`${completed/questions.length*100}%`;
 $('question').textContent=questions[q][0];
 $('answers').innerHTML=options.map(([label,value])=>`<button type="button" class="answer ${answers[q]===value?'selected':''}" aria-pressed="${answers[q]===value}" data-v="${value}">${label}</button>`).join('');
 $('answers').querySelectorAll('button').forEach(b=>b.onclick=()=>{
   answers[q]=Number(b.dataset.v);saveSession();renderQ();$('answers').querySelector('[data-v="'+answers[q]+'"]').focus();
 });
 $('back').disabled=q===0;$('next').disabled=answers[q]===null;
 $('next').textContent=q===questions.length-1?'Показать результат':'Дальше';
}
function finish(){
 if(answers.some(v=>v===null))return;
 profile=calculateProfile(answers);topTypes=profile.leading;
 saveSession(true);renderResult();
 location.hash='result';$('result-title').focus({preventScroll:true});
}
function renderResult(){
 $('quiz').classList.remove('active');$('intro').hidden=false;$('begin').textContent='Изменить ответы';
 $('result').classList.add('active');
 const names=topTypes.map(t=>types[t].name);
 $('profileLetter').textContent=topTypes.length>2?'≈':topTypes.join('')||'—';
 $('profileLetter').style.background=topTypes.length?types[topTypes[0]].color:'#687080';
 $('profileName').textContent=profile.equal?'Без выделенной сферы':names.join(' + ');
 $('profileText').textContent=profile.equal?'Сравни разные занятия на практике: попробуй мини-проект, мастер-класс или день открытых дверей.':topTypes.map(t=>types[t].text).join(' ');
 $('summary').textContent=profile.zero?'Все ответы — «Совсем не про меня». По ним нельзя выделить профессиональные интересы; персональная подборка не строится.':profile.equal?'Все шесть сфер набрали одинаковые баллы. Однозначного лидера нет — каталог показан без персонального ранжирования.':`Самый высокий результат: ${names.join(', ')} — ${profile.percentages[topTypes[0]]}%. ${profile.secondary.length?'Следующие по баллам: '+profile.secondary.map(t=>types[t].name+' ('+profile.percentages[t]+'%)').join(', ')+'. ':''}Подборка строится по самому высокому результату. Это интересы по твоим ответам, а не оценка способностей; небольшой разрыв не доказывает существенных различий.`;
 $('scoreList').innerHTML=profile.ranked.map(t=>`<div class="score-row"><div class="score-label"><span>${types[t].name}</span><b>${profile.percentages[t]}%</b></div><div class="track"><div class="fill" style="width:${profile.percentages[t]}%;background:${types[t].color}"></div></div></div>`).join('')+'<p class="score-note">Каждая шкала: сумма баллов ÷ 15 × 100%. Проценты независимы, не складываются в 100% и не означают вероятность успеха.</p>';
 const keys=topTypes.length?topTypes:Object.keys(types);
 const selected=keys.flatMap(t=>dirs[t].map(d=>({name:d[0],text:d[1],type:t}))).filter((d,i,a)=>a.findIndex(x=>x.name===d.name)===i);
 $('directions').innerHTML=selected.map(d=>`<div class="direction"><b>${d.name}</b><span>${d.text}</span><a href="universities.html?sphere=${d.type}" class="direction-link">Найти направления в вузах</a></div>`).join('');
}
function resetQuiz(){
 q=0;answers=Array(questions.length).fill(null);profile=null;topTypes=[];only=false;
 $('begin').textContent='Перейти к вопросам';
 showQuiz();
}
function programMatches(p){return p.tags.some(t=>topTypes.includes(t))}
function selectUniversities(term='',sphere='',region='',recommended=false){
 const query=term.trim().toLocaleLowerCase('ru');
 return unis.map(u=>{
   const allName=(u.name+' '+u.abbr+' '+u.city).toLocaleLowerCase('ru').includes(query);
   const programs=u.programs.filter(p=>(allName||p.name.toLocaleLowerCase('ru').includes(query))&&(!sphere||p.tags.includes(sphere))&&(!recommended||programMatches(p)));
   const matches=programs.filter(programMatches);
   const rank=profile&&topTypes.length?Math.max(0,...matches.flatMap(p=>p.tags.filter(t=>topTypes.includes(t)).map(t=>profile.percentages[t]))):0;
   return {...u,programs,matches,rank};
 }).filter(u=>u.programs.length&&(!region||(u.region||'moscow')===region)).sort((a,b)=>b.rank-a.rank);
}
function renderUnis(){
 $('profile-return').textContent=profile?'Вернуться к результату':'Пройти тест для подбора';
 $('recommended').disabled=!topTypes.length;
 $('recommended').textContent=only?'Показать все':'Только рекомендованные';
 $('recommended').setAttribute('aria-pressed',String(only));
 const list=selectUniversities($('search').value,$('sphere').value,$('region').value,only);
 $('catalog-count').textContent=`Показано вузов: ${list.length} из ${unis.length}`;
 $('catalog-help').textContent=topTypes.length?'Отмечены направления, связанные с ведущими интересами. Это подбор по содержанию обучения, а не рейтинг вузов и не прогноз поступления.':profile?'В этом результате нет выделенных сфер. Можно изучить все направления или выбрать сферу вручную.':'Пройди тест, чтобы увидеть персональные рекомендации. Пока можно искать вузы и выбирать сферу вручную.';
 $('unis').innerHTML=list.map(u=>{
   const matched=u.matches.length>0;
   const programs=[...u.programs].sort((a,b)=>Number(programMatches(b))-Number(programMatches(a)));
   return `<article class="uni"><div class="uni-top"><div><h3>${escapeHTML(u.name)}</h3><p class="uni-location">${escapeHTML(u.city)}</p></div><div class="abbr">${u.abbr}</div></div>${matched?'<span class="tag match">Есть направления по твоим интересам</span>':''}<ul class="programs">${programs.map(p=>`<li><a href="${p.url||u.url}" target="_blank" rel="noopener">${escapeHTML(p.name)} ↗</a><span>${p.tags.map(t=>types[t].name).join(' · ')}${programMatches(p)?' · Рекомендуем изучить':''}</span></li>`).join('')}</ul>${u.note?`<p>${escapeHTML(u.note)}</p>`:''}<a href="${u.url}" target="_blank" rel="noopener">Официальный каталог / приёмная комиссия ↗</a></article>`;
 }).join('')||'<p>По этим условиям вузов нет. Измени запрос или фильтры.</p>';
}
const page=document.body.dataset.page;
if(page==='test'||page==='universities'){restoreSession();$('clear-saved').onclick=clearSavedAnswers;}
if(page==='test'){
 $('begin').onclick=showQuiz;
 $('back').onclick=()=>{if(q>0){q--;saveSession();renderQ();$('question').focus()}};
 $('next').onclick=()=>{if(answers[q]===null)return;if(q<questions.length-1){q++;saveSession();renderQ();$('question').focus()}else finish()};
 $('restart').onclick=resetQuiz;
 if(profile)renderResult();
 else if(answers.some(v=>v!==null))$('begin').textContent=`Продолжить тест · ${answers.filter(v=>v!==null).length} / ${questions.length}`;
}
if(page==='universities'){
 const params=new URLSearchParams(location.search);
 if(Object.hasOwn(types,params.get('sphere')))$('sphere').value=params.get('sphere');
 only=params.get('recommended')==='1'&&topTypes.length>0;
 $('search').oninput=renderUnis;$('sphere').onchange=renderUnis;$('region').onchange=renderUnis;
 $('recommended').onclick=()=>{if(!topTypes.length)return;only=!only;renderUnis()};
 renderUnis();
}
window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
