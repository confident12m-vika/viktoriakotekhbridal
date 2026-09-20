import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOnDemandTranslate } from "../hooks/useOnDemandTranslate.js";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// بطاقة كوليكشن مع زرار ترجمة
function CollectionCard({ col, index }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  const accent = col.accent || "#b8956a";
  const bg     = col.bg     || "#0e0b07";

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 180 + 100);
    return () => clearTimeout(timer);
  }, [index]);

  // زرار الترجمة — نفس pattern Animal Joy
  const { shown, translated, translating, toggle, show: showBtn } = useOnDemandTranslate({
    title:       col.title       || '',
    subtitle:    col.subtitle    || '',
    description: col.description || '',
  });

  const imgSrc = col.image
    ? (col.image.startsWith("http") ? col.image : `${API}${col.image}`)
    : "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", borderRadius: "2px", overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.8s ease, transform 0.8s ease, box-shadow 0.4s ease",
        background: bg,
        boxShadow: hovered
          ? `0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${accent}55`
          : "0 8px 40px rgba(0,0,0,0.5)",
      }}
    >
      {/* صورة */}
      <div style={{ position: "relative", height: "520px", overflow: "hidden" }}>
        <img
          src={imgSrc} alt={shown.title}
          style={{
            width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, ${bg}ee 100%)`,
        }} />

        {/* Badge */}
        {col.badge && (
          <div style={{
            position: "absolute", top: "20px", left: "20px",
            padding: "5px 12px", border: `1px solid ${accent}`,
            color: accent, fontFamily: "'Cormorant Garamond', serif",
            fontSize: "9px", letterSpacing: "3px", fontWeight: 600,
            background: `${bg}cc`, backdropFilter: "blur(4px)",
          }}>
            {col.badge}
          </div>
        )}

        {/* زرار الترجمة — أعلى يمين الصورة، يظهر بس لو اللغة مش إنجليزي */}
        {showBtn && (
          <button
            onClick={e => { e.stopPropagation(); toggle(); }}
            style={{
              position: "absolute", top: "16px", right: "16px",
              background: translated ? `${accent}22` : "rgba(0,0,0,0.55)",
              backdropFilter: "blur(8px)",
              border: `1px solid ${accent}66`,
              color: accent,
              padding: "6px 14px",
              cursor: "pointer",
              fontFamily: "'Jost', sans-serif",
              fontSize: "10px", letterSpacing: "1.5px",
              transition: "0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {translating ? '...' : translated ? '✕ Original' : '🌐 Translate'}
          </button>
        )}
      </div>

      {/* محتوى */}
      <div style={{ padding: "28px 28px 32px" }}>
        <div style={{ width: hovered ? "60px" : "30px", height: "1px", background: accent, marginBottom: "18px", transition: "width 0.4s ease" }} />

        {col.tag && (
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "3px", color: accent, marginBottom: "10px", opacity: 0.9 }}>
            {col.tag}
          </p>
        )}

        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px,4vw,32px)", fontWeight: 300, color: "#f5f0ea", lineHeight: 1.1, margin: "0 0 6px", letterSpacing: "1px" }}>
          {shown.title}
        </h2>

        {shown.subtitle && (
          <p style={{ fontSize: "13px", color: accent, opacity: 0.7, marginBottom: "16px", letterSpacing: "1px" }}>
            {shown.subtitle}
          </p>
        )}

        {shown.description && (
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "14.5px", color: "#b0a898", lineHeight: 1.75, marginBottom: "28px", fontStyle: "italic" }}>
            {shown.description}
          </p>
        )}

        <button style={{
          background: "transparent", border: `1px solid ${accent}`, color: accent,
          padding: "11px 28px", fontFamily: "'Cormorant Garamond', serif",
          fontSize: "11px", letterSpacing: "3px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "10px", transition: "all 0.3s ease",
          ...(hovered ? { background: accent, color: bg } : {}),
        }}>
          EXPLORE <span style={{ fontSize: "16px" }}>→</span>
        </button>
      </div>
    </div>
  );
}

export default function Viewcollection() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [scrolled, setScrolled]       = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 50);
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => { clearTimeout(t); window.removeEventListener("scroll", fn); };
  }, []);

  useEffect(() => {
    fetch(`${API}/api/collections`)
      .then(r => r.json())
      .then(d => { setCollections(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @media(max-width:768px) { .col-grid { grid-template-columns: 1fr !important; } .col-hero-title { font-size: clamp(36px,10vw,56px) !important; } }
        @media(min-width:769px) and (max-width:1100px) { .col-grid { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#080604", color: "#f5f0ea" }}>

        {/* NAV */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: "16px 48px", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: scrolled ? "rgba(8,6,4,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(184,149,106,0.15)" : "none",
          transition: "all 0.5s ease",
        }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 300, letterSpacing: "6px", color: "#b8956a" }}>
            VIKTORIA KOTEKH
          </div>
          <button
            onClick={() => navigate("/")}
            style={{ background: "transparent", border: "1px solid rgba(184,149,106,0.3)", color: "#b8956a", padding: "7px 18px", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: "10px", letterSpacing: "2px" }}
          >
            ← Back
          </button>
        </nav>

        {/* HERO */}
        <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px", position: "relative" }}>
          <div style={{ position: "absolute", top: "20%", left: "10%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(184,149,106,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ width: headerVisible ? "80px" : "0px", height: "1px", background: "#b8956a", marginBottom: "32px", transition: "width 1.2s ease 0.2s" }} />
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "5px", color: "#b8956a", marginBottom: "24px", opacity: headerVisible ? 1 : 0, transition: "opacity 0.9s ease 0.4s" }}>
            THE NEW COLLECTION · SPRING SUMMER 2026
          </p>
          <h1 className="col-hero-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px,8vw,96px)", fontWeight: 300, lineHeight: 1, letterSpacing: "4px", color: "#f5f0ea", marginBottom: "8px", opacity: headerVisible ? 1 : 0, transition: "all 1s ease 0.6s" }}>
            WHERE FASHION
          </h1>
          <h1 className="col-hero-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px,8vw,96px)", fontWeight: 300, lineHeight: 1, letterSpacing: "4px", fontStyle: "italic", color: "#b8956a", marginBottom: "40px", opacity: headerVisible ? 1 : 0, transition: "all 1s ease 0.8s" }}>
            BECOMES ART
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontStyle: "italic", color: "#7a6a5a", maxWidth: "480px", lineHeight: 1.8, opacity: headerVisible ? 1 : 0, transition: "opacity 1s ease 1s" }}>
            Three visions. One house. An eternal conversation between the past, present, and the yet-to-be.
          </p>
          <div style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: headerVisible ? 0.5 : 0, transition: "opacity 1s ease 1.5s" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "9px", letterSpacing: "3px", color: "#6a5a4a" }}>SCROLL</span>
            <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, #b8956a, transparent)" }} />
          </div>
        </section>

        {/* SECTION HEADING */}
        <section style={{ textAlign: "center", padding: "80px 24px 60px" }}>
          <div style={{ width: "40px", height: "1px", background: "#b8956a", margin: "0 auto 24px" }} />
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "4px", color: "#b8956a", marginBottom: "16px" }}>THE COLLECTIONS</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px,5vw,42px)", fontWeight: 300, color: "#f5f0ea", letterSpacing: "2px" }}>
            Chapters of Beauty
          </h2>
        </section>

        {/* COLLECTIONS GRID */}
        <section style={{ padding: "0 clamp(16px,4vw,60px) 100px", maxWidth: "1400px", margin: "0 auto" }}>
          {loading && <p style={{ textAlign: "center", color: "rgba(184,149,106,0.5)", padding: "60px", letterSpacing: "3px" }}>Loading...</p>}
          {!loading && collections.length === 0 && (
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", padding: "60px", fontFamily: "'Cormorant Garamond',serif", fontSize: "18px", fontStyle: "italic" }}>
              No collections yet. Add from the admin panel.
            </p>
          )}
          {collections.length > 0 && (
            <div className="col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px" }}>
              {collections.map((col, i) => <CollectionCard key={col._id} col={col} index={i} />)}
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: "1px solid rgba(184,149,106,0.15)", padding: "40px clamp(24px,5vw,80px)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "20px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 300, letterSpacing: "6px", color: "#b8956a" }}>VIKTORIA KOTEKH</div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", letterSpacing: "2px", color: "#4a3a2a", fontStyle: "italic" }}>© 2026 Viktoria Kotekh. Crafted with passion.</p>
        </footer>
      </div>
    </>
  );
}