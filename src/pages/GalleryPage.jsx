import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// الأقسام الأربعة
const CATEGORIES = ["All", "Bridal", "Evening", "Couture", "Alterations"];

function GalleryPage() {
  const [dbImages, setDbImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const loadImages = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/gallery`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDbImages(data);
    } catch {
      setDbImages([]);
    }
  }, []);

  useEffect(() => { loadImages(); }, [loadImages]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") navigate2(1);
      if (e.key === "ArrowLeft")  navigate2(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex]);

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // صور من الأدمن فقط — بدون صور تجريبية ثابتة
  const allImages = dbImages.map(img => ({
    src: img.url.startsWith("http") ? img.url : `${API}${img.url}`,
    id: img._id,
    caption: img.caption || "",
    category: img.category || "Couture",
  }));

  const filtered = filter === "All"
    ? allImages
    : allImages.filter(img => img.category === filter);

  function navigate2(dir) {
    if (lightboxIndex === null) return;
    const next = (lightboxIndex + dir + filtered.length) % filtered.length;
    setLightboxIndex(next);
  }

  return (
    <div className="gallery-page">

      {/* Header */}
      <div className="gallery-page-header">
        <button className="gallery-back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="gallery-page-title">
          <span className="section-label">Portfolio</span>
          <h1 className="section-title" style={{color:"white"}}>Bridal Gallery</h1>
          <p className="gallery-page-sub">Every gown tells a story. Explore our collection of bespoke creations.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="gallery-filters">
        {CATEGORIES.map(f => (
          <button
            key={f}
            className={`gallery-filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >{f}</button>
        ))}
        <span className="gallery-total">{filtered.length} pieces</span>
      </div>

      {/* Grid */}
      <div className="gallery-page-grid">
        {filtered.length === 0 && (
          <p style={{color:"rgba(255,255,255,0.3)",padding:"60px",textAlign:"center",gridColumn:"1/-1"}}>
            No images yet. Upload from the admin panel.
          </p>
        )}
        {filtered.map((img, i) => (
          <div className="gallery-page-item" key={img.id} onClick={() => setLightboxIndex(i)}>
            <img src={img.src} alt={img.caption || "Gallery"} loading="lazy" />
            <div className="gallery-page-overlay">
              <span className="gallery-page-plus">+</span>
              {img.caption && <p className="gallery-page-caption">{img.caption}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div className="lightbox active" onClick={() => setLightboxIndex(null)}>
          {/* زرار الإغلاق — ثابت على الشاشة */}
          <button className="lightbox-close" onClick={() => setLightboxIndex(null)}>✕</button>

          {/* زرار الرجوع — ثابت أعلى يسار */}
          <button
            className="lightbox-back"
            style={{position:"fixed",top:"20px",left:"24px",zIndex:10001}}
            onClick={() => setLightboxIndex(null)}
          >← Back</button>

          <button className="lightbox-prev" onClick={e => { e.stopPropagation(); navigate2(-1); }}>‹</button>
          <button className="lightbox-next" onClick={e => { e.stopPropagation(); navigate2(1); }}>›</button>

          <img
            className="lightbox-img"
            src={filtered[lightboxIndex].src}
            alt=""
            onClick={e => e.stopPropagation()}
          />

          <div className="lightbox-counter">
            {lightboxIndex + 1} / {filtered.length}
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryPage;