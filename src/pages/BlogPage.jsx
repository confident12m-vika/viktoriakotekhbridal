import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function BlogPage() {
  const [posts, setPosts] = useState([]);
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
        <span className="section-label" style={{color:'#c9a84c'}}>Journal</span>
        <h1 className="section-title" style={{color:'white'}}>Bridal Journal</h1>
        <p className="blog-page-sub">Stories, tips & inspiration from Viktoria's atelier</p>
      </div>

      <div className="blog-grid" style={{marginTop:'40px'}}>
        {loading && <p style={{color:'rgba(255,255,255,0.3)',gridColumn:'1/-1',textAlign:'center',padding:'60px'}}>Loading...</p>}
        {!loading && posts.length === 0 && (
          <p style={{color:'rgba(255,255,255,0.3)',gridColumn:'1/-1',textAlign:'center',padding:'60px'}}>
            No articles published yet. Check back soon.
          </p>
        )}
        {posts.map((post, i) => (
          <div
            key={post._id}
            className={`blog-card ${i === 0 ? 'blog-card-featured' : ''}`}
            onClick={() => navigate(`/blog/${post._id}`)}
          >
            <div className="blog-card-img">
              {post.image
                ? <img src={post.image.startsWith('http') ? post.image : `${API}${post.image}`} alt={post.title} />
                : <div style={{width:'100%',height:'100%',background:'#111',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(201,168,76,0.3)',fontSize:'40px'}}>✦</div>
              }
              <span className="blog-card-category">{post.category}</span>
            </div>
            <div className="blog-card-body">
              <div className="blog-card-meta">
                <span>{new Date(post.createdAt).toLocaleDateString('en-GB', {day:'numeric',month:'long',year:'numeric'})}</span>
              </div>
              <h2 className="blog-card-title">{post.title}</h2>
              {post.subtitle && <p style={{color:'rgba(255,255,255,0.4)',fontSize:'13px',fontStyle:'italic'}}>{post.subtitle}</p>}
              <p className="blog-card-excerpt">{post.excerpt || post.content?.slice(0,180)}...</p>
              <span className="blog-card-read">Read Article →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogPage;