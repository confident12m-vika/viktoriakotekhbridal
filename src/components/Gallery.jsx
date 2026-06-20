import { useEffect, useState, useCallback, useRef } from "react";
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
  const [centeredId, setCenteredId] = useState(null);
  const trackRef = useRef(null);
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

  const adminImages = dbImages.map(img => ({ src: img.url.startsWith("http") ? img.url : `${API}${img.url}`, id: img._id }));
  const staticImages = STATIC.map((src, i) => ({ src, id: `static-${i}` }));
  const allImages = [...adminImages, ...staticImages];

  // عرض 6 صور بس في الصفحة الرئيسية
  const previewImages = allImages.slice(0, 6);

  // يحدد أي صورة في منتصف الشاشة عشان نضيفلها التوهج
  const updateCentered = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const trackRect = track.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;

    let closestId = null;
    let closestDist = Infinity;
    track.querySelectorAll("[data-gallery-item]").forEach((el) => {
      const r = el.getBoundingClientRect();
      const itemCenter = r.left + r.width / 2;
      const dist = Math.abs(itemCenter - trackCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestId = el.dataset.galleryItem;
      }
    });
    setCenteredId(closestId);
  }, []);

  useEffect(() => {
    updateCentered();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", updateCentered, { passive: true });
    window.addEventListener("resize", updateCentered);
    return () => {
      track.removeEventListener("scroll", updateCentered);
      window.removeEventListener("resize", updateCentered);
    };
  }, [updateCentered, previewImages.length]);

  return (
    <section id="gallery" className="gallery reveal">
      <span className="section-label">Portfolio</span>
      <h2 className="section-title">Bridal Gallery</h2>
      <div className="section-line"></div>

      <div className="gallery-grid" ref={trackRef}>
        {previewImages.map((img) => (
          <div
            className={`gallery-item ${centeredId === img.id ? "is-centered" : ""}`}
            key={img.id}
            data-gallery-item={img.id}
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
