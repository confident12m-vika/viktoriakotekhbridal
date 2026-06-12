import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Booking() {
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
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  if (status === "success") {
    return (
      <section id="booking" className="booking">
        <span className="section-label">Booking</span>
        <h2 className="section-title" style={{color:"white"}}>Thank You</h2>
        <div className="section-line"></div>
        <div className="booking-container" style={{textAlign:"center",paddingTop:"20px"}}>
          <p style={{color:"rgba(255,255,255,0.6)",fontSize:"15px",marginBottom:"30px",lineHeight:"1.8"}}>
            Your request has been received. Viktoria will be in touch with you shortly to begin your journey.
          </p>
          <button className="booking-btn" style={{maxWidth:"260px",margin:"0 auto"}} onClick={() => setStatus("idle")}>
            Send Another Request
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="booking">
      <span className="section-label">Appointments</span>
      <h2 className="section-title" style={{color:"white"}}>begin your bridal journey</h2>
      <div className="section-line"></div>
      <p style={{color:"rgba(255,255,255,0.45)",fontSize:"13px",letterSpacing:"1.5px",marginBottom:"10px"}}>
        Local & international clients welcome · In-person or coordinated abroad
      </p>
      <div className="booking-container">
        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input name="name" placeholder="Full Name *" value={form.name} onChange={handleChange} required />
            <input name="phone" type="tel" placeholder="Phone / WhatsApp *" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} />
            <input name="country" placeholder="Your Country" value={form.country} onChange={handleChange} />
          </div>
          <select name="service" value={form.service} onChange={handleChange} required>
            <option value="">Select Service *</option>
            <option value="Custom Bridal Design">Custom Bridal Design</option>
            <option value="Evening & Occasion Wear">Evening & Occasion Wear</option>
            <option value="Expert Alterations">Expert Alterations</option>
            <option value="Style Consultation">Style Consultation</option>
            <option value="Arabic & Oriental Gowns">Arabic & Oriental Gowns</option>
            <option value="International Fitting">International Fitting (Spain/Europe)</option>
          </select>
          <textarea name="message" placeholder="Tell us about your dream gown, your event date, and any special requests..." value={form.message} onChange={handleChange} required />
          <label className="file-label">
            <i className="fa-solid fa-image"></i>
            <span>{form.image ? form.image.name : "Upload Reference Image (optional)"}</span>
            <input type="file" name="image" accept="image/*" onChange={handleChange} hidden />
          </label>
          {status === "error" && <p style={{color:"#e74c3c",fontSize:"12px",letterSpacing:"1px"}}>Something went wrong. Please try again.</p>}
          <button type="submit" className="booking-btn" disabled={status === "loading"}>
            {status === "loading" ? "Sending..." : "Send Your Request"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Booking;
