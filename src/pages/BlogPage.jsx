import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { articles } from "../data/blogData";

function BlogPage() {
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="blog-page">

      {/* Header */}
      <div className="blog-page-header">
        <button className="gallery-back-btn" onClick={() => navigate(-1)}>← Back</button>
        <span className="section-label">Journal</span>
        <h1 className="section-title" style={{color:"white"}}>Bridal Journal</h1>
        <p className="blog-page-sub">
          Stories, guides, and inspiration for the modern bride
        </p>
      </div>

      {/* Articles Grid */}
      <div className="blog-grid">
        {articles.map((article, i) => (
          <div
            key={article.id}
            className={`blog-card ${i === 0 ? "blog-card-featured" : ""}`}
            onClick={() => navigate(`/blog/${article.id}`)}
          >
            <div className="blog-card-img">
              <img src={article.image} alt={article.title} loading="lazy" />
              <span className="blog-card-category">{article.category}</span>
            </div>
            <div className="blog-card-body">
              <div className="blog-card-meta">
                <span>{article.date}</span>
                <span>·</span>
                <span>{article.readTime}</span>
              </div>
              <h2 className="blog-card-title">{article.title}</h2>
              <p className="blog-card-excerpt">{article.excerpt}</p>
              <span className="blog-card-read">Read Article →</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default BlogPage;