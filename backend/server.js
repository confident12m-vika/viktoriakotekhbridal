require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// ── CORS مفتوح
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── MongoDB Connection ─────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ── KEEP-ALIVE: يحافظ على الاتصال شغال دايماً ─────────────
// بيبعت ping لقاعدة البيانات كل 4 دقائق عشان متنامش
setInterval(async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping();
      console.log('🔄 Keep-alive ping sent to MongoDB —', new Date().toLocaleTimeString());
    } else {
      console.log('⚠️ MongoDB not connected, attempting reconnect...');
      mongoose.connect(process.env.MONGO_URI).catch(e => console.error('Reconnect failed:', e.message));
    }
  } catch (err) {
    console.error('Keep-alive error:', err.message);
  }
}, 4 * 60 * 1000); // كل 4 دقائق

// ── إعادة اتصال تلقائي عند الانقطاع ────────────────────────
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected. Reconnecting...');
  setTimeout(() => {
    mongoose.connect(process.env.MONGO_URI).catch(e => console.error('Reconnect failed:', e.message));
  }, 5000);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

// ── Models ──────────────────────────────────────────────────
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
  url:     { type: String, required: true },
  caption: { type: String, default: '' },
}, { timestamps: true });
const Gallery = mongoose.model('Gallery', gallerySchema);

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const Admin = mongoose.model('Admin', adminSchema);

// ── Seed Admin ───────────────────────────────────────────────
async function seedAdmin() {
  try {
    const exists = await Admin.findOne({ username: 'admin' });
    if (!exists) {
      const hashed = await bcrypt.hash('admin123', 10);
      await Admin.create({ username: 'admin', password: hashed });
      console.log('👤 Admin created → username: admin | password: Sara2001');
    }
  } catch (err) {
    console.error('Seed admin error:', err.message);
  }
}

mongoose.connection.once('open', () => {
  seedAdmin();
});

// ── Multer ───────────────────────────────────────────────────
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  },
});

// ── Auth ─────────────────────────────────────────────────────
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// ── HEALTH CHECK (لـ UptimeRobot) ──────────────────────────
app.get('/', (_, res) => {
  res.json({
    status: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    time: new Date().toISOString()
  });
});

app.get('/health', (_, res) => {
  res.json({ status: 'ok', mongo: mongoose.connection.readyState === 1 });
});

// ── PUBLIC ROUTES ────────────────────────────────────────────

app.post('/api/clients', upload.single('image'), async (req, res) => {
  try {
    const { name, phone, email, country, service, message } = req.body;
    if (!name || !phone || !message)
      return res.status(400).json({ message: 'Name, phone and message are required' });
    const client = await Client.create({
      name, phone,
      email: email || '',
      country: country || '',
      service: service || '',
      message,
      image: req.file ? '/uploads/' + req.file.filename : null,
    });
    res.status(201).json({ success: true, client });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/gallery', async (_, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ADMIN ROUTES ─────────────────────────────────────────────

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '8h' }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/admin/clients', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, service, search } = req.query;
    const filter = {};
    if (service) filter.service = service;
    if (search) filter.$or = [
      { name: new RegExp(search, 'i') },
      { phone: new RegExp(search, 'i') },
      { country: new RegExp(search, 'i') },
    ];
    const total = await Client.countDocuments(filter);
    const clients = await Client.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ clients, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/admin/clients/:id', auth, async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: 'Not found' });
    if (client.image) {
      const fp = path.join(__dirname, client.image);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/admin/gallery', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image' });
    const img = await Gallery.create({
      url: '/uploads/' + req.file.filename,
      caption: req.body.caption || '',
    });
    res.status(201).json({ success: true, img });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/admin/gallery/:id', auth, async (req, res) => {
  try {
    const img = await Gallery.findByIdAndDelete(req.params.id);
    if (!img) return res.status(404).json({ message: 'Not found' });
    const fp = path.join(__dirname, img.url);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/admin/gallery', auth, async (_, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log('🚀 Server running on port ' + PORT));