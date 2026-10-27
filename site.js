(function(){
  var WA='https://wa.me/972505066185?text=';
  var nf=new Intl.NumberFormat('he-IL');
  function $(s,r){return (r||document).querySelector(s)}
  function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

  /* ---------- intro splash (once per visit) ---------- */
  var sp=$('#splash');
  if(sp){
    var seen=false;
    try{seen=sessionStorage.getItem('rss-intro')==='1'}catch(e){}
    var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(seen||reduce){sp.remove()}
    else{
      sp.hidden=false;
      var v=$('video',sp),closed=false;
      var close=function(){if(closed)return;closed=true;sp.classList.add('done');try{sessionStorage.setItem('rss-intro','1')}catch(e){}setTimeout(function(){sp.remove()},700)};
      v.addEventListener('ended',close);
      v.addEventListener('error',close);
      $('.skip',sp).addEventListener('click',close);
      sp.addEventListener('click',close);
      setTimeout(close,5200);
      var p=v.play();if(p&&p.catch)p.catch(close);
    }
  }

  /* ---------- mobile menu ---------- */
  var dr=$('#drawer'),mb=$('#menuBtn');
  if(dr&&mb){
    mb.addEventListener('click',function(){dr.hidden=false;mb.setAttribute('aria-expanded','true');$('.x',dr).focus()});
    var shut=function(){dr.hidden=true;mb.setAttribute('aria-expanded','false')};
    $('.x',dr).addEventListener('click',shut);
    dr.addEventListener('click',function(e){if(e.target===dr)shut()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!dr.hidden)shut()});
  }

  /* ---------- OSD clocks ---------- */
  var cks=$$('.clock');
  if(cks.length){
    var tick=function(){var d=new Date();var t=[d.getHours(),d.getMinutes(),d.getSeconds()].map(function(n){return String(n).padStart(2,'0')}).join(':');cks.forEach(function(c){c.textContent=t})};
    tick();setInterval(tick,1000);
  }
  $$('.yr').forEach(function(y){y.textContent=new Date().getFullYear()});

  /* ---------- scroll ring on the corner logo ---------- */
  var pf=$('#progfill');
  if(pf){
    var C=238.8,raf=0;
    var prog=function(){raf=0;var h=document.documentElement,max=h.scrollHeight-h.clientHeight;var p=max>0?Math.min(1,h.scrollTop/max):0;pf.style.strokeDashoffset=String(C*(1-p))};
    addEventListener('scroll',function(){if(!raf)raf=requestAnimationFrame(prog)},{passive:true});prog();
    $('#badge').addEventListener('click',function(){scrollTo({top:0,behavior:'smooth'})});
  }

  /* ---------- lightbox (photos + film) ---------- */
  var lb=$('#lb');
  if(lb){
    var lbBody=$('#lbbody'),lbCap=$('#lbcap');
    var openLB=function(html,cap){lbBody.innerHTML=html;lbCap.textContent=cap||'';if(lb.showModal)lb.showModal();else lb.setAttribute('open','')};
    var closeLB=function(){var v=$('video',lbBody);if(v)v.pause();lbBody.innerHTML='';lb.close?lb.close():lb.removeAttribute('open')};
    $('#lbx').addEventListener('click',closeLB);
    lb.addEventListener('click',function(e){if(e.target===lb)closeLB()});
    lb.addEventListener('cancel',function(){var v=$('video',lbBody);if(v)v.pause()});
    $$('.work').forEach(function(g){g.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var im=$('img',b);openLB('<img src="'+im.getAttribute('src')+'" alt="'+esc(im.alt)+'">',b.dataset.cap)})});
    $$('[data-film]').forEach(function(b){b.addEventListener('click',function(){
      openLB('<video src="'+b.dataset.film+'" poster="'+(b.dataset.poster||'')+'" controls autoplay playsinline></video>',b.dataset.cap||'');
    })});
  }

  /* ---------- only one inline video plays at a time ---------- */
  var vids=$$('video[controls]');
  vids.forEach(function(v){v.addEventListener('play',function(){$$('video[controls]').forEach(function(o){if(o!==v)o.pause()})})});

  /* ---------- catalog ---------- */
  var TH=['תשתית קיימת: משחילים כבלים בצנרת שכבר יש בבית.','הקמת תשתית: צנרת, קדיחות ואיטום מאפס.','תשתית מורכבת: כולל חציבה בקיר, חפירה בגינה ואיטום מעברים.'];
  var ITEMS=[
    {f:'cams',cat:'מצלמות אבטחה',name:'שומר',sub:'4 מצלמות · דירה או בית קטן',img:'media/dome-ceiling.jpg',
      li:['4 מצלמות כיפה Provision 4MP עם ראיית לילה','מקליט NVR עם דיסק 4TB, שבועיים הקלטה','כבילת Cat7 וקופסאות מוגנות מים','צפייה חיה מהטלפון, הדרכה ואחריות לשנה'],price:[8090,13890,16490]},
    {f:'cams',cat:'מצלמות אבטחה',name:'שקט נפשי',sub:'8 מצלמות · בית פרטי או עסק',pick:'הכי משתלמת',img:'media/court-screen.jpg',
      li:['2 מצלמות צבע מלא בלילה בכניסות','6 מצלמות שמזהות אדם ורכב','התראה מיידית לטלפון','דיסק 6TB, ביקור תחזוקה שנתי ואחריות לשנתיים'],price:[16090,28290,32090]},
    {f:'cams',cat:'מצלמות אבטחה',name:'מבצר',sub:'פרימיום · שטח גדול או עסק',img:'media/court-night.jpg',
      li:['מצלמות לפי תכנון אישי של השטח','מצלמה ממונעת עם זום','ארון תקשורת, גיבוי חשמל ושילוב עם אזעקה','מענה לתקלות תוך 24 שעות ואחריות ל־3 שנים'],price:null},
    {f:'alarm',cat:'מערכת אזעקה',name:'בסיס',sub:'דירה',icon:'i-alarm',
      li:['רכזת PIMA Force32C ולוח מקשים','3 גלאי תנועה וצופר פנימי','דריכה וניטרול מהטלפון','הדרכה מלאה ואחריות לשנה'],price:4064},
    {f:'alarm',cat:'מערכת אזעקה',name:'בית מוגן',sub:'בית פרטי',pick:'מומלצת',img:'media/pima-keypad.jpg',
      li:['עד 6 גלאים, גם כאלה שמתעלמים מחיות מחמד','מגנטים לדלתות ולחלונות','צופר חיצוני עם נצנץ ושלט לדריכה מהירה','התראה לטלפון, ביקור תחזוקה ואחריות לשנתיים'],price:7587},
    {f:'alarm',cat:'מערכת אזעקה',name:'מבצר אזעקה',sub:'פרימיום · בית גדול או עסק',icon:'i-check',
      li:['גלאים לפי תכנון אישי, גם בחצר','שילוב עם מצלמות האבטחה','גלאי עשן והצפה','מענה לתקלות תוך 24 שעות ואחריות ל־3 שנים'],price:null},
    {f:'alarm',cat:'גידור אלקטרוני',name:'גידור IR אקטיבי',sub:'הגנה היקפית לחצר, לבית פרטי או לעסק',icon:'i-beam',
      li:['גלאי קרן IR אקטיביים של PIMA, 2 או 4 קרניים','התראה כבר כשמישהו חוצה את הקו, לפני שהוא מגיע לבית','עובד עם אזעקת PIMA Force, חוטי או אלחוטי','טווח מ־15 עד 120 מ׳ לכל גלאי'],price:940,from:true,note:'לגלאי חוטי עד 15 מ׳, כולל התקנה · אלחוטי החל מ־₪1,825 · כולל מע״מ'},
    {f:'care',cat:'לחצני מצוקה',name:'יד ביד',sub:'דירה של הורה אחד',icon:'i-heart',
      li:['לחצן מצוקה נייד עם דיבורית','מחייג אוטומטית ל־3 מספרים','לחצן מצוקה ביתי ליד המיטה','שנת תקשורת, הגדרה והדרכה'],price:1140,from:true,note:'לחצנים בלבד · עם 2 מצלמות ושיחה דו־כיוונית: ₪7,190'},
    {f:'care',cat:'לחצני מצוקה',name:'בית שומר',sub:'כיסוי מלא של הבית',pick:'הכי משתלמת',img:'media/v-panic.jpg',
      li:['שעון מצוקה עם זיהוי נפילה','מחייג גם בלי לחיצה, עם דיבורית ואיתור','לחצן מצוקה ביתי ליד המיטה','שנת תקשורת, הגדרה והדרכה'],price:1940,from:true,note:'לחצנים בלבד · עם 4 מצלמות ושיחה דו־כיוונית: ₪10,190'},
    {f:'care',cat:'לחצני מצוקה',name:'ליווי מלא',sub:'פרימיום · לבית שצריך יותר',icon:'i-heart',
      li:['שעון מצוקה ולחצן נייד','לחצנים בכל חדר ובשירותים','מצלמות עם שיחה דו־כיוונית','שילוב עם אזעקת PIMA'],price:null},
    {f:'care',cat:'מכשיר מצוקה',name:'לחצן מצוקה ביתי',sub:'על הקיר, ליד המיטה או בשירותים',icon:'i-btn',
      li:['לחיצה שולחת התראה לטלפונים של המשפחה','אלחוטי, בלי חיווט','כולל הגדרה והדרכה'],price:350},
    {f:'care',cat:'מכשיר מצוקה',name:'לחצן מצוקה נייד',sub:'תליון סלולרי עם דיבורית',icon:'i-btn',
      li:['מחייג אוטומטית ל־3 מספרים','ההורה מדבר ישירות דרך הלחצן','שנת תקשורת כלולה'],price:790},
    {f:'care',cat:'מכשיר מצוקה',name:'שעון מצוקה',sub:'עם זיהוי נפילה',icon:'i-watch',
      li:['מזהה נפילה ומחייג גם בלי לחיצה','דיבורית ואיתור מיקום','נראה כמו שעון רגיל','שנת תקשורת כלולה'],price:1590},
    {f:'home',cat:'בית חכם',name:'פעמון אילוק',sub:'ELOCK BUZZ · רואים מי בדלת מהטלפון',img:'media/v-doorbell.jpg',
      li:['מצלמת HD עם ראיית לילה','מדברים עם מי שבדלת מכל מקום','התראה לטלפון כשמישהו מתקרב','אלחוטי, סוללה לכ־3 חודשים'],price:900,note:'כולל התקנה, הגדרה באפליקציה והדרכה'},
    {f:'home',cat:'אינטרקום',name:'אינטרקום וידאו PIMA',sub:'בית פרטי',pick:'מומלצת',img:'media/v-intercom.jpg',
      li:['מסך מגע 7״ בתוך הבית, עם אפליקציה בטלפון','עמדת כניסה עם קורא קירבה ושני תגים','פתיחת דלת ושער מהמסך ומהטלפון','חיווט מוסתר, הדרכה ואחריות לשנתיים'],price:3235},
    {f:'home',cat:'בית חכם',name:'כניסה חכמה',sub:'אינטרקום, מנעול חכם ומצלמות',icon:'i-lock',
      li:['כל מה שבאינטרקום הווידאו','מנעול חכם לדלת הכניסה','פתיחת דלת מהטלפון','שילוב עם מצלמות האבטחה'],price:null},
    {f:'home',cat:'אינטרקום לבניין',name:'אינטרקום לבניין',sub:'לוועד הבית · כל דירה רואה מי מצלצל',img:'media/v-building.jpg',
      li:['עמדת כניסה בלובי ומסך או שפופרת בכל דירה','פתיחת דלת הכניסה בלחיצה','מתאים גם לבניינים ישנים','הצעת מחיר מסודרת לוועד הבית'],price:null},
    {f:'extra',cat:'תוספת לחבילה',name:'ארון תקשורת 6U',sub:'כולל פאנל חיבורים ומסדרי כבלים',icon:'i-rack',
      li:['כל הציוד מסודר ונעול במקום אחד','מגן על המקליט ועל החיבורים','מראה נקי ומקצועי'],price:1030},
    {f:'extra',cat:'תוספת לחבילה',name:'אל־פסק (UPS)',sub:'המערכת ממשיכה לעבוד בהפסקת חשמל',icon:'i-bolt',
      li:['המקליט והמצלמות ממשיכים להקליט','מגן על הציוד מקפיצות מתח'],price:650}
  ];
  function priceHTML(it,tier){
    if(it.price===null) return '<div class="price"><span class="from">המחיר</span><span class="val plan">לפי תכנון אישי</span><span class="note">נקבע אחרי ייעוץ בשטח</span></div>';
    var arr=Array.isArray(it.price);
    var v=arr?it.price[tier]:it.price;
    var note=it.note||(arr?['בתשתית קיימת','בהקמת תשתית','בתשתית מורכבת'][tier]+' · כולל מע״מ':'כולל מע״מ');
    return '<div class="price"><span class="from">'+(arr||it.from?'החל מ־':'מחיר')+'</span><span class="val">₪'+nf.format(v)+'</span><span class="note">'+esc(note)+'</span></div>';
  }
  $$('.catalog').forEach(function(root){
    var grid=$('.grid',root),filters=$('.filters',root),tiers=$('.tiers',root),hint=$('.tierhint',root),tbox=$('.tierbox',root);
    var filt=root.dataset.filter||'all',tier=0,fixed=!filters;
    function render(){
      var h='';
      ITEMS.forEach(function(it){
        if(filt!=='all'&&it.f!==filt) return;
        var pic=it.img?'<div class="pic"><img src="'+it.img+'" alt="" loading="lazy"></div>':'<div class="pic icon"><svg aria-hidden="true"><use href="#'+it.icon+'"/></svg></div>';
        var msg=encodeURIComponent('שלום דוד, אשמח לפרטים על '+it.cat+': '+it.name);
        h+='<article class="card'+(it.pick?' pick':'')+'">'+(it.pick?'<span class="tag">'+esc(it.pick)+'</span>':'')+pic+
          '<div class="body"><span class="cat">'+esc(it.cat)+'</span><h3>'+esc(it.name)+'</h3><p class="sub">'+esc(it.sub)+'</p><ul>'+
          it.li.map(function(l){return '<li>'+esc(l)+'</li>'}).join('')+'</ul>'+priceHTML(it,tier)+
          '<a class="btn btn-wa" href="'+WA+msg+'" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg>'+(it.price===null?'לתיאום ייעוץ':'להזמנה בוואטסאפ')+'</a></div></article>';
      });
      grid.innerHTML=h;
      var showT=filt==='all'||filt==='cams';
      if(hint)hint.textContent=showT?TH[tier]:'';
      if(tbox)tbox.style.visibility=showT?'visible':'hidden';
    }
    function press(g,attr,val){$$('button',g).forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset[attr]===val))})}
    if(filters)filters.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;filt=b.dataset.f;press(filters,'f',filt);render()});
    if(tiers)tiers.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;tier=+b.dataset.t;press(tiers,'t',b.dataset.t);render()});
    if(filters&&location.hash){var k=location.hash.slice(1);if($('[data-f="'+k+'"]',filters)){filt=k;press(filters,'f',k)}}
    render();
  });

  /* ---------- contact form -> WhatsApp ---------- */
  var form=$('#leadForm');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var name=$('#f-name').value.trim(),err=$('#formErr');
      if(!name){err.hidden=false;$('#f-name').focus();return}
      err.hidden=true;
      var city=$('#f-city').value.trim(),need=$('#f-need').value,msg=$('#f-msg').value.trim();
      var text='שלום דוד, אני '+name+(city?' מ'+city:'')+'.\nמתעניין/ת ב: '+need+(msg?'\n'+msg:'');
      var a=$('#waOut');a.href=WA+encodeURIComponent(text);a.hidden=false;a.click();
    });
  }
  var cb=$('#copyBtn');
  if(cb){cb.addEventListener('click',function(){
    var done=function(){cb.textContent='המספר הועתק';setTimeout(function(){cb.textContent='העתקת המספר'},2000)};
    var sel=function(){var r=document.createRange();r.selectNodeContents($('#phoneBig'));var s=getSelection();s.removeAllRanges();s.addRange(r);cb.textContent='סמנו והעתיקו'};
    try{navigator.clipboard.writeText('0505066185').then(done,sel)}catch(e){sel()}
  })}
})();
