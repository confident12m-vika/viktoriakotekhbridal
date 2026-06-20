import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATIC = [
  "/images/service1.webp",
  "/images/service2.jpg",
  "/images/story.jpg",
  "/images/service1.webp",
  "/images/service2.jpg",
  "/images/story.jpg",
  "/images/service1.webp",
  "/images/service2.jpg",
];

function GalleryPage() {
  const [dbImages, setDbImages] = useState([]);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
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
      if (e.key === "Escape") setLightboxSrc(null);
      if (e.key === "ArrowRight") nextImg();
      if (e.key === "ArrowLeft") prevImg();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex]);

  useEffect(() => {
    document.body.style.overflow = lightboxSrc ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxSrc]);

  // scroll to top
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // يدعم رابط Cloudinary الكامل (https://...) والروابط النسبية القديمة (/uploads/...)
  const adminImages = dbImages.map(img => ({
    src: img.url.startsWith("http") ? img.url : `${API}${img.url}`,
    id: img._id,
    caption: img.caption || "",
    type: "Couture"
  }));

  const staticImages = STATIC.map((src, i) => ({
    src,
    id: `static-${i}`,
    caption: "",
    type: i % 2 === 0 ? "Bridal" : "Evening"
  }));

  const allImages = [...adminImages, ...staticImages];
  const filters = ["All", "Bridal", "Evening", "Couture"];
  const filtered = filter === "All" ? allImages : allImages.filter(img => img.type === filter);

  function openLightbox(src, index) {
    setLightboxSrc(src);
    setLightboxIndex(index);
  }

  function nextImg() {
    const next = (lightboxIndex + 1) % filtered.length;
    setLightboxIndex(next);
    setLightboxSrc(filtered[next].src);
  }

  function prevImg() {
    const prev = (lightboxIndex - 1 + filtered.length) % filtered.length;
    setLightboxIndex(prev);
    setLightboxSrc(filtered[prev].src);
  }

  return (
    <div className="gallery-page">

      {/* Header */}
      <div className="gallery-page-header">
        <button className="gallery-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="gallery-page-title">
          <span className="section-label">Portfolio</span>
          <h1 className="section-title" style={{color:"white"}}>Bridal Gallery</h1>
          <p className="gallery-page-sub">
            Every gown tells a story. Explore our collection of bespoke creations.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="gallery-filters">
        {filters.map(f => (
          <button
            key={f}
            className={`gallery-filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
        <span className="gallery-total">{filtered.length} pieces</span>
      </div>

      {/* Grid */}
      <div className="gallery-page-grid">
        {filtered.map((img, i) => (
          <div
            className="gallery-page-item"
            key={img.id}
            onClick={() => openLightbox(img.src, i)}
          >
            <img src={img.src} alt={img.caption || "Gallery"} loading="lazy" />
            <div className="gallery-page-overlay">
              <span className="gallery-page-plus">+</span>
              {img.caption && <p className="gallery-page-caption">{img.caption}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div className="lightbox active" onClick={() => setLightboxSrc(null)}>
          <button className="lightbox-close" onClick={() => setLightboxSrc(null)}>✕</button>
          <button className="lightbox-back" onClick={() => setLightboxSrc(null)}>← Back</button>

          {/* Navigation */}
          <button className="lightbox-prev" onClick={e => { e.stopPropagation(); prevImg(); }}>‹</button>
          <button className="lightbox-next" onClick={e => { e.stopPropagation(); nextImg(); }}>›</button>

          <img
            className="lightbox-img"
            src={lightboxSrc}
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
