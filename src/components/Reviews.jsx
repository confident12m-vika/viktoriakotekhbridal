const reviews = [
  {
    name: "Sarah M.",
    country: "🇪🇬 Cairo, Egypt",
    rating: 5,
    text: "Viktoria created the most breathtaking gown I've ever seen. Every detail was perfect — she truly understood my vision and brought it to life beyond my dreams.",
    date: "March 2026"
  },
  {
    name: "Isabella R.",
    country: "🇪🇸 Barcelona, Spain",
    rating: 5,
    text: "I flew to Cairo specifically to work with Viktoria. The experience was extraordinary. Her craftsmanship is world-class and the personal attention is unmatched.",
    date: "February 2026"
  },
  {
    name: "Nour A.",
    country: "🇪🇬 Alexandria, Egypt",
    rating: 5,
    text: "The alteration service was flawless. My mother's vintage gown was transformed beautifully while preserving its original character. Highly recommend.",
    date: "January 2026"
  },
  {
    name: "Maria L.",
    country: "🇫🇷 Paris, France",
    rating: 5,
    text: "Working with Viktoria was a dream. She coordinated everything perfectly despite the distance. My gown arrived exactly as envisioned — absolutely stunning.",
    date: "December 2025"
  },
  {
    name: "Layla K.",
    country: "🇦🇪 Dubai, UAE",
    rating: 5,
    text: "The Arabic gown she designed for me was a masterpiece. Traditional yet modern, elegant yet comfortable. Every guest at my wedding asked who the designer was.",
    date: "November 2025"
  },
  {
    name: "Sofia T.",
    country: "🇮🇹 Milan, Italy",
    rating: 5,
    text: "15 years of experience truly shows in every stitch. Viktoria has an extraordinary eye for detail and an exceptional ability to understand exactly what you want.",
    date: "October 2025"
  }
];

function Stars({ count }) {
  return (
    <div className="review-stars">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="reviews reveal">
      <span className="section-label">Testimonials</span>
      <h2 className="section-title">What Our Brides Say</h2>
      <div className="section-line"></div>

      <div className="reviews-grid">
        {reviews.map((r, i) => (
          <div className="review-card" key={i}>
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
