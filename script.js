document.addEventListener('DOMContentLoaded',()=>{
  // =========== Sirdata CMP & Google Consent Mode 統合 ===========
  let sirdataLoaded = false;
  let consentInitialized = false;
  
  // Sirdata CMPの読み込み監視
  const checkSirdataLoaded = () => {
    return typeof window.Sirdata !== 'undefined' && window.Sirdata.consent !== undefined;
  };
  
  // Sirdata CMPからのイベントリッスン
  const initializeSirdataListener = () => {
    if(!checkSirdataLoaded()) return;
    
    sirdataLoaded = true;
    
    // Sirdataの同意情報をGoogle Consent Modeに同期
    const syncSirdataConsent = () => {
      try {
        const sirdataConsent = window.Sirdata.consent.getConsents();
        const consentData = {
          'analytics_storage': (sirdataConsent.analytics || sirdataConsent.consent) ? 'granted' : 'denied',
          'ad_storage': (sirdataConsent.ads || sirdataConsent.marketing) ? 'granted' : 'denied'
        };
        
        gtag('consent', 'update', consentData);
        localStorage.setItem('sirdata-consent-synced', JSON.stringify(consentData));
        consentInitialized = true;
      } catch(e) {
        console.warn('Sirdata consent sync error:', e);
      }
    };
    
    // Sirdataイベントリッスン
    if(window.Sirdata.consent && window.Sirdata.consent.on) {
      window.Sirdata.consent.on('consent_update', syncSirdataConsent);
      window.Sirdata.consent.on('consent_given', syncSirdataConsent);
      window.Sirdata.consent.on('consent_withdrawn', syncSirdataConsent);
    }
    
    // 初期同期
    syncSirdataConsent();
  };
  
  // Sirdataの読み込みを監視（最大5秒待機）
  let sirdataCheckCount = 0;
  const sirdataCheckInterval = setInterval(() => {
    sirdataCheckCount++;
    if(checkSirdataLoaded()) {
      clearInterval(sirdataCheckInterval);
      initializeSirdataListener();
    } else if(sirdataCheckCount >= 50) { // 5秒後
      clearInterval(sirdataCheckInterval);
      showFallbackConsent();
    }
  }, 100);
  
  // =========== フォールバック同意バナー ===========
  const fallbackBanner = document.getElementById('fallbackConsentBanner');
  const fallbackAcceptBtn = document.getElementById('fallbackAcceptConsent');
  const fallbackRejectBtn = document.getElementById('fallbackRejectConsent');
  
  const showFallbackConsent = () => {
    if(!consentInitialized && !localStorage.getItem('analytics-consent')) {
      fallbackBanner.style.display = 'block';
    }
  };
  
  // フォールバック：同意を許可
  if(fallbackAcceptBtn) {
    fallbackAcceptBtn.addEventListener('click',()=>{
      const consentData = {
        'analytics_storage': 'granted',
        'ad_storage': 'granted'
      };
      localStorage.setItem('analytics-consent', JSON.stringify(consentData));
      gtag('consent', 'update', consentData);
      fallbackBanner.style.display = 'none';
      consentInitialized = true;
    });
  }
  
  // フォールバック：同意を拒否
  if(fallbackRejectBtn) {
    fallbackRejectBtn.addEventListener('click',()=>{
      const consentData = {
        'analytics_storage': 'denied',
        'ad_storage': 'denied'
      };
      localStorage.setItem('analytics-consent', JSON.stringify(consentData));
      gtag('consent', 'update', consentData);
      fallbackBanner.style.display = 'none';
      consentInitialized = true;
    });
  }

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
  // 外部リンククリック追跡
  const currentDomain = window.location.hostname;
  document.querySelectorAll('a[href]').forEach(link=>{
    const href = link.getAttribute('href');
    // 外部リンク判定（http://またはhttps://で始まり、現在のドメインでない）
    const isExternal = (href.startsWith('http://') || href.startsWith('https://')) && 
!href.includes(currentDomain);
    
    if(isExternal){
      link.addEventListener('click',(e)=>{
        const linkUrl = new URL(href);
        const linkDomain = linkUrl.hostname;
        
        // データレイヤーにイベント送信（GTMに通知）
        if(window.dataLayer){
          dataLayer.push({
            'event': 'external_link_click',
            'link_url': href,
            'link_domain': linkDomain,
            'link_text': link.textContent.trim()
          });
        }
        
        // Google Analyticsにも送信（同意がある場合）
        if(typeof gtag !== 'undefined'){
          gtag('event', 'external_link_click', {
            'link_domain': linkDomain,
            'link_text': link.textContent.trim()
          });
        }
      });
    }
  });

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
