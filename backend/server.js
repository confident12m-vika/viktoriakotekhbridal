require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();

app.use(cors());
app.use(express.json());

// ── Cloudinary ─────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── MongoDB ────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

setInterval(async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping();
    } else {
      mongoose.connect(process.env.MONGO_URI).catch(e => console.error('Reconnect failed:', e.message));
    }
  } catch (err) { console.error('Keep-alive error:', err.message); }
}, 4 * 60 * 1000);

mongoose.connection.on('disconnected', () => {
  setTimeout(() => mongoose.connect(process.env.MONGO_URI).catch(e => console.error(e.message)), 5000);
});
mongoose.connection.on('error', err => console.error('MongoDB error:', err.message));

// ── Models ─────────────────────────────────────────────────
const clientSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  phone:   { type: String, required: true },
  email:   { type: String, default: '' },
  country: { type: String, default: '' },
  service: { type: String, default: '' },
  message: { type: String, required: true },
  image:   { type: String, default: null },
}, { timestamps: true });
const Client = mongoose.model('Client', clientSchema);

const gallerySchema = new mongoose.Schema({
  url:      { type: String, required: true },
  caption:  { type: String, default: '' },
  category: { type: String, default: 'Couture' },
}, { timestamps: true });
const Gallery = mongoose.model('Gallery', gallerySchema);


// ── Blog Model ─────────────────────────────────────────────
const blogSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  subtitle:  { type: String, default: '' },
  category:  { type: String, default: 'Style' },
  content:   { type: String, required: true },
  excerpt:   { type: String, default: '' },
  image:     { type: String, default: '' },
  published: { type: Boolean, default: true },
}, { timestamps: true });
const Blog = mongoose.model('Blog', blogSchema);




// ── Collection Model ───────────────────────────────────────
const collectionSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  subtitle:    { type: String, default: '' },
  description: { type: String, default: '' },
  tag:         { type: String, default: '' },
  badge:       { type: String, default: 'COUTURE' },
  image:       { type: String, default: '' },
  accent:      { type: String, default: '#b8956a' },
  bg:          { type: String, default: '#0e0b07' },
  published:   { type: Boolean, default: true },
}, { timestamps: true });
const Collection = mongoose.model('Collection', collectionSchema);

// ── Newsletter Model ───────────────────────────────────────
const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });
const Newsletter = mongoose.model('Newsletter', newsletterSchema);

// ── Store Product Model ────────────────────────────────────
const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: String, required: true, enum: ['bridal','evening','alterations','transformation'] },
  description: { type: String, default: '' },
  price:       { type: String, default: '' },
  material:    { type: String, default: '' },
  delivery:    { type: String, default: '' },
  image:       { type: String, default: '' },
  published:   { type: Boolean, default: true },
}, { timestamps: true });
const Product = mongoose.model('Product', productSchema);

// ── Service Image Model ────────────────────────────────────
// كل خدمة ليها رقم ثابت (1-6) وصورة قابلة للتغيير من الأدمن
const serviceImageSchema = new mongoose.Schema({
  serviceIndex: { type: Number, required: true, unique: true }, // 1 → 6
  imageUrl:     { type: String, required: true },
}, { timestamps: true });
const ServiceImage = mongoose.model('ServiceImage', serviceImageSchema);

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const Admin = mongoose.model('Admin', adminSchema);

// ── Seed Admin ─────────────────────────────────────────────
async function seedAdmin() {
  try {
    const exists = await Admin.findOne({ username: 'Viktoriyaadmin' });
    if (!exists) {
      const hashed = await bcrypt.hash('Sara2001', 10);
      await Admin.create({ username: 'Viktoriyaadmin', password: hashed });
    }
  } catch (err) { console.error('Seed admin error:', err.message); }
}
mongoose.connection.once('open', () => { seedAdmin(); });

// ── Cloudinary Storage ─────────────────────────────────────
const clientStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'viktoria-kotekh/clients', allowed_formats: ['jpg','jpeg','png','webp'], transformation: [{ width: 1200, crop: 'limit' }] },
});

const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'viktoria-kotekh/gallery', allowed_formats: ['jpg','jpeg','png','webp'], transformation: [{ width: 1600, crop: 'limit' }] },
});

const serviceStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'viktoria-kotekh/services', allowed_formats: ['jpg','jpeg','png','webp'], transformation: [{ width: 1200, crop: 'limit' }] },
});

const uploadClient  = multer({ storage: clientStorage,  limits: { fileSize: 8 * 1024 * 1024 } });
const uploadGallery = multer({ storage: galleryStorage, limits: { fileSize: 8 * 1024 * 1024 } });

const blogStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'viktoria-kotekh/blog', allowed_formats: ['jpg','jpeg','png','webp'], transformation: [{ width: 1400, crop: 'limit' }] },
});


const collectionStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'viktoria-kotekh/collections', allowed_formats: ['jpg','jpeg','png','webp'], transformation: [{ width: 1400, crop: 'limit' }] },
});
const uploadCollection = multer({ storage: collectionStorage, limits: { fileSize: 10 * 1024 * 1024 } });

const productStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'viktoria-kotekh/store-products', allowed_formats: ['jpg','jpeg','png','webp'], transformation: [{ width: 1400, crop: 'limit' }] },
});
const uploadProduct = multer({ storage: productStorage, limits: { fileSize: 10 * 1024 * 1024 } });

const uploadBlog = multer({ storage: blogStorage, limits: { fileSize: 8 * 1024 * 1024 } });

const uploadService = multer({ storage: serviceStorage, limits: { fileSize: 8 * 1024 * 1024 } });

// ── Auth ───────────────────────────────────────────────────
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try { req.admin = jwt.verify(token, process.env.JWT_SECRET || 'supersecret'); next(); }
  catch { res.status(401).json({ message: 'Invalid token' }); }
}

