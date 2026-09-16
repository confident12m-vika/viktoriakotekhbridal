import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API}/api/blog/${id}`)
      .then(r => r.json())
      .then(data => { setPost(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <p style={{color:'rgba(255,255,255,0.3)',letterSpacing:'3px'}}>Loading...</p>
    </div>
  );

  if (!post || post.message) return (
    <div className="article-notfound">
      <p style={{color:'rgba(255,255,255,0.4)',letterSpacing:'2px'}}>Article not found.</p>
      <button className="gallery-back-btn" onClick={() => navigate('/blog')}>← Back to Journal</button>
    </div>
  );

  const imgSrc = post.image ? (post.image.startsWith('http') ? post.image : `${API}${post.image}`) : null;

  return (
    <div className="article-page">
      <div className="article-hero" style={imgSrc ? {} : {background:'#0a0a0a',minHeight:'40vh'}}>
        {imgSrc && <img src={imgSrc} className="article-hero-img" alt={post.title} />}
        <div className="article-hero-overlay"></div>
        <div className="article-hero-content">
          <button className="gallery-back-btn" style={{position:'absolute',top:'-120px',left:0}} onClick={() => navigate('/blog')}>← Journal</button>
          <span className="article-category">{post.category}</span>
          <h1 className="article-title">{post.title}</h1>
          {post.subtitle && <p className="article-subtitle">{post.subtitle}</p>}
          <div className="article-meta">
            <span>{new Date(post.createdAt).toLocaleDateString('en-GB', {day:'numeric',month:'long',year:'numeric'})}</span>
          </div>
        </div>
      </div>

      <div className="article-body">
        <div className="article-lead">{post.excerpt}</div>
        <div className="article-section">
          <div className="article-section-body" style={{whiteSpace:'pre-wrap'}}>
            {post.content}
          </div>
        </div>

        <div className="article-cta">
          <span className="section-label">Book Your Fitting</span>
          <h3>Ready to Begin Your Journey?</h3>
          <p>Let Viktoria create your dream gown — in Cairo or internationally.</p>
          <a href="/#booking" className="btn-gold" style={{display:'inline-block',marginTop:'8px'}}>Start Your Project</a>
        </div>
      </div>
    </div>
  );
}

export default ArticlePage;