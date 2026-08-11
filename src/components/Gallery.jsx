import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Gallery() {
  const [dbImages, setDbImages] = useState([]);
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

  // صور الأدمن فقط — بدون صور تجريبية ثابتة
  const allImages = dbImages.map(img => ({
    src: img.url.startsWith("http") ? img.url : `${API}${img.url}`,
    id: img._id,
  }));

  // عرض 6 صور بس في الصفحة الرئيسية
  const previewImages = allImages.slice(0, 6);

  // يحدد أي صورة في منتصف الشاشة عشان نضيفلها التوهج (للموبايل)
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
        {previewImages.length === 0 && (
          <p style={{color:"rgba(0,0,0,0.3)",padding:"40px",textAlign:"center",width:"100%"}}>
            Gallery coming soon.
          </p>
        )}
        {previewImages.map((img) => (
          <div
            className={`gallery-item ${centeredId === img.id ? "is-centered" : ""}`}
            key={img.id}
            data-gallery-item={img.id}
            onClick={() => navigate("/gallery")}
            style={{cursor:"pointer"}}
          >
            <img src={img.src} alt="Gallery" loading="lazy" />
            <div className="gallery-item-overlay">
              <span>→ View Gallery</span>
            </div>
          </div>
        ))}
      </div>

      <div className="gallery-cta">
        <p className="gallery-count">{allImages.length}+ Creations</p>
        <button className="gallery-btn" onClick={() => navigate("/gallery")}>
          View Full Gallery
        </button>
      </div>
    </section>
  );
}

export default Gallery;