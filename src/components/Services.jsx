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
  return (
    <section id="services" className="services reveal">
      <span className="section-label">What We Offer</span>
      <h2 className="section-title">Our Services</h2>
      <div className="section-line"></div>
      <div className="services-container">
        {services.map((s, i) => (
          <div className="service-card" key={i}>
            <img src={s.img} alt={s.title} loading="lazy" />
            <div className="service-overlay">
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
            <span className="service-num">{s.num}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;
