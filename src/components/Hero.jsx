function Hero() {
  return (
    <header className="hero">
      <img src="/images/myimg.jpg" className="hero-img" alt="Viktoria Kotekh Couture" />
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <span className="hero-tag">Est. in Madrid · Now in Cairo</span>
        <h1 className="hero-title">
          Where <em>Elegance</em><br />Becomes Your Story
        </h1>
        <p className="hero-description">Bespoke Couture · Bridal & Evening · International Clientele</p>
        <div className="hero-btns">
          <a href="#booking" className="btn-gold">start your project</a>
          <a href="#Viewcollection" className="btn-outline">view collection</a>
        </div>
      </div>
      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </header>
  );
}

export default Hero;
