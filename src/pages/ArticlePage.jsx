import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { articles } from "../data/blogData";

function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = articles.find(a => a.id === id);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!article) {
    return (
      <div className="article-notfound">
        <p>Article not found.</p>
        <button onClick={() => navigate("/blog")}>← Back to Journal</button>
      </div>
    );
  }

  // مقالات ذات صلة (باقي المقالات عدا الحالي)
  const related = articles.filter(a => a.id !== id).slice(0, 3);

  return (
    <div className="article-page">

      {/* Hero */}
      <div className="article-hero">
        <img src={article.image} alt={article.title} className="article-hero-img" />
        <div className="article-hero-overlay"></div>
        <div className="article-hero-content">
          <button className="gallery-back-btn" onClick={() => navigate("/blog")}>
            ← Journal
          </button>
          <span className="article-category">{article.category}</span>
          <h1 className="article-title">{article.title}</h1>
          <p className="article-subtitle">{article.subtitle}</p>
          <div className="article-meta">
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.readTime}</span>
            <span>·</span>
            <span>Viktoria Kotekh</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="article-body">
        <div className="article-lead">{article.excerpt}</div>

        {article.content.map((section, i) => (
          <div key={i} className="article-section">
            <h2 className="article-section-heading">{section.heading}</h2>
            <p className="article-section-body">{section.body}</p>
          </div>
        ))}

        {/* CTA */}
        <div className="article-cta">
          <span className="section-label">Ready to Begin?</span>
          <h3>Book Your Consultation with Viktoria</h3>
          <p>Every dream gown starts with a conversation. We'd love to hear your story.</p>
          <button className="btn-gold" onClick={() => navigate("/#booking")}>
            Book a Fitting
          </button>
        </div>
      </div>

      {/* Related Articles */}
      <div className="article-related">
        <div className="article-related-inner">
          <h3 className="article-related-title">Continue Reading</h3>
          <div className="blog-grid blog-grid-small">
            {related.map(a => (
              <div
                key={a.id}
                className="blog-card"
                onClick={() => { navigate(`/blog/${a.id}`); window.scrollTo(0,0); }}
              >
                <div className="blog-card-img">
                  <img src={a.image} alt={a.title} loading="lazy" />
                  <span className="blog-card-category">{a.category}</span>
                </div>
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span>{a.date}</span>
                    <span>·</span>
                    <span>{a.readTime}</span>
                  </div>
                  <h2 className="blog-card-title">{a.title}</h2>
                  <span className="blog-card-read">Read Article →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default ArticlePage;