document.addEventListener('DOMContentLoaded',()=>{
  // GSAP: ヘッダーとセクションの簡易フェードイン
if(window.gsap){
    gsap.from('.hero .display-4',{y:30,opacity:0,duration:0.8,delay:0.2});
    gsap.from('main section',{y:20,opacity:0,duration:0.7,stagger:0.12,delay:0.4});
}

  // スムーススクロール（アンカー）
document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
    const href = a.getAttribute('href');
    if(href.length>1){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
}
    });
});

  // お問い合わせフォーム（簡易：mailto）
const form = document.getElementById('contactForm');
if(form){
    form.addEventListener('submit',e=>{
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const subject = encodeURIComponent('サイトからのお問い合わせ');
    const body = encodeURIComponent(`お名前: ${name}\nメール: ${email}\n\n${message}`);
    window.location.href = `mailto:you@example.com?subject=${subject}&body=${body}`;
    });
}
  // 軽いパララックス（ヘッダー）
const hero = document.querySelector('.hero');
if(hero){
    window.addEventListener('scroll',()=>{
    const sc = window.scrollY;
      // 最大で20px移動する
      const y = Math.min(20, sc * 0.12);
    hero.style.transform = `translateY(${y}px)`;
    },{passive:true});
}
});
