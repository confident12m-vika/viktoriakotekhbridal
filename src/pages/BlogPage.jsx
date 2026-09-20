import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext.jsx';
import { useOnDemandTranslate } from '../hooks/useOnDemandTranslate.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// كومبوننت لكل بطاقة مقال مع زرار الترجمة
function BlogCard({ post, featured, onClick }) {
  const { lang } = useLang();

  const { shown, translated, translating, toggle, show: showBtn } = useOnDemandTranslate({
    title:   post.title   || '',
    excerpt: post.excerpt || post.content?.slice(0, 180) || '',
  });

  const imgSrc = post.image
    ? (post.image.startsWith('http') ? post.image : `${API}${post.image}`)
    : null;

  return (
    <div
      className={`blog-card ${featured ? 'blog-card-featured' : ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="blog-card-img">
        {imgSrc
          ? <img src={imgSrc} alt={shown.title} />
          : <div style={{ width:'100%', height:'100%', background:'#1a1a1a', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(201,168,76,0.3)', fontSize:'40px' }}>✦</div>
        }
        <span className="blog-card-category">{post.category}</span>
      </div>

      <div className="blog-card-body">
        <div className="blog-card-meta">
          <span>{new Date(post.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}</span>
        </div>

        <h2 className="blog-card-title">{shown.title}</h2>

        {post.subtitle && (
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px', fontStyle:'italic' }}>{post.subtitle}</p>
        )}

        <p className="blog-card-excerpt">{shown.excerpt}...</p>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'8px' }}>
          <span className="blog-card-read">Read Article →</span>

          {/* زرار الترجمة — يظهر بس لو اللغة مش إنجليزي */}
          {showBtn && (
            <button
              onClick={e => { e.stopPropagation(); toggle(); }}
              style={{
                background: translated ? 'rgba(201,168,76,0.15)' : 'transparent',
                border: '1px solid rgba(201,168,76,0.35)',
                color: '#c9a84c',
                padding: '5px 12px',
                cursor: 'pointer',
                fontFamily: "'Jost', sans-serif",
                fontSize: '10px',
                letterSpacing: '1px',
                transition: '0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {translating ? '...' : translated ? '✕ Original' : '🌐 Translate'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const { t } = useLang();
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API}/api/blog`)
      .then(r => r.json())
      .then(data => { setPosts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="blog-page">
      <div className="blog-page-header">
        <button className="gallery-back-btn" onClick={() => navigate('/')}>← Back</button>
        <span className="section-label" style={{ color:'#c9a84c' }}>Journal</span>
        <h1 className="section-title" style={{ color:'white' }}>Bridal Journal</h1>
        <p className="blog-page-sub">Stories, tips & inspiration from Viktoria's atelier</p>
      </div>

      <div className="blog-grid" style={{ marginTop:'40px' }}>
        {loading && (
          <p style={{ color:'rgba(255,255,255,0.3)', gridColumn:'1/-1', textAlign:'center', padding:'60px' }}>Loading...</p>
        )}
        {!loading && posts.length === 0 && (
          <p style={{ color:'rgba(255,255,255,0.3)', gridColumn:'1/-1', textAlign:'center', padding:'60px' }}>
            No articles published yet. Check back soon.
          </p>
        )}
        {posts.map((post, i) => (
          <BlogCard
            key={post._id}
            post={post}
            featured={i === 0}
            onClick={() => navigate(`/blog/${post._id}`)}
          />
        ))}
      </div>
    </div>
  );
}