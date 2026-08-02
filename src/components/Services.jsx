import { useState, useEffect, useRef, useCallback } from "react";

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SERVICES_DATA = [
  { num: "01", title: "Custom Bridal Design",       desc: "Every bride deserves a gown that tells her story. We craft bespoke wedding gowns from the finest European and Egyptian fabrics — a masterpiece made only for you." },
  { num: "02", title: "Evening & Occasion Wear",    desc: "From intimate gatherings to grand celebrations, our evening creations command attention with impeccable tailoring and timeless elegance." },
  { num: "03", title: "Expert Alterations",         desc: "A perfect fit transforms everything. Our meticulous alterations service ensures your garment feels as extraordinary as it looks." },
  { num: "04", title: "Express Wedding Dress Rescue", desc: "24-48 Hour Service. Last-minute bridal emergency? We offer express alterations and wedding dress transformations in Cairo within 24–48 hours, helping brides feel confident on their special day." },
  { num: "05", title: "Bridal Transformation",      desc: "Give your gown a new life. We transform existing wedding dresses into unique designs that reflect your style, vision, and personality." },
  { num: "06", title: "International Bridal Service", desc: "Based between Cairo and Madrid, Viktoria creates bespoke bridal gowns for clients across Spain, proving that distance is never an obstacle to exceptional craftsmanship and personal service." },
];

// الصور الاحتياطية لو لم يتم رفع صورة من الأدمن بعد
const FALLBACK_IMGS = [
  "/images/service1.webp",
  "/images/service2.jpg",
  "/images/service1.webp",
  "/images/service2.jpg",
  "/images/service1.webp",
  "/images/service2.jpg",
];

function Services() {
  const [serviceImgs, setServiceImgs] = useState({});
  const [expandedIndex, setExpandedIndex] = useState(null);
  const containerRef = useRef(null);

  // جلب صور الخدمات من API
  useEffect(() => {
    fetch(`${API}/api/services/images`)
      .then(r => r.json())
      .then(data => {
        const map = {};
        data.forEach(item => { map[item.serviceIndex] = item.imageUrl; });
        setServiceImgs(map);
      })
      .catch(() => {}); // لو فشل، هيستخدم الصور الاحتياطية
  }, []);

  const isMobile = useCallback(() => window.innerWidth <= 768, []);

  const handleCardClick = (i) => {
    if (!isMobile()) return;
    setExpandedIndex(prev => prev === i ? null : i);
  };

  const closeExpanded = useCallback(() => setExpandedIndex(null), []);

  useEffect(() => {
    if (expandedIndex === null) return;
    const handleOutside = (e) => {
      const el = containerRef.current?.querySelector(`.service-card[data-index="${expandedIndex}"]`);
      if (el && !el.contains(e.target)) closeExpanded();
    };
    document.addEventListener("touchstart", handleOutside, { passive: true });
    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [expandedIndex, closeExpanded]);

  useEffect(() => {
    const onResize = () => { if (!isMobile()) setExpandedIndex(null); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMobile]);

  useEffect(() => {
    document.body.style.overflow = expandedIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [expandedIndex]);

  return (
    <section id="services" className="services reveal">
      <span className="section-label">What We Offer</span>
      <h2 className="section-title">Our Services</h2>
      <div className="section-line"></div>
      <div className="services-container" ref={containerRef}>
        {SERVICES_DATA.map((s, i) => {
          const imgSrc = serviceImgs[i + 1] || FALLBACK_IMGS[i];
          return (
            <div
              className={`service-card ${expandedIndex === i ? "is-expanded" : ""}`}
              data-index={i}
              key={i}
              onClick={() => handleCardClick(i)}
            >
              <img src={imgSrc} alt={s.title} loading="lazy" />
              <div className="service-overlay">
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
              <span className="service-num">{s.num}</span>
              {expandedIndex === i && (
                <button
                  className="service-close-btn"
                  onClick={e => { e.stopPropagation(); closeExpanded(); }}
                  aria-label="Close"
                >✕</button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Services;
