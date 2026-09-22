import { useState } from "react";
import { useTranslation } from "../i18n/useTranslation.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";


function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name:"", email:"", message:"" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name:"", email:"", message:"" });
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section id="contact" className="contact reveal">
      <div className="contact-container">
        <div className="contact-info">
          <span className="section-label">{t('contact_label')}</span>
          <h2 className="section-title">{t('contact_title')}</h2>
          <div className="section-line left"></div>
          <p>{t('contact_desc')}</p>
          <div className="contact-item">
            <div className="contact-icon"><i className="fa-solid fa-phone"></i></div>
            <div><h4>{t('contact_phone')}</h4><p>+20 155 883 1957</p></div>
          </div>
          <div className="contact-item">
            <div className="contact-icon"><i className="fa-solid fa-envelope"></i></div>
            <div><h4>{t('contact_email')}</h4><p>info@viktoriakotekhbridal.com</p></div>
          </div>
          <div className="contact-item">
            <div className="contact-icon"><i className="fa-solid fa-location-dot"></i></div>
            <div><h4>{t('contact_location')}</h4><p>Cairo, Egypt · Madrid, Spain</p></div>
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

          {status === "success" ? (
            <div style={{textAlign:"center",padding:"40px 0"}}>
              <p style={{color:"#c9a84c",fontSize:"22px",fontFamily:"'Cormorant Garamond',serif",marginBottom:"10px"}}>✓ Message Sent</p>
              <p style={{color:"rgba(0,0,0,0.5)",fontSize:"13px"}}>Thank you! We'll get back to you soon.</p>
              <button
                onClick={() => setStatus("idle")}
                style={{marginTop:"20px",padding:"10px 24px",background:"transparent",border:"1px solid rgba(201,168,76,0.4)",color:"#c9a84c",cursor:"pointer",fontFamily:"'Jost',sans-serif",fontSize:"11px",letterSpacing:"2px"}}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                placeholder={t('contact_form_name') + ' *'}
                value={form.name}
                onChange={e => setForm(f=>({...f,name:e.target.value}))}
                required
              />
              <input
                type="email"
                placeholder={t('contact_form_email') + ' *'}
                value={form.email}
                onChange={e => setForm(f=>({...f,email:e.target.value}))}
                required
              />
              <textarea
                placeholder={t('contact_form_msg')}
                value={form.message}
                onChange={e => setForm(f=>({...f,message:e.target.value}))}
                required
              />
              {status === "error" && (
                <p style={{color:"#e74c3c",fontSize:"12px",marginBottom:"10px"}}>Something went wrong. Please try again.</p>
              )}
              <button type="submit" className="contact-btn" disabled={status === "loading"}>
                {status === "loading" ? "Sending..." : t('contact_form_btn')}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default Contact;