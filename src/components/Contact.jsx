import { useState } from "react";

function Contact() {
  const [form, setForm] = useState({ name:"", email:"", message:"" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name:"", email:"", message:"" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="contact reveal">
      <div className="contact-container">
        <div className="contact-info">
          <span className="section-label">Get in Touch</span>
          <h2 className="section-title">Let's Start<br />a Conversation</h2>
          <div className="section-line left"></div>
          <p>
            Whether you're dreaming of a wedding gown, need expert alterations,
            or simply want to explore what's possible — Viktoria is here to listen.
            Every great creation begins with a single conversation.
          </p>
          <div className="contact-item">
            <div className="contact-icon"><i className="fa-solid fa-phone"></i></div>
            <div>
              <h4>Phone & WhatsApp</h4>
              <p>+20 155 883 1957</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon"><i className="fa-solid fa-envelope"></i></div>
            <div>
              <h4>Email</h4>
              <p>viktoriakotekhbridal@gmail.com</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon"><i className="fa-solid fa-location-dot"></i></div>
            <div>
              <h4>Location</h4>
              <p>Cairo, Egypt · Madrid, Spain</p>
            </div>
          </div>
          <div className="contact-social">
            <a href="#" className="social-link" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="social-link" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="social-link" aria-label="TikTok"><i className="fa-brands fa-tiktok"></i></a>
            <a href="#" className="social-link" aria-label="Twitter"><i className="fa-brands fa-x-twitter"></i></a>
          </div>
        </div>

        <div className="contact-form">
          <span className="section-label" style={{marginBottom:"24px",display:"block"}}>Quick Message</span>
          {sent ? (
            <p style={{color:"#c9a84c",fontSize:"14px",lineHeight:"1.8",padding:"20px 0"}}>
              ✓ Message received. We'll be in touch soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <input placeholder="Your Name *" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} required />
              <input type="email" placeholder="Email Address *" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} required />
              <textarea placeholder="Your message..." value={form.message} onChange={e => setForm(f=>({...f,message:e.target.value}))} required />
              <button type="submit" className="contact-btn">Send Message</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default Contact;
