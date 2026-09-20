import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext.jsx';
import { useOnDemandTranslate } from '../hooks/useOnDemandTranslate.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── زرار الترجمة للمحتوى الكامل ──
function TranslateButton({ fields, onTranslated, onReset }) {
  const { t } = useLang();
  const { shown, translated, translating, toggle, show: showBtn } = useOnDemandTranslate(fields);

  useEffect(() => {
    if (translated) onTranslated(shown);
    else onReset();
  }, [translated, shown]);

  if (!showBtn) return null;

  return (
    <button
      onClick={toggle}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: translated ? 'rgba(201,168,76,0.12)' : 'transparent',
        border: '1px solid rgba(201,168,76,0.4)',
        color: '#c9a84c',
        padding: '10px 20px',
        cursor: 'pointer',
        fontFamily: "'Jost', sans-serif",
        fontSize: '11px', letterSpacing: '2px',
        transition: '0.2s',
        marginBottom: '32px',
      }}
    >
      {translating
        ? t('journal_translating')
        : translated
          ? t('journal_original')
          : t('journal_translate')}
    </button>
  );
}

export default function ArticlePage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { t, lang } = useLang();

  const [post, setPost]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [related, setRelated]     = useState([]);
  const [displayed, setDisplayed] = useState(null); // النص المعروض (مترجم أو أصلي)

  useEffect(() => {
    window.scrollTo(0, 0);
    setDisplayed(null);
    fetch(`${API}/api/blog/${id}`)
      .then(r => r.json())
      .then(data => {
        setPost(data);
        setLoading(false);
        // جيب المقالات ذات الصلة
        fetch(`${API}/api/blog`)
          .then(r => r.json())
          .then(all => {
            if (Array.isArray(all)) {
              setRelated(all.filter(p => p._id !== data._id).slice(0, 3));
            }
          })
          .catch(() => {});
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <p style={{ color:'rgba(255,255,255,0.3)', letterSpacing:'3px', fontFamily:"'Jost',sans-serif" }}>Loading...</p>
    </div>
  );

  if (!post || post.message) return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'20px' }}>
      <p style={{ color:'rgba(255,255,255,0.3)', fontFamily:"'Cormorant Garamond',serif", fontSize:'20px' }}>
        {t('journal_not_found')}
      </p>
      <button
        onClick={() => navigate('/blog')}
        style={{ background:'transparent', border:'1px solid rgba(201,168,76,0.4)', color:'#c9a84c', padding:'10px 24px', cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'11px', letterSpacing:'2px' }}
      >
        {t('journal_back')}
      </button>
    </div>
  );

  const imgSrc = post.image
    ? (post.image.startsWith('http') ? post.image : `${API}${post.image}`)
    : null;

  // النص الظاهر — مترجم أو أصلي
  const shownTitle   = displayed?.title   || post.title;
  const shownExcerpt = displayed?.excerpt || post.excerpt;
  const shownContent = displayed?.content || post.content;

  return (
    <div className="article-page" style={{ background:'#0a0a0a', minHeight:'100vh' }}>

      {/* ── Hero ── */}
      <div className="article-hero" style={{ position:'relative', minHeight: imgSrc ? '70vh' : '40vh', display:'flex', alignItems:'flex-end' }}>
        {imgSrc && (
          <>
            <img src={imgSrc} alt={shownTitle} className="article-hero-img"
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(10,10,10,0.98) 100%)' }} />
          </>
        )}
        <div style={{ position:'relative', zIndex:2, width:'100%', maxWidth:'800px', margin:'0 auto', padding: imgSrc ? '0 30px 60px' : '120px 30px 60px' }}>
          <button
            onClick={() => navigate('/blog')}
            style={{ background:'transparent', border:'none', color:'rgba(201,168,76,0.7)', cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'11px', letterSpacing:'2px', marginBottom:'24px', display:'flex', alignItems:'center', gap:'6px', padding:0 }}
          >
            {t('journal_back')}
          </button>
          <span style={{ fontSize:'9px', letterSpacing:'4px', color:'#c9a84c', textTransform:'uppercase', display:'block', marginBottom:'14px' }}>
            {post.category}
          </span>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(28px,5vw,52px)', fontWeight:300, color:'white', lineHeight:1.15, marginBottom:'16px', letterSpacing:'1px' }}>
            {shownTitle}
          </h1>
          {post.subtitle && (
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'16px', color:'rgba(255,255,255,0.5)', fontStyle:'italic', marginBottom:'20px' }}>
              {post.subtitle}
            </p>
          )}
          <div style={{ display:'flex', gap:'12px', alignItems:'center', color:'rgba(255,255,255,0.35)', fontSize:'11px', letterSpacing:'1px' }}>
            <span>{new Date(post.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', { day:'numeric', month:'long', year:'numeric' })}</span>
            <span>·</span>
            <span>Viktoria Kotekh</span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth:'800px', margin:'0 auto', padding:'60px 30px' }}>

        {/* زرار الترجمة — للمحتوى كله */}
        <TranslateButton
          fields={{ title: post.title, excerpt: post.excerpt || '', content: post.content || '' }}
          onTranslated={(shown) => setDisplayed(shown)}
          onReset={() => setDisplayed(null)}
        />

        {/* Lead */}
        {shownExcerpt && (
          <p style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 'clamp(17px,2.5vw,21px)',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.75)',
            fontStyle: 'italic',
            marginBottom: '40px',
            paddingBottom: '32px',
            borderBottom: '1px solid rgba(201,168,76,0.15)',
          }}>
            {shownExcerpt}
          </p>
        )}

        {/* Content */}
        <div style={{
          fontSize: '16px',
          lineHeight: '1.9',
          color: 'rgba(255,255,255,0.65)',
          fontWeight: 300,
          whiteSpace: 'pre-wrap',
          fontFamily: "'Jost',sans-serif",
        }}>
          {shownContent}
        </div>

        {/* ── CTA ── */}
        <div style={{
          marginTop: '70px',
          padding: '48px 40px',
          background: 'rgba(201,168,76,0.05)',
          border: '1px solid rgba(201,168,76,0.2)',
          textAlign: 'center',
        }}>
          <span style={{ fontSize:'9px', letterSpacing:'4px', color:'#c9a84c', textTransform:'uppercase', display:'block', marginBottom:'14px' }}>
            {t('journal_cta_label')}
          </span>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(22px,3vw,32px)', fontWeight:300, color:'white', marginBottom:'14px' }}>
            {t('journal_cta_title')}
          </h3>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'14px', marginBottom:'28px', lineHeight:1.7 }}>
            {t('journal_cta_desc')}
          </p>
          <a href="/#booking" className="btn-gold" style={{ display:'inline-block', textDecoration:'none' }}>
            {t('journal_cta_btn')}
          </a>
        </div>
      </div>

      {/* ── Related Articles ── */}
      {related.length > 0 && (
        <div style={{ background:'#050505', padding:'60px 30px' }}>
          <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(22px,3vw,32px)', fontWeight:300, color:'white', marginBottom:'40px', textAlign:'center' }}>
              {t('journal_continue')}
            </h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'24px' }}>
              {related.map(a => {
                const aImg = a.image ? (a.image.startsWith('http') ? a.image : `${API}${a.image}`) : null;
                return (
                  <div
                    key={a._id}
                    onClick={() => { navigate(`/blog/${a._id}`); window.scrollTo(0,0); }}
                    style={{ cursor:'pointer', background:'#111', border:'1px solid rgba(255,255,255,0.06)', overflow:'hidden', transition:'border-color 0.3s' }}
                    onMouseOver={e => e.currentTarget.style.borderColor='rgba(201,168,76,0.3)'}
                    onMouseOut={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'}
                  >
                    {aImg && (
                      <div style={{ height:'180px', overflow:'hidden' }}>
                        <img src={aImg} alt={a.title} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.6s' }} />
                      </div>
                    )}
                    <div style={{ padding:'18px 20px' }}>
                      <span style={{ fontSize:'9px', letterSpacing:'2px', color:'#c9a84c', textTransform:'uppercase' }}>{a.category}</span>
                      <h4 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'18px', color:'white', margin:'8px 0 10px', lineHeight:1.3 }}>{a.title}</h4>
                      <span style={{ fontSize:'11px', letterSpacing:'1px', color:'rgba(201,168,76,0.7)' }}>{t('journal_read')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}