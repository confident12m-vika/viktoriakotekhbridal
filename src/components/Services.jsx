import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "../i18n/useTranslation.jsx";

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const FALLBACK_IMGS = [
  "/images/service1.webp", "/images/service2.jpg",
  "/images/service1.webp", "/images/service2.jpg",
  "/images/service1.webp", "/images/service2.jpg",
];

function Services() {
  const { t } = useTranslation();
  const [serviceImgs, setServiceImgs] = useState({});
  const [expandedIndex, setExpandedIndex] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/api/services/images`)
      .then(r => r.json())
      .then(data => {
        const map = {};
        data.forEach(item => { map[item.serviceIndex] = item.imageUrl; });
        setServiceImgs(map);
      })
      .catch(() => {});
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
    document.body.style.overflow = expandedIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [expandedIndex]);

  const servicesList = t('services');
  const nums = ["01","02","03","04","05","06"];

  return (
    <section id="services" className="services reveal">
      <span className="section-label">{t('services_label')}</span>
      <h2 className="section-title">{t('services_title')}</h2>
      <div className="section-line"></div>
      <div className="services-container" ref={containerRef}>
        {Array.isArray(servicesList) && servicesList.map((s, i) => {
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
              <span className="service-num">{nums[i]}</span>
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