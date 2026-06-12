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
];

function Gallery() {
  const [dbImages, setDbImages] = useState([]);
  const [lightboxSrc, setLightboxSrc] = useState(null);
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
    const handleKey = (e) => { if (e.key === "Escape") setLightboxSrc(null); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = lightboxSrc ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxSrc]);

  const adminImages = dbImages.map(img => ({ src: `${API}${img.url}`, id: img._id }));
  const staticImages = STATIC.map((src, i) => ({ src, id: `static-${i}` }));
  const allImages = [...adminImages, ...staticImages];

  // عرض 6 صور بس في الصفحة الرئيسية
  const previewImages = allImages.slice(0, 6);

  return (
    <section id="gallery" className="gallery reveal">
      <span className="section-label">Portfolio</span>
      <h2 className="section-title">Bridal Gallery</h2>
      <div className="section-line"></div>

      <div className="gallery-grid">
        {previewImages.map((img) => (
          <div
            className="gallery-item"
            key={img.id}
            onClick={() => setLightboxSrc(img.src)}
          >
            <img src={img.src} alt="Gallery" loading="lazy" />
            <div className="gallery-item-overlay">
              <span>+</span>
            </div>
          </div>
        ))}
      </div>

      {/* زرار View Full Gallery */}
      <div className="gallery-cta">
        <p className="gallery-count">{allImages.length}+ Creations</p>
        <button
          className="gallery-btn"
          onClick={() => navigate("/gallery")}
        >
          View Full Gallery
        </button>
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div className="lightbox active" onClick={() => setLightboxSrc(null)}>
          <button className="lightbox-close" onClick={() => setLightboxSrc(null)}>✕</button>
          <button className="lightbox-back" onClick={() => setLightboxSrc(null)}>← Back</button>
          <img
            className="lightbox-img"
            src={lightboxSrc}
            alt=""
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}

export default Gallery;
