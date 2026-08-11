import { useState } from "react";
import { useTranslation } from "../i18n/useTranslation";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Booking() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name:"", phone:"", email:"", service:"", country:"", message:"", image:null });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v) data.append(k, v); });
    try {
      const res = await fetch(`${API}/api/clients`, { method:"POST", body:data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setStatus("success");
      setForm({ name:"", phone:"", email:"", service:"", country:"", message:"", image:null });
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const servicesList = t('booking_services');

  if (status === "success") {
    return (
      <section id="booking" className="booking">
        <span className="section-label">{t('booking_label')}</span>
        <h2 className="section-title" style={{color:"white"}}>{t('booking_success_title')}</h2>
        <div className="section-line"></div>
        <div className="booking-container" style={{textAlign:"center",paddingTop:"20px"}}>
          <p style={{color:"rgba(255,255,255,0.6)",fontSize:"15px",marginBottom:"30px",lineHeight:"1.8"}}>
            {t('booking_success_msg')}
          </p>
          <button className="booking-btn" style={{maxWidth:"260px",margin:"0 auto"}} onClick={() => setStatus("idle")}>
            {t('booking_another')}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="booking">
      <span className="section-label">{t('booking_label')}</span>
      <h2 className="section-title" style={{color:"white"}}>{t('booking_title')}</h2>
      <div className="section-line"></div>
      <p style={{color:"rgba(255,255,255,0.45)",fontSize:"13px",letterSpacing:"1.5px",marginBottom:"10px"}}>
        {t('booking_subtitle')}
      </p>
      <div className="booking-container">
        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input name="name" placeholder={t('booking_name')} value={form.name} onChange={handleChange} required />
            <input name="phone" type="tel" placeholder={t('booking_phone')} value={form.phone} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <input name="email" type="email" placeholder={t('booking_email')} value={form.email} onChange={handleChange} />
            <input name="country" placeholder={t('booking_country')} value={form.country} onChange={handleChange} />
          </div>
          <select name="service" value={form.service} onChange={handleChange} required>
            <option value="">{t('booking_service_placeholder')}</option>
            {Array.isArray(servicesList) && servicesList.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>
          <textarea name="message" placeholder={t('booking_message')} value={form.message} onChange={handleChange} required />
          <label className="file-label">
            <i className="fa-solid fa-image"></i>
            <span>{form.image ? form.image.name : t('booking_image')}</span>
            <input type="file" name="image" accept="image/*" onChange={handleChange} hidden />
          </label>
          <button type="submit" className="booking-btn" disabled={status === "loading"}>
            {status === "loading" ? t('booking_sending') : t('booking_submit')}
          </button>
          {status === "error" && (
            <p style={{color:"#e74c3c",textAlign:"center",fontSize:"13px"}}>Something went wrong. Please try again.</p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Booking;