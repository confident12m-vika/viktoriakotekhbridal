function Story() {
  return (
    <section id="story" className="story reveal">
      <div className="story-container">
        <div className="story-image">
          <img src="/images/logo.jpg" alt="Viktoria Kotekh" />
          <div className="story-badge">
            <strong>15+</strong>
            <span>Years of Mastery</span>
          </div>
        </div>
        <div className="story-text">
  {/* Section label | تسمية القسم */}
  <span className="section-label">Our Story</span>

  {/* Main title | العنوان الرئيسي */}
  <h2 className="section-title">
    Every Woman,<br />Her Own Story
  </h2>

  <div className="section-line left"></div>

  {/* First paragraph - individuality & experience | الفقرة الأولى - التفرد والخبرة */}
  <p>
    Every woman carries her own unique beauty, individuality, and story.
    For more than <strong>15 years</strong>, I have been creating bridal and couture
    garments for women who are looking for something truly personal.
  </p>

  {/* Second paragraph - craft & locations | الفقرة الثانية - الحرفية والمواقع */}
  <p>
    My work combines craftsmanship, attention to detail, and a deep understanding
    of how a garment should reflect the woman who wears it. Working between{" "}
    <strong>Cairo and Madrid</strong>, I create bespoke bridal gowns, bridal
    transformations, and couture alterations for clients in Egypt and Spain.
    Every piece is designed individually, taking into account personal style,
    body shape, and vision.
  </p>

  {/* Third paragraph - philosophy | الفقرة الثالثة - الفلسفة */}
  <p>
    I believe that a wedding dress should not simply follow trends. It should
    celebrate <strong>individuality, confidence, and the unique story</strong> of
    every woman. Because true elegance begins when a woman feels completely herself.
  </p>

  {/* Location flags | أعلام المواقع */}
  <div className="story-flags">
    <span className="flag-tag">🇪🇬 Cairo, Egypt</span>
    <span className="flag-tag">🇪🇸 Madrid, Spain</span>
    <span className="flag-tag">🌍 International</span>
  </div>

  {/* CTA button | زر الدعوة للعمل */}
  <a href="#booking" className="story-btn">Begin Your Journey</a>
</div>
</div>

    </section>
  );
}

export default Story;