// ── Health ─────────────────────────────────────────────────
app.get('/', (_, res) => res.json({ status: 'ok', mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', time: new Date().toISOString() }));
app.get('/health', (_, res) => res.json({ status: 'ok', mongo: mongoose.connection.readyState === 1 }));



// ── reCAPTCHA v3 Verification ──────────────────────────────
async function verifyRecaptcha(token) {
  if (!token) return false;
  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET}&response=${token}`,
    });
    const data = await res.json();
    // score >= 0.5 يعني إنسان حقيقي (0 = bot, 1 = human)
    return data.success && data.score >= 0.5;
  } catch {
    return false;
  }
}

// ── Email Notification (Resend) ────────────────────────────
async function sendEmailNotification(client) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Viktoria Kotekh <notifications@viktoriakotekhbridal.com>',
        to: [process.env.NOTIFICATION_EMAIL || 'mrzq2405@gmail.com'],
        subject: `🌹 New Booking Request — ${client.name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#0a0a0a;color:white;">
            <h2 style="color:#c9a84c;letter-spacing:2px;">NEW BOOKING REQUEST</h2>
            <hr style="border-color:rgba(201,168,76,0.3);margin:16px 0;">
            <p><strong style="color:#c9a84c;">Name:</strong> ${client.name}</p>
            <p><strong style="color:#c9a84c;">Phone:</strong> ${client.phone}</p>
            ${client.email ? `<p><strong style="color:#c9a84c;">Email:</strong> ${client.email}</p>` : ''}
            ${client.country ? `<p><strong style="color:#c9a84c;">Country:</strong> ${client.country}</p>` : ''}
            ${client.service ? `<p><strong style="color:#c9a84c;">Service:</strong> ${client.service}</p>` : ''}
            <div style="margin:20px 0;padding:16px;background:#111;border-left:3px solid #c9a84c;">
              <p style="color:#ccc;font-style:italic;">"${client.message}"</p>
            </div>
            ${client.image ? `<p><a href="${client.image}" style="color:#c9a84c;">View attached image →</a></p>` : ''}
            <hr style="border-color:rgba(201,168,76,0.3);margin:16px 0;">
            <p style="font-size:12px;color:#555;">Sent from viktoriakotekhbridal.com admin system</p>
          </div>
        `,
      }),
    });
    if (!res.ok) console.error('Resend error:', await res.text());
    else console.log('Email notification sent for:', client.name);
  } catch (err) {
    console.error('Email notification failed:', err.message);
  }
}

// ── PUBLIC ROUTES ──────────────────────────────────────────

app.post('/api/clients', uploadClient.single('image'), async (req, res) => {
  try {
    const { name, phone, email, country, service, message, recaptchaToken, website_url } = req.body;
    // Honeypot — لو اتملا يبقى Bot
    if (website_url) return res.status(200).json({ success: true }); // نرد بـ 200 عشان الـ Bot ميعرفش إننا شيلناه
    if (!name || !phone || !message) return res.status(400).json({ message: 'Name, phone and message are required' });
    // التحقق من reCAPTCHA
    // reCAPTCHA — logging only, no blocking
    if (recaptchaToken) {
      verifyRecaptcha(recaptchaToken).then(ok =>
        console.log("[recaptcha booking]", ok ? "✅ human" : "⚠️ suspicious")
      ).catch(() => {});
    }
    const client = await Client.create({ name, phone, email: email||'', country: country||'', service: service||'', message, image: req.file ? req.file.path : null });
    sendEmailNotification(client).catch(()=>{});
    res.status(201).json({ success: true, client });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/gallery', async (_, res) => {
  try { const images = await Gallery.find().sort({ createdAt: -1 }); res.json(images); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

// جلب صور الخدمات (public — يستخدمها الـ frontend)
app.get('/api/services/images', async (_, res) => {
  try {
    const images = await ServiceImage.find().sort({ serviceIndex: 1 });
    res.json(images);
  } catch (err) { res.status(500).json({ message: err.message }); }
});


// جلب مقالات البلوج (public)
app.get('/api/blog', async (req, res) => {
  try {
    const posts = await Blog.find({ published: true }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/blog/:id', async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
});





// ── COLLECTION PUBLIC ROUTES ───────────────────────────────
app.get('/api/collections', async (_, res) => {
  try {
    const cols = await Collection.find({ published: true }).sort({ createdAt: -1 });
    res.json(cols);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Contact Form ───────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message, recaptchaToken, website_url } = req.body;
    if (website_url) return res.status(200).json({ success: true });
    if (!name || !email || !message) return res.status(400).json({ message: 'All fields required' });
    // reCAPTCHA — logging only, no blocking
    if (recaptchaToken) {
      verifyRecaptcha(recaptchaToken).then(ok =>
        console.log("[recaptcha contact]", ok ? "✅ human" : "⚠️ suspicious")
      ).catch(() => {});
    }

    // إرسال إيميل إشعار
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Viktoria Kotekh <info@viktoriakotekhbridal.com>',
        to: [process.env.NOTIFICATION_EMAIL || 'mrzq2405@gmail.com'],
        reply_to: email,
        subject: `💌 New Contact Message — ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#0a0a0a;color:white;">
            <h2 style="color:#c9a84c;letter-spacing:2px;">NEW CONTACT MESSAGE</h2>
            <hr style="border-color:rgba(201,168,76,0.3);margin:16px 0;">
            <p><strong style="color:#c9a84c;">Name:</strong> ${name}</p>
            <p><strong style="color:#c9a84c;">Email:</strong> <a href="mailto:${email}" style="color:#c9a84c;">${email}</a></p>
            <div style="margin:20px 0;padding:16px;background:#111;border-left:3px solid #c9a84c;">
              <p style="color:#ccc;font-style:italic;white-space:pre-wrap;">"${message}"</p>
            </div>
            <p style="font-size:12px;color:#555;">You can reply directly to this email to respond to ${name}.</p>
            <hr style="border-color:rgba(201,168,76,0.3);margin:16px 0;">
            <p style="font-size:11px;color:#444;">Sent from viktoriakotekhbridal.com contact form</p>
          </div>
        `,
      }),
    });

    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── NEWSLETTER ROUTES ─────────────────────────────────────
// اشتراك
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        await existing.save();
        return res.json({ success: true, message: 'Resubscribed' });
      }
      return res.status(400).json({ message: 'Already subscribed' });
    }
    await Newsletter.create({ email });
    res.status(201).json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// إلغاء اشتراك (unsubscribe link في الإيميل)
app.get('/api/newsletter/unsubscribe', async (req, res) => {
  try {
    const { email } = req.query;
    if (email) await Newsletter.findOneAndUpdate({ email }, { active: false });
    res.send('<html><body style="font-family:sans-serif;text-align:center;padding:60px"><h2>Unsubscribed</h2><p>You have been removed from our mailing list.</p></body></html>');
  } catch { res.send('Error'); }
});

// ── STORE PUBLIC ROUTES ────────────────────────────────────
app.get('/api/store/products', async (req, res) => {
  try {
    const { category, limit } = req.query;
    const filter = { published: true };
    if (category) filter.category = category;
    const products = await Product.find(filter).sort({ createdAt: -1 }).limit(Number(limit) || 100);
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/store/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});




// Admin collections
app.get('/api/admin/collections', auth, async (_, res) => {
  try { const cols = await Collection.find().sort({ createdAt: -1 }); res.json(cols); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/admin/collections', auth, uploadCollection.single('image'), async (req, res) => {
  try {
    const { title, subtitle, description, tag, badge, accent, bg, published } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });
    const col = await Collection.create({
      title, subtitle: subtitle||'', description: description||'',
      tag: tag||'', badge: badge||'COUTURE', accent: accent||'#b8956a', bg: bg||'#0e0b07',
      image: req.file ? req.file.path : '',
      published: published !== 'false',
    });
    res.status(201).json({ success: true, col });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/admin/collections/:id', auth, uploadCollection.single('image'), async (req, res) => {
  try {
    const update = { ...req.body, published: req.body.published !== 'false' };
    if (req.file) update.image = req.file.path;
    const col = await Collection.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!col) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true, col });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/admin/collections/:id', auth, async (req, res) => {
  try { await Collection.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

// Newsletter admin
app.get('/api/admin/newsletter/subscribers', auth, async (req, res) => {
  try {
    const subs = await Newsletter.find({ active: true }).sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/admin/newsletter/send', auth, async (req, res) => {
  try {
    const { subject, html } = req.body;
    if (!subject || !html) return res.status(400).json({ message: 'Subject and content required' });
    const subscribers = await Newsletter.find({ active: true });
    if (!subscribers.length) return res.status(400).json({ message: 'No subscribers' });

    const BATCH = 10;
    let sent = 0;
    for (let i = 0; i < subscribers.length; i += BATCH) {
      const batch = subscribers.slice(i, i + BATCH);
      await Promise.all(batch.map(sub =>
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` },
          body: JSON.stringify({
            from: 'Viktoria Kotekh <newsletter@viktoriakotekhbridal.com>',
            to: [sub.email],
            subject,
            html: html + `<br><br><p style="font-size:11px;color:#999;text-align:center"><a href="${process.env.FRONTEND_URL || 'https://www.viktoriakotekhbridal.com'}/api/newsletter/unsubscribe?email=${encodeURIComponent(sub.email)}" style="color:#999">Unsubscribe</a></p>`,
          }),
        })
      ));
      sent += batch.length;
    }
    res.json({ success: true, sent });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/admin/newsletter/:id', auth, async (req, res) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});


