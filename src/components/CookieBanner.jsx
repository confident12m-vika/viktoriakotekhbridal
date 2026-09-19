import { useState, useEffect } from 'react';

const COOKIE_KEY = 'vk_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible]   = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState({ essential: true, analytics: false, marketing: false });

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);
    if (!saved) {
      // أظهر البانر بعد ثانية
      setTimeout(() => setVisible(true), 1000);
    }
  }, []);

  function acceptAll() {
    const consent = { essential: true, analytics: true, marketing: true, date: new Date().toISOString() };
    localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
    setVisible(false);
  }

  function acceptSelected() {
    const consent = { ...prefs, date: new Date().toISOString() };
    localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
    setVisible(false);
  }

  function rejectAll() {
    const consent = { essential: true, analytics: false, marketing: false, date: new Date().toISOString() };
    localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(8,8,8,0.97)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(201,168,76,0.25)',
      zIndex: 9999,
      padding: expanded ? '24px 40px 28px' : '18px 40px',
      transition: 'all 0.3s ease',
    }}>
      {/* الشريط الرئيسي */}
      <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
        {!expanded ? (
          /* نسخة مختصرة */
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'20px', flexWrap:'wrap' }}>
            <div style={{ flex:1, minWidth:'280px' }}>
              <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'13px', lineHeight:'1.6', margin:0 }}>
                🍪 We use cookies to enhance your experience on our website.
                <a href="/privacy" style={{ color:'#c9a84c', marginLeft:'6px', fontSize:'12px' }}>
                  Privacy Policy
                </a>
              </p>
            </div>
            <div style={{ display:'flex', gap:'10px', flexShrink:0, flexWrap:'wrap' }}>
              <button onClick={() => setExpanded(true)}
                style={{ padding:'9px 16px', background:'transparent', border:'1px solid rgba(255,255,255,0.2)', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'10px', letterSpacing:'1.5px', whiteSpace:'nowrap' }}>
                Manage
              </button>
              <button onClick={rejectAll}
                style={{ padding:'9px 16px', background:'transparent', border:'1px solid rgba(255,255,255,0.2)', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'10px', letterSpacing:'1.5px', whiteSpace:'nowrap' }}>
                Essential Only
              </button>
              <button onClick={acceptAll}
                style={{ padding:'9px 20px', background:'#c9a84c', border:'none', color:'#0a0a0a', cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'10px', letterSpacing:'1.5px', fontWeight:500, whiteSpace:'nowrap' }}>
                Accept All
              </button>
            </div>
          </div>
        ) : (
          /* نسخة موسعة مع خيارات */
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", color:'#c9a84c', fontSize:'20px', fontWeight:300 }}>Cookie Preferences</h3>
              <button onClick={() => setExpanded(false)}
                style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:'20px' }}>✕</button>
            </div>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'12px', lineHeight:'1.7', marginBottom:'20px' }}>
              We use cookies to enhance your browsing experience. You can choose which cookies to accept below.
              <a href="/privacy" style={{ color:'#c9a84c', marginLeft:'6px' }}>Learn more</a>
            </p>

            {/* Cookie toggles */}
            {[
              {
                key: 'essential',
                title: 'Essential Cookies',
                desc: 'Required for the website to function. Cannot be disabled.',
                locked: true,
              },
              {
                key: 'analytics',
                title: 'Analytics Cookies',
                desc: 'Help us understand how visitors use our website (Google Analytics).',
                locked: false,
              },
              {
                key: 'marketing',
                title: 'Marketing Cookies',
                desc: 'Used to show you relevant content and advertisements.',
                locked: false,
              },
            ].map(cookie => (
              <div key={cookie.key} style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', gap:'20px'
              }}>
                <div style={{ flex:1 }}>
                  <p style={{ color:'white', fontSize:'13px', marginBottom:'3px' }}>{cookie.title}</p>
                  <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px', lineHeight:'1.5' }}>{cookie.desc}</p>
                </div>
                <label style={{ position:'relative', display:'inline-block', width:'44px', height:'24px', flexShrink:0 }}>
                  <input
                    type="checkbox"
                    checked={prefs[cookie.key]}
                    disabled={cookie.locked}
                    onChange={e => setPrefs(p => ({...p, [cookie.key]: e.target.checked}))}
                    style={{ opacity:0, width:0, height:0 }}
                  />
                  <span style={{
                    position:'absolute', cursor: cookie.locked ? 'not-allowed' : 'pointer',
                    top:0, left:0, right:0, bottom:0,
                    background: prefs[cookie.key] ? '#c9a84c' : 'rgba(255,255,255,0.15)',
                    borderRadius:'24px', transition:'0.3s',
                    opacity: cookie.locked ? 0.5 : 1,
                  }}>
                    <span style={{
                      position:'absolute', content:'', height:'18px', width:'18px',
                      left: prefs[cookie.key] ? '23px' : '3px', bottom:'3px',
                      background:'white', borderRadius:'50%', transition:'0.3s',
                      display:'block',
                    }}></span>
                  </span>
                </label>
              </div>
            ))}

            <div style={{ display:'flex', gap:'10px', marginTop:'20px', flexWrap:'wrap' }}>
              <button onClick={rejectAll}
                style={{ padding:'11px 20px', background:'transparent', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'10px', letterSpacing:'1.5px' }}>
                Essential Only
              </button>
              <button onClick={acceptSelected}
                style={{ padding:'11px 24px', background:'transparent', border:'1px solid rgba(201,168,76,0.5)', color:'#c9a84c', cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'10px', letterSpacing:'1.5px' }}>
                Save My Preferences
              </button>
              <button onClick={acceptAll}
                style={{ padding:'11px 28px', background:'#c9a84c', border:'none', color:'#0a0a0a', cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'10px', letterSpacing:'1.5px', fontWeight:500 }}>
                Accept All Cookies
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
