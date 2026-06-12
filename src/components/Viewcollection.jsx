import { useState, useEffect } from "react";

const collections = [
  {
    id: 1,
    title: "Classic Couture",
    subtitle: "الكلاسيكية الراقية",
    description:
      "Where heritage meets perfection. Each stitch a testament to timeless artistry, draped in silk and legacy.",
    tag: "HERITAGE · SS 2026",
    accent: "#b8956a",
    bg: "#0e0b07",
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    overlay: "rgba(14,11,7,0.45)",
    badge: "COUTURE",
  },
  {
    id: 2,
    title: "Romantic Breeze",
    subtitle: "النسيم الرومانسي",
    description:
      "Soft whispers of chiffon floating through golden light. An ode to femininity, freedom, and fleeting moments.",
    tag: "RESORT · SS 2026",
    accent: "#d4a5b5",
    bg: "#1a0f12",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    overlay: "rgba(26,15,18,0.4)",
    badge: "BRIDAL",
  },
  {
    id: 3,
    title: "Modern Minimal",
    subtitle: "البساطة الحديثة",
    description:
      "The power of restraint. Clean lines and architectural silhouettes for the woman who speaks through silence.",
    tag: "STUDIO · SS 2026",
    accent: "#8a8a8a",
    bg: "#0a0a0a",
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    overlay: "rgba(10,10,10,0.5)",
    badge: "READY-TO-WEAR",
  },
];

function CollectionCard({ col, index }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 180 + 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: "2px",
        overflow: "hidden",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
        background: col.bg,
        boxShadow: hovered
          ? `0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${col.accent}55`
          : "0 8px 40px rgba(0,0,0,0.5)",
        transitionProperty: "opacity, transform, box-shadow",
        transitionDuration: "0.8s, 0.8s, 0.4s",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: "520px", overflow: "hidden" }}>
        <img
          src={col.img}
          alt={col.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        />
        {/* gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to bottom, ${col.overlay} 0%, transparent 35%, transparent 55%, ${col.bg}ee 100%)`,
          }}
        />
        {/* Badge */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            padding: "5px 12px",
            border: `1px solid ${col.accent}`,
            color: col.accent,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "9px",
            letterSpacing: "3px",
            fontWeight: 600,
            background: `${col.bg}cc`,
            backdropFilter: "blur(4px)",
          }}
        >
          {col.badge}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "28px 28px 32px", position: "relative" }}>
        {/* Accent line */}
        <div
          style={{
            width: hovered ? "60px" : "30px",
            height: "1px",
            background: col.accent,
            marginBottom: "18px",
            transition: "width 0.4s ease",
          }}
        />

        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "10px",
            letterSpacing: "3px",
            color: col.accent,
            marginBottom: "10px",
            opacity: 0.9,
          }}
        >
          {col.tag}
        </p>

        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(26px, 4vw, 34px)",
            fontWeight: 300,
            color: "#f5f0ea",
            lineHeight: 1.1,
            margin: "0 0 6px",
            letterSpacing: "1px",
          }}
        >
          {col.title}
        </h2>

        <p
          style={{
            fontFamily: "'Tajawal', sans-serif",
            fontSize: "13px",
            color: col.accent,
            opacity: 0.7,
            marginBottom: "16px",
            letterSpacing: "1px",
          }}
        >
          {col.subtitle}
        </p>

        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "14.5px",
            color: "#b0a898",
            lineHeight: 1.75,
            marginBottom: "28px",
            fontStyle: "italic",
          }}
        >
          {col.description}
        </p>

        {/* CTA */}
        <button
          style={{
            background: "transparent",
            border: `1px solid ${col.accent}`,
            color: col.accent,
            padding: "11px 28px",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "11px",
            letterSpacing: "3px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            transition: "all 0.3s ease",
            ...(hovered
              ? { background: col.accent, color: col.bg }
              : {}),
          }}
        >
          EXPLORE COLLECTION
          <span style={{ fontSize: "16px", lineHeight: 1 }}>→</span>
        </button>
      </div>
    </div>
  );
}

export default function FashionPage() {
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeaderVisible(true), 50);
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Tajawal:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #080604; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080604; }
        ::-webkit-scrollbar-thumb { background: #6b5a48; border-radius: 2px; }

        @media (max-width: 768px) {
          .grid-cols { grid-template-columns: 1fr !important; }
          .hero-title { font-size: clamp(38px, 10vw, 60px) !important; }
          .nav-links { display: none !important; }
        }

        @media (min-width: 769px) and (max-width: 1100px) {
          .grid-cols { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#080604", color: "#f5f0ea" }}>

        {/* ── NAV ── */}
        <nav
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            padding: "20px 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: scrolled ? "rgba(8,6,4,0.92)" : "transparent",
            backdropFilter: scrolled ? "blur(12px)" : "none",
            borderBottom: scrolled ? "1px solid rgba(184,149,106,0.15)" : "none",
            transition: "all 0.5s ease",
          }}
        >
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 300, letterSpacing: "6px", color: "#b8956a" }}>
            MAISON
          </div>
          <div className="nav-links" style={{ display: "flex", gap: "40px" }}>
            {["COLLECTIONS", "ABOUT", "LOOKBOOK", "CONTACT"].map((item) => (
              <a key={item} href="#" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "3px", color: "#8a7a6a", textDecoration: "none", transition: "color 0.3s" }}>
                {item}
              </a>
            ))}
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "2px", color: "#6a5a4a" }}>
            SS 2026
          </div>
        </nav>

        {/* ── HERO ── */}
        <section
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Ambient background orbs */}
          <div style={{ position: "absolute", top: "20%", left: "10%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(184,149,106,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "20%", right: "10%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(212,165,181,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* Decorative top line */}
          <div
            style={{
              width: headerVisible ? "80px" : "0px",
              height: "1px",
              background: "#b8956a",
              marginBottom: "32px",
              transition: "width 1.2s ease 0.2s",
            }}
          />

          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "10px",
              letterSpacing: "5px",
              color: "#b8956a",
              marginBottom: "24px",
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "none" : "translateY(10px)",
              transition: "all 0.9s ease 0.4s",
            }}
          >
            THE NEW COLLECTION · SPRING SUMMER 2026
          </p>

          <h1
            className="hero-title"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(48px, 8vw, 96px)",
              fontWeight: 300,
              lineHeight: 1,
              letterSpacing: "4px",
              color: "#f5f0ea",
              marginBottom: "8px",
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "none" : "translateY(20px)",
              transition: "all 1s ease 0.6s",
            }}
          >
            WHERE FASHION
          </h1>
          <h1
            className="hero-title"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(48px, 8vw, 96px)",
              fontWeight: 300,
              lineHeight: 1,
              letterSpacing: "4px",
              fontStyle: "italic",
              color: "#b8956a",
              marginBottom: "40px",
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "none" : "translateY(20px)",
              transition: "all 1s ease 0.8s",
            }}
          >
            BECOMES ART
          </h1>

          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "16px",
              fontStyle: "italic",
              color: "#7a6a5a",
              maxWidth: "480px",
              lineHeight: 1.8,
              opacity: headerVisible ? 1 : 0,
              transition: "opacity 1s ease 1s",
            }}
          >
            Three visions. One house. An eternal conversation between the past, present, and the yet-to-be.
          </p>

          {/* Scroll indicator */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              opacity: headerVisible ? 0.5 : 0,
              transition: "opacity 1s ease 1.5s",
            }}
          >
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "9px", letterSpacing: "3px", color: "#6a5a4a" }}>SCROLL</span>
            <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, #b8956a, transparent)" }} />
          </div>
        </section>

        {/* ── SECTION HEADING ── */}
        <section style={{ textAlign: "center", padding: "80px 24px 60px" }}>
          <div style={{ width: "40px", height: "1px", background: "#b8956a", margin: "0 auto 24px" }} />
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "4px", color: "#b8956a", marginBottom: "16px" }}>THE COLLECTIONS</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 300, color: "#f5f0ea", letterSpacing: "2px" }}>
            Three Chapters of Beauty
          </h2>
        </section>

        {/* ── COLLECTION GRID ── */}
        <section style={{ padding: "0 clamp(16px, 4vw, 60px) 100px", maxWidth: "1400px", margin: "0 auto" }}>
          <div
            className="grid-cols"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
            }}
          >
            {collections.map((col, i) => (
              <CollectionCard key={col.id} col={col} index={i} />
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          style={{
            borderTop: "1px solid rgba(184,149,106,0.15)",
            padding: "48px clamp(24px, 5vw, 80px)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 300, letterSpacing: "8px", color: "#b8956a" }}>
            MAISON
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", letterSpacing: "2px", color: "#4a3a2a", fontStyle: "italic" }}>
            © 2026 Maison. Crafted with passion.
          </p>
          <div style={{ display: "flex", gap: "28px" }}>
            {["IG", "FB", "TW"].map((s) => (
              <a key={s} href="#" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "2px", color: "#5a4a3a", textDecoration: "none" }}>{s}</a>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