// رد على طلب عميل بالإيميل
app.post('/api/admin/clients/:id/reply', auth, async (req, res) => {
  try {
    const { subject, message } = req.body;
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    if (!client.email) return res.status(400).json({ message: 'Client has no email' });

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from: 'Viktoria Kotekh <info@viktoriakotekhbridal.com>',
        to: [client.email],
        subject: subject || `Re: Your inquiry — Viktoria Kotekh`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#faf8f4;">
            <img src="https://www.viktoriakotekhbridal.com/images/logo.jpg" style="width:80px;margin-bottom:20px;" />
            <h2 style="font-family:Georgia,serif;color:#c9a84c;font-weight:300;">Dear ${client.name},</h2>
            <div style="font-size:15px;line-height:1.8;color:#333;margin:20px 0;white-space:pre-wrap;">${message}</div>
            <hr style="border-color:rgba(201,168,76,0.3);margin:24px 0;">
            <p style="font-size:12px;color:#999;">Viktoria Kotekh Bridal · Cairo & Madrid<br>+20 155 883 1957 · info@viktoriakotekhbridal.com</p>
          </div>
        `,
      }),
    });
    if (!emailRes.ok) throw new Error('Email send failed');
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── STORE ADMIN ROUTES ─────────────────────────────────────
app.get('/api/admin/store/products', auth, async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/admin/store/products', auth, uploadProduct.single('image'), async (req, res) => {
  try {
    const { name, category, description, price, material, delivery, published } = req.body;
    if (!name || !category) return res.status(400).json({ message: 'Name and category required' });
    const product = await Product.create({
      name, category, description: description||'', price: price||'',
      material: material||'', delivery: delivery||'',
      image: req.file ? req.file.path : '',
      published: published !== 'false',
    });
    res.status(201).json({ success: true, product });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/admin/store/products/:id', auth, uploadProduct.single('image'), async (req, res) => {
  try {
    const { name, category, description, price, material, delivery, published } = req.body;
    const update = { name, category, description, price, material, delivery, published: published !== 'false' };
    if (req.file) update.image = req.file.path;
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true, product });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/admin/store/products/:id', auth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── ADMIN ROUTES ───────────────────────────────────────────

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '8h' });
    res.json({ token });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/admin/clients', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, service, search } = req.query;
    const filter = {};
    if (service) filter.service = service;
    if (search) filter.$or = [{ name: new RegExp(search,'i') }, { phone: new RegExp(search,'i') }, { country: new RegExp(search,'i') }];
    const total = await Client.countDocuments(filter);
    const clients = await Client.find(filter).sort({ createdAt: -1 }).skip((page-1)*limit).limit(Number(limit));
    res.json({ clients, total, page: Number(page), pages: Math.ceil(total/limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/admin/clients/:id', auth, async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/admin/gallery', auth, uploadGallery.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image' });
    const img = await Gallery.create({ url: req.file.path, caption: req.body.caption || '', category: req.body.category || 'Couture' });
    res.status(201).json({ success: true, img });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/admin/gallery/:id', auth, async (req, res) => {
  try {
    const img = await Gallery.findByIdAndDelete(req.params.id);
    if (!img) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/admin/gallery', auth, async (_, res) => {
  try { const images = await Gallery.find().sort({ createdAt: -1 }); res.json(images); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

// رفع/تحديث صورة خدمة معينة (serviceIndex: 1-6)
app.post('/api/admin/services/:index', auth, uploadService.single('image'), async (req, res) => {
  try {
    const serviceIndex = Number(req.params.index);
    if (serviceIndex < 1 || serviceIndex > 6) return res.status(400).json({ message: 'Index must be 1-6' });
    if (!req.file) return res.status(400).json({ message: 'No image' });
    const updated = await ServiceImage.findOneAndUpdate(
      { serviceIndex },
      { imageUrl: req.file.path },
      { upsert: true, new: true }
    );
    res.json({ success: true, image: updated });
  } catch (err) { res.status(500).json({ message: err.message }); }
});


// إدارة البلوج من الأدمن
app.get('/api/admin/blog', auth, async (_, res) => {
  try { const posts = await Blog.find().sort({ createdAt: -1 }); res.json(posts); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/admin/blog', auth, uploadBlog.single('image'), async (req, res) => {
  try {
    const { title, subtitle, category, content, excerpt, published } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content required' });
    const post = await Blog.create({
      title, subtitle: subtitle||'', category: category||'Style',
      content, excerpt: excerpt||content.slice(0,200),
      image: req.file ? req.file.path : '',
      published: published !== 'false',
    });
    res.status(201).json({ success: true, post });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/admin/blog/:id', auth, uploadBlog.single('image'), async (req, res) => {
  try {
    const { title, subtitle, category, content, excerpt, published } = req.body;
    const update = { title, subtitle, category, content, excerpt, published: published !== 'false' };
    if (req.file) update.image = req.file.path;
    const post = await Blog.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true, post });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/admin/blog/:id', auth, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// جلب صور الخدمات من الأدمن
app.get('/api/admin/services', auth, async (_, res) => {
  try { const images = await ServiceImage.find().sort({ serviceIndex: 1 }); res.json(images); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log('🚀 Server running on port ' + PORT));