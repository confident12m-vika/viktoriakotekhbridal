import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from "react";
import { LangProvider } from './i18n/LangContext.jsx';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Story from "./components/Story";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import Reviews from "./components/Reviews";
import Booking from "./components/Booking";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminPage from './pages/AdminPage';
import GalleryPage from './pages/GalleryPage';
import BlogPage from './pages/BlogPage';
import ArticlePage from './pages/ArticlePage';
import './App.css';

// ── SEO Helper — يغير title و description حسب الصفحة ──
function SEO({ title, description }) {
  useEffect(() => {
    if (title) document.title = title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc && description) desc.setAttribute('content', description);
    // canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', window.location.origin + window.location.pathname);
  }, [title, description]);
  return null;
}

// ── Scroll to top on route change ──
function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Home() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("active"); }); },
      { threshold: 0.1 }
    );
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SEO
        title="Viktoria Kotekh — Bespoke Bridal Couture | Cairo & Madrid"
        description="Luxury bespoke bridal gowns, evening wear and expert alterations by Viktoria Kotekh. Serving brides in Cairo, Egypt and Madrid, Spain with 15+ years of couture craftsmanship."
      />
      <Navbar />
      <Hero />
      <Story />
      <Services />
      <Gallery />
      <Reviews />
      <Booking />
      <Contact />
      <Footer />
      <a href="https://wa.me/201558831957" className="whatsapp-btn"
        target="_blank" rel="noreferrer" aria-label="WhatsApp">
        <i className="fa-brands fa-whatsapp"></i>
      </a>
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <ScrollTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={
            <>
              <SEO
                title="Bridal Gallery — Viktoria Kotekh Couture"
                description="Explore Viktoria Kotekh's portfolio of bespoke bridal gowns, evening wear and couture creations. Handcrafted in Cairo and Madrid."
              />
              <GalleryPage />
            </>
          } />
          <Route path="/blog" element={
            <>
              <SEO
                title="Bridal Journal — Viktoria Kotekh"
                description="Stories, tips and inspiration from Viktoria Kotekh's atelier. Bridal fashion, style advice and behind-the-scenes from Cairo and Madrid."
              />
              <BlogPage />
            </>
          } />
          <Route path="/blog/:id" element={<ArticlePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </LangProvider>
  );
}
