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
    const { name, phone, email, country, service, message } = req.body;
    if (!name || !phone || !message) return res.status(400).json({ message: 'Name, phone and message are required' });
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