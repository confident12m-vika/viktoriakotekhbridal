import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "../i18n/useTranslation";

const reviews = [
  { name: "Sarah M.",    country: "🇪🇬 Cairo, Egypt",     rating: 5, text: "Viktoria created the most breathtaking gown I've ever seen. Every detail was perfect — she truly understood my vision.", date: "March 2026" },
  { name: "Isabella R.", country: "🇪🇸 Barcelona, Spain", rating: 5, text: "I flew to Cairo specifically to work with Viktoria. The experience was extraordinary. Her craftsmanship is world-class.", date: "February 2026" },
  { name: "Nour A.",     country: "🇪🇬 Alexandria",       rating: 5, text: "The alteration service was flawless. My mother's vintage gown was transformed beautifully. Highly recommend.", date: "January 2026" },
  { name: "Maria L.",    country: "🇫🇷 Paris, France",    rating: 5, text: "Working with Viktoria was a dream. My gown arrived exactly as envisioned — absolutely stunning.", date: "December 2025" },
  { name: "Layla K.",    country: "🇦🇪 Dubai, UAE",       rating: 5, text: "The Arabic gown she designed for me was a masterpiece. Traditional yet modern, elegant yet comfortable.", date: "November 2025" },
  { name: "Sofia T.",    country: "🇮🇹 Milan, Italy",     rating: 5, text: "15 years of experience truly shows in every stitch. An extraordinary eye for detail.", date: "October 2025" },
];

function Stars({ count }) {
  return <div className="review-stars">{Array.from({length:count}).map((_,i)=><span key={i}>★</span>)}</div>;
}

function Reviews() {
  const { t } = useTranslation();
  const [centeredIndex, setCenteredIndex] = useState(null);
  const trackRef = useRef(null);

  const updateCentered = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.getBoundingClientRect().left + track.getBoundingClientRect().width / 2;
    let closest = null, minDist = Infinity;
    track.querySelectorAll("[data-review-item]").forEach(el => {
      const r = el.getBoundingClientRect();
      const dist = Math.abs(r.left + r.width / 2 - center);
      if (dist < minDist) { minDist = dist; closest = Number(el.dataset.reviewItem); }
    });
    setCenteredIndex(closest);
  }, []);

  useEffect(() => {
    updateCentered();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", updateCentered, { passive: true });
    window.addEventListener("resize", updateCentered);
    return () => { track.removeEventListener("scroll", updateCentered); window.removeEventListener("resize", updateCentered); };
  }, [updateCentered]);

  return (
    <section id="reviews" className="reviews reveal">
      <span className="section-label">{t('reviews_label')}</span>
      <h2 className="section-title">{t('reviews_title')}</h2>
      <div className="section-line"></div>
      <div className="reviews-grid" ref={trackRef}>
        {reviews.map((r, i) => (
          <div className={`review-card ${centeredIndex === i ? "is-centered" : ""}`} key={i} data-review-item={i}>
            <Stars count={r.rating} />
            <p className="review-text">"{r.text}"</p>
            <div className="review-footer">
              <div className="review-avatar">{r.name[0]}</div>
              <div>
                <div className="review-name">{r.name}</div>
                <div className="review-country">{r.country}</div>
              </div>
              <div className="review-date">{r.date}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Reviews;