import { useState, useEffect, useRef, useCallback } from "react";

const services = [
  {
    img: "/images/service1.webp",
    num: "01",
    title: "Custom Bridal Design",
    desc: "Every bride deserves a gown that tells her story. We craft bespoke wedding gowns from the finest European and Egyptian fabrics — a masterpiece made only for you."
  },
  {
    img: "/images/service2.jpg",
    num: "02",
    title: "Evening & Occasion Wear",
    desc: "From intimate gatherings to grand celebrations, our evening creations command attention with impeccable tailoring and timeless elegance."
  },
  {
    img: "/images/service1.webp",
    num: "03",
    title: "Expert Alterations",
    desc: "A perfect fit transforms everything. Our meticulous alterations service ensures your garment feels as extraordinary as it looks."
  },
  {
    img: "/images/service2.jpg",
    num: "04",
    title: "Express Wedding Dress Rescue",
    desc: "24-48 Hour Service.Last-minute bridal emergency? We offer express alterations and wedding dress transformations in Cairo within 24–48 hours, helping brides feel confident on their special day ."
  },
  {
    img: "/images/service1.webp",
    num: "05",
    title: "Bridal transformation",
    desc: "Give your gown a new life. We transform existing wedding dresses into unique designs that reflect your style, vision, and personality."
  },
  {
    img: "/images/service2.jpg",
    num: "06",
    title: "International Bridal Service",
    desc: "Based between Cairo and Madrid, Viktoria creates bespoke bridal gowns for clients across Spain, proving that distance is never an obstacle to exceptional craftsmanship and personal service."
  }
];

function Services() {
  // index of the currently-expanded card on mobile (null = none expanded)
  const [expandedIndex, setExpandedIndex] = useState(null);
  const containerRef = useRef(null);

  const isMobile = useCallback(() => window.innerWidth <= 768, []);

  const handleCardClick = (i) => {
    if (!isMobile()) return; // desktop keeps its normal hover behavior untouched
    setExpandedIndex((prev) => (prev === i ? null : i));
  };

  const closeExpanded = useCallback(() => setExpandedIndex(null), []);

  // tapping/clicking anywhere outside the expanded card collapses it back
  useEffect(() => {
    if (expandedIndex === null) return;

    const handleOutside = (e) => {
      const expandedEl = containerRef.current?.querySelector(
        `.service-card[data-index="${expandedIndex}"]`
      );
      if (expandedEl && !expandedEl.contains(e.target)) {
        closeExpanded();
      }
    };

    document.addEventListener("touchstart", handleOutside, { passive: true });
    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [expandedIndex, closeExpanded]);

  // collapse automatically if the viewport grows back into desktop size
  useEffect(() => {
    const handleResize = () => {
      if (!isMobile()) setExpandedIndex(null);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  // lock background scroll while a card is expanded on mobile
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
        {services.map((s, i) => (
          <div
            className={`service-card ${expandedIndex === i ? "is-expanded" : ""}`}
            data-index={i}
            key={i}
            onClick={() => handleCardClick(i)}
          >
            <img src={s.img} alt={s.title} loading="lazy" />
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
                onClick={(e) => { e.stopPropagation(); closeExpanded(); }}
                aria-label="Close"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;
