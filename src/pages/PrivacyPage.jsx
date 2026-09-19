import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPage() {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ minHeight:'100vh', background:'var(--off-white,#faf8f4)', paddingTop:'100px', paddingBottom:'80px' }}>
      <div style={{ maxWidth:'780px', margin:'0 auto', padding:'0 30px' }}>

        <button
          onClick={() => navigate(-1)}
          style={{ background:'none', border:'none', color:'#777', cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', marginBottom:'40px', display:'flex', alignItems:'center', gap:'8px' }}
        >
          ← Back
        </button>

        <span style={{ fontSize:'9px', letterSpacing:'5px', color:'#c9a84c', textTransform:'uppercase', display:'block', marginBottom:'14px' }}>
          Legal
        </span>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(28px,4vw,42px)', fontWeight:300, color:'#0a0a0a', marginBottom:'10px' }}>
          Privacy Policy
        </h1>
        <p style={{ color:'#999', fontSize:'12px', letterSpacing:'1px', marginBottom:'40px' }}>
          Last updated: September 2026
        </p>
        <div style={{ width:'50px', height:'1px', background:'#c9a84c', marginBottom:'50px' }}></div>

        {[
          {
            title: '1. Who We Are',
            text: `Viktoria Kotekh Bridal is a luxury bridal couture atelier operating between Cairo, Egypt and Madrid, Spain. We design and create bespoke bridal gowns, evening wear and offer expert alteration services to clients worldwide.\n\nWebsite: www.viktoriakotekhbridal.com\nEmail: info@viktoriakotekhbridal.com\nPhone: +20 155 883 1957`,
          },
          {
            title: '2. Information We Collect',
            text: `We collect information you provide directly to us, including:\n\n• Name, phone number and email address when you submit a booking or contact request\n• Reference images you choose to upload\n• Your country and service preferences\n• Email address when you subscribe to our newsletter\n\nWe do not collect payment information directly — all payments are handled through secure third-party processors.`,
          },
          {
            title: '3. How We Use Your Information',
            text: `We use the information we collect to:\n\n• Respond to your booking inquiries and provide our services\n• Send you updates about your order or fitting appointments\n• Send newsletters and promotional emails (only if you subscribed)\n• Improve our website and services\n• Comply with legal obligations`,
          },
          {
            title: '4. Cookies & Tracking',
            text: `Our website uses cookies to enhance your experience. Cookies are small text files stored on your device.\n\nEssential cookies: Required for the website to function properly (language preferences, session data). These cannot be disabled.\n\nAnalytics cookies: Help us understand how visitors interact with our website (Google Analytics). These are only set with your consent.\n\nMarketing cookies: Used to show relevant content. Only set with your explicit consent.\n\nYou can manage your cookie preferences at any time using the cookie banner or your browser settings.`,
          },
          {
            title: '5. Data Sharing',
            text: `We do not sell your personal data. We may share your information with:\n\n• Resend (email delivery service) — to send booking confirmations and newsletters\n• Cloudinary (image storage) — to store uploaded reference images securely\n• MongoDB Atlas (database) — to store booking requests\n• Vercel & Render (hosting) — to operate our website\n\nAll third-party providers are GDPR-compliant and process data only as instructed by us.`,
          },
          {
            title: '6. Data Retention',
            text: `We retain your personal data for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. Booking requests are kept for up to 3 years. Newsletter subscriptions are kept until you unsubscribe.`,
          },
          {
            title: '7. Your Rights',
            text: `Depending on your location, you may have the following rights:\n\n• Access: Request a copy of your personal data\n• Correction: Request correction of inaccurate data\n• Deletion: Request deletion of your data ("right to be forgotten")\n• Objection: Object to processing of your data\n• Portability: Request transfer of your data\n• Unsubscribe: Opt out of newsletter emails at any time\n\nTo exercise any of these rights, contact us at: info@viktoriakotekhbridal.com`,
          },
          {
            title: '8. Security',
            text: `We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure or destruction. All data is transmitted over encrypted HTTPS connections.`,
          },
          {
            title: '9. International Transfers',
            text: `Your data may be processed in countries outside your own, including the United States and Ireland (EU), where our service providers operate. All transfers are protected by appropriate safeguards in compliance with applicable data protection laws.`,
          },
          {
            title: '10. Contact Us',
            text: `If you have any questions about this Privacy Policy or how we handle your data, please contact us:\n\nViktoria Kotekh Bridal\nEmail: info@viktoriakotekhbridal.com\nPhone: +20 155 883 1957\nCairo, Egypt · Madrid, Spain`,
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom:'36px' }}>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'22px', fontWeight:400, color:'#0a0a0a', marginBottom:'14px' }}>
              {section.title}
            </h2>
            <p style={{ fontSize:'14px', lineHeight:'1.9', color:'#555', fontWeight:300, whiteSpace:'pre-line' }}>
              {section.text}
            </p>
          </div>
        ))}

        <div style={{ marginTop:'60px', padding:'24px', background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.2)' }}>
          <p style={{ fontSize:'13px', color:'#777', lineHeight:'1.7' }}>
            This privacy policy was last updated in September 2026. We may update this policy from time to time. Continued use of our website after changes constitutes acceptance of the updated policy.
          </p>
        </div>

      </div>
    </div>
  );
}
