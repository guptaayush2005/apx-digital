import express from 'express';
import cors from 'cors';
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { WebSocketServer, WebSocket } from 'ws';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data Directory and DB Setup
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true' || Boolean(process.env.NOW_REGION);
const dataDir = isVercel ? '/tmp' : path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'apx.db');
if (isVercel && !fs.existsSync(dbPath)) {
  const seedDb = path.join(__dirname, '..', 'data', 'apx.db');
  if (fs.existsSync(seedDb)) {
    try {
      fs.copyFileSync(seedDb, dbPath);
    } catch {}
  }
}
const db = new DatabaseSync(dbPath);

// Initialize Normalized Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    must_change_password INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    source TEXT DEFAULT 'contact',
    budget TEXT,
    timeline TEXT,
    company TEXT,
    status TEXT DEFAULT 'New',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS message_replies (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL,
    sender TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    reply_text TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(message_id) REFERENCES messages(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS chat_conversations (
    id TEXT PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    visitor_name TEXT NOT NULL,
    visitor_email TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    unread_admin INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    last_activity TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    sender TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS portfolio_projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT,
    category TEXT NOT NULL,
    technologies TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    gallery_images TEXT,
    live_url TEXT,
    github_url TEXT,
    case_study_url TEXT,
    completion_date TEXT,
    is_featured INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Published',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    target_id TEXT,
    is_read INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS services_tools (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL,
    badge TEXT DEFAULT 'FREE TOOL',
    is_free INTEGER DEFAULT 1,
    is_visible INTEGER DEFAULT 1,
    features TEXT,
    updated_at TEXT NOT NULL
  );
`);

// Seed / Update Administrator Credentials: "ayush44129@gmail.com" / "Ayush@123"
try {
  const adminEmail = process.env.ADMIN_EMAIL || 'ayush44129@gmail.com';
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Ayush@123';
  const saltRounds = 10;
  const initialHash = bcrypt.hashSync(initialPassword, saltRounds);
  const now = new Date().toISOString();

  const existingAdmins = db.prepare('SELECT * FROM admins').all();

  if (existingAdmins.length === 0) {
    const insertAdmin = db.prepare(`
      INSERT INTO admins (id, username, email, password_hash, name, role, must_change_password, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
    `);
    insertAdmin.run(
      'adm_ayush_1',
      adminEmail,
      adminEmail,
      initialHash,
      'Ayush Gupta (Founder)',
      'Super Administrator',
      now,
      now
    );
    console.log('[APX DB] Root Administrator account created for ' + adminEmail);
  } else {
    // If admin exists (either old 'APK' or ayush44129@gmail.com), update the primary admin
    const targetAdmin = existingAdmins.find(a => a.email === adminEmail || a.username === 'APK') || existingAdmins[0];
    const updateAdmin = db.prepare(`
      UPDATE admins 
      SET username = ?, email = ?, password_hash = ?, name = ?, role = ?, must_change_password = 1, updated_at = ?
      WHERE id = ?
    `);
    updateAdmin.run(
      adminEmail,
      adminEmail,
      initialHash,
      'Ayush Gupta (Founder)',
      'Super Administrator',
      now,
      targetAdmin.id
    );
    console.log('[APX DB] Administrator account updated for ' + adminEmail + ' with must_change_password = 1');
  }
} catch (err) {
  console.error('[APX DB] Admin initialization error:', err);
}

// Seed Initial Free Resume Builder Tool in services_tools
try {
  const toolCheck = db.prepare("SELECT * FROM services_tools WHERE id = 'resume-builder'").get();
  const now = new Date().toISOString();
  if (!toolCheck) {
    const insertTool = db.prepare(`
      INSERT INTO services_tools (id, title, description, url, badge, is_free, is_visible, features, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertTool.run(
      'resume-builder',
      'Free AI-Assisted Resume Builder',
      'Create a professional, job-ready resume with our free online Resume Builder. Organize your education, skills, projects, experience and achievements into a clean, professional resume format.',
      'https://apx-resume-builder.vercel.app/',
      'FREE TOOL',
      1,
      1,
      JSON.stringify([
        'Easy resume creation',
        'Personal information and contact details',
        'Education and academic details',
        'Technical skills and certifications',
        'Projects and achievements',
        'Professional experience',
        'Clean resume templates',
        'Resume preview and PDF export'
      ]),
      now
    );
    console.log('[APX DB] Initial APX Resume Builder seeded.');
  }
} catch (err) {
  console.error('[APX DB] Services tools initialization error:', err);
}

// Seed Initial Approved Portfolio Project
try {
  const ayushProj = db.prepare("SELECT * FROM portfolio_projects WHERE id = 'ayush-service-center'").get();
  const now = new Date().toISOString();
  if (!ayushProj) {
    const insertProj = db.prepare(`
      INSERT INTO portfolio_projects (
        id, title, slug, short_description, full_description, category, technologies,
        thumbnail_url, gallery_images, live_url, github_url, case_study_url, completion_date,
        is_featured, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertProj.run(
      'ayush-service-center',
      'Ayush Service Center — Store Management Website & Admin Dashboard',
      'ayush-service-center-store',
      'Complete business website and dynamic store management platform with Firebase Firestore & Authentication.',
      'A full-stack business web platform built to give a local retail business an online presence and a real-time product management workflow. Features an authenticated Admin Dashboard to dynamically add, edit, and update store items and inventory without altering code, backed by Firebase Firestore NoSQL database and secure Firebase Authentication.',
      'Website Development',
      JSON.stringify(['HTML5', 'CSS3', 'JavaScript', 'Firebase Firestore', 'Firebase Authentication', 'Firebase Hosting', 'Dynamic Admin Dashboard']),
      '/projects/ayush-service-center.jpg',
      JSON.stringify(['/projects/ayush-service-center.jpg']),
      'https://ayush-hardware-general-store.vercel.app/',
      null,
      null,
      '2025-11',
      1,
      'Published',
      now,
      now
    );
    console.log('[APX DB] Ayush Service Center portfolio project seeded as Published.');
  }

  // Ensure AapdaSetu is preserved in Draft mode for Admin CMS
  const aapdaProj = db.prepare("SELECT * FROM portfolio_projects WHERE id = 'proj_init_1'").get();
  if (!aapdaProj) {
    const insertAapda = db.prepare(`
      INSERT INTO portfolio_projects (
        id, title, slug, short_description, full_description, category, technologies,
        thumbnail_url, gallery_images, live_url, github_url, case_study_url, completion_date,
        is_featured, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertAapda.run(
      'proj_init_1',
      'AapdaSetu: Flash Flood Early Warning & AI Disaster Platform',
      'aapda-setu-flood-warning',
      'AI-powered disaster intelligence & flash flood-risk early warning platform with FastAPI, XGBoost, PostgreSQL, IoT sensor feeds, and geospatial mapping.',
      'AapdaSetu is an enterprise-grade hydrological early-warning system developed by APX Digital. Designed to predict sudden flash-flood surges using automated IoT hydrological telemetry, NASA climate feeds, and gradient-boosted ML regression.',
      'AI Solutions & Automation',
      JSON.stringify(['FastAPI', 'Python', 'XGBoost', 'PostgreSQL', 'IoT Sensors', 'GIS Mapping', 'React']),
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      JSON.stringify([
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
      ]),
      'https://ayush-hardware-general-store.vercel.app/',
      'https://github.com/guptaayush2005',
      null,
      '2025-10',
      0,
      'Draft',
      now,
      now
    );
  } else if (aapdaProj.status === 'Published') {
    db.prepare("UPDATE portfolio_projects SET status = 'Draft', is_featured = 0 WHERE id = 'proj_init_1'").run();
  }
} catch (err) {
  console.error('[APX DB] Portfolio seed error:', err);
}

// Seed initial activity if empty
const countStmt = db.prepare('SELECT COUNT(*) as count FROM activities');
const count = countStmt.get().count;
if (count === 0) {
  const initStmt = db.prepare('INSERT INTO activities (id, type, title, description, created_at) VALUES (?, ?, ?, ?, ?)');
  initStmt.run(
    'act_init_1',
    'system',
    'System Initialized',
    'APX Digital Production Engine & Admin Core online.',
    new Date().toISOString()
  );
}

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'apx_digital_ultra_secure_secret_2026';

// Helper: Record activity
function logActivity(type, title, description) {
  try {
    const stmt = db.prepare('INSERT INTO activities (id, type, title, description, created_at) VALUES (?, ?, ?, ?, ?)');
    stmt.run(`act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, type, title, description, new Date().toISOString());
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
}

// Helper: Record notification
function createNotification(type, title, message, targetId = null) {
  try {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const stmt = db.prepare('INSERT INTO notifications (id, type, title, message, target_id, is_read, created_at) VALUES (?, ?, ?, ?, ?, 0, ?)');
    stmt.run(id, type, title, message, targetId ?? null, now);
  } catch (err) {
    console.error('Failed to record notification:', err);
  }
}

// Simple signed token for admin
function generateToken(adminId, email, username) {
  const payload = { adminId, email, username, exp: Date.now() + 24 * 60 * 60 * 1000 };
  const str = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(str).digest('base64url');
  return `${str}.${sig}`;
}

function verifyToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [str, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(str).digest('base64url');
  if (sig !== expectedSig) return null;
  try {
    const payload = JSON.parse(Buffer.from(str, 'base64url').toString('utf8'));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

// Auth Middleware
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }
  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Forbidden: Invalid or expired admin credentials' });
  }
  
  // Verify admin exists in database
  const adminStmt = db.prepare('SELECT id, username, email, name, role, must_change_password FROM admins WHERE email = ? OR username = ?');
  const admin = adminStmt.get(decoded.email ?? '', decoded.username ?? '');
  if (!admin) {
    return res.status(403).json({ error: 'Forbidden: Admin account does not exist' });
  }

  req.admin = admin;
  next();
}

// Rate Limiter for Login Attempts
const loginAttempts = new Map(); // ip -> { count, lastAttempt }

// ==========================================
// PUBLIC API ROUTES
// ==========================================

// POST /api/contact - Website Contact Form Submission
app.post('/api/contact', (req, res) => {
  const { fullName, email, subject, message } = req.body;

  if (!fullName || !email || !message) {
    return res.status(400).json({ error: 'Full name, email, and message are required.' });
  }

  const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const sub = subject || 'General Website Inquiry';

  try {
    const stmt = db.prepare(`
      INSERT INTO messages (id, name, email, subject, message, source, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'contact', 'New', ?, ?)
    `);
    stmt.run(id, fullName.trim(), email.trim(), sub.trim(), message.trim(), now, now);

    logActivity('contact', `New Contact: ${fullName}`, `Subject: ${sub}`);
    createNotification('contact', `New Inquiry from ${fullName}`, `Subject: ${sub}`, id);

    // Notify connected admin sockets about new message
    broadcastToAdmins({
      type: 'admin:notification',
      category: 'message',
      title: 'New Contact Form Submission',
      data: { id, name: fullName, email, subject: sub, created_at: now }
    });

    return res.status(201).json({
      success: true,
      message: 'Your message has been securely received by the APX Digital team.',
      id
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    return res.status(500).json({ error: 'Failed to record your message. Please try again.' });
  }
});

// POST /api/inquiries - Project Scope / Start Project Form Submission
app.post('/api/inquiries', (req, res) => {
  const { fullName, email, phone, company, service, budget, timeline, description, reference, additionalReqs } = req.body;

  if (!fullName || !email || !phone || !description) {
    return res.status(400).json({ error: 'Name, email, phone, and project description are required.' });
  }

  const id = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const sub = service ? `Project Inquiry: ${service}` : 'Start Project Submission';

  let fullOverview = description.trim();
  if (reference) fullOverview += `\n\n[References]: ${reference.trim()}`;
  if (additionalReqs) fullOverview += `\n\n[Additional Notes]: ${additionalReqs.trim()}`;

  try {
    const stmt = db.prepare(`
      INSERT INTO messages (id, name, email, phone, company, subject, message, source, budget, timeline, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'inquiry', ?, ?, 'New', ?, ?)
    `);
    stmt.run(
      id,
      fullName.trim(),
      email.trim(),
      phone.trim(),
      (company || '').trim(),
      sub,
      fullOverview,
      budget || 'Flexible',
      timeline || 'Flexible',
      now,
      now
    );

    logActivity('inquiry', `Project Proposal: ${fullName}`, `Service: ${service || 'Custom'}, Budget: ${budget || 'Flexible'}`);
    createNotification('inquiry', `New Proposal from ${fullName}`, `Service: ${service || 'Custom'} (${budget || 'Flexible'})`, id);

    broadcastToAdmins({
      type: 'admin:notification',
      category: 'inquiry',
      title: 'New Project Proposal Received',
      data: { id, name: fullName, email, service, budget, timeline, created_at: now }
    });

    return res.status(201).json({
      success: true,
      message: 'Project specifications saved. An APX Digital engineer will review them shortly.',
      id
    });
  } catch (err) {
    console.error('Inquiry submission error:', err);
    return res.status(500).json({ error: 'Database transaction failed. Please retry.' });
  }
});

// GET /api/portfolio - Public Portfolio (Published Only)
app.get('/api/portfolio', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM portfolio_projects 
      WHERE status = 'Published' 
      ORDER BY is_featured DESC, created_at DESC
    `);
    const projects = stmt.all().map(p => ({
      ...p,
      technologies: JSON.parse(p.technologies || '[]'),
      gallery_images: JSON.parse(p.gallery_images || '[]'),
      is_featured: Boolean(p.is_featured)
    }));
    return res.json({ success: true, projects });
  } catch (err) {
    console.error('Fetch public portfolio error:', err);
    return res.status(500).json({ error: 'Failed to retrieve portfolio projects.' });
  }
});

// POST /api/chat/ai - Knowledge-Grounded AI Assistant
const aiChatMultilingual = {
  "en": {
    "services": "APX Digital provides 8 core technical and creative services:\n\n1. **Website Development**: High-performance business flagships, landing pages, and e-commerce.\n2. **App Development**: Dynamic web apps, mobile apps, and robust admin dashboards.\n3. **AI Solutions & Automation**: Custom AI bots, intelligent workflow engines, and LLM integrations.\n4. **Video Editing & Motion Graphics**: Viral short-form (Reels/Shorts), long-form YouTube edits, and motion graphics.\n5. **Graphic Design & Branding**: Distinctive brand systems, vector logos, and marketing collaterals.\n6. **Presentation Design**: Investor pitch decks, financial roadmaps, and conference keynotes.\n7. **Digital Marketing & Content Support**: Targeted social campaigns and content frameworks.\n8. **Social Media Management**: Strategic planning, post design, reels production, page management, and performance analytics.\n\nWhich service can we assist your business with today?",
    "social": "Our **Social Media Management** service helps businesses establish authority and drive organic growth:\n\n- Strategic Social Media Roadmaps\n- 30-Day Content Planning & Calendars\n- High-Converting Post & Carousel Design\n- Viral Reels & Short-Form Video Content\n- Active Page & Profile Management\n- Audience Engagement & Community Building\n- Comprehensive Performance & Growth Analytics\n\nWould you like our team to analyze your brand's social media presence?",
    "team": "APX Digital is engineered and led by our specialized founding team:\n\n- **Ayush Gupta** — Founder: Full-stack software engineer & AI solutions architect.\n- **Prince Singh** — Founding Partner: Frontend engineer, UI/UX systems & client project lead.\n- **Komal Soni** — Founding Team Member: Technical development, creative design, and digital content production.\n\nWould you like to connect directly with our founding team? Click \"Talk to a Live Agent\" above!",
    "pricing": "At APX Digital, we tailor our pricing precisely to your project's scope, technology requirements, and timeline to ensure maximum return on investment without hidden fees.\n\nTo get a customized proposal within 24 hours, visit our **Start Project** page or tell me your requirements right here!",
    "contact": "You can reach the APX Digital team directly:\n\n- **Email**: contact@apxdigital.com\n- **Phone / WhatsApp**: +91 9519099011\n- **LinkedIn**: linkedin.com/company/apx-digital-india/\n- **Direct Booking**: Fill out the brief at /start-project or /contact.",
    "tagline": "APX Digital's official brand tagline is:\n\n**BUILD • CREATE • INNOVATE**\n\nWe build high-performance software, create striking creative visuals, and innovate with intelligent AI systems.",
    "fallback": "Thank you for reaching out! I'm your APX Digital AI Assistant. We specialize in custom web apps, mobile solutions, generative AI workflows, video editing, branding, and social media management.\n\nCould you tell me a little about your project goals, preferred timeline, or budget? Or click \"Talk to a Live Agent\" to chat with our team in real time!"
  },
  "hi": {
    "services": "APX Digital 8 मुख्य डिजिटल सेवाएं प्रदान करता है:\n\n1. **वेबसाइट डेवलपमेंट**: उच्च-प्रदर्शन कॉर्पोरेट वेबसाइटें, लैंडिंग पेज और ई-कॉमर्स प्लेटफ़ॉर्म।\n2. **ऐप डेवलपमेंट**: मोबाइल और वेब ऐप्स, कस्टम एडमिन डैशबोर्ड।\n3. **एआई समाधान एवं ऑटोमेशन**: कस्टम एआई चैटबॉट, वर्कफ़्लो ऑटोमेशन और प्रेडिक्टिव मॉडल्स।\n4. **वीडियो एडिटिंग एवं मोशन ग्राफिक्स**: इंस्टाग्राम रील्स, यूट्यूब शॉर्ट्स और 4K वीडियो प्रोडक्शन।\n5. **ग्राफिक डिजाइन एवं ब्रांडिंग**: ब्रांड पहचान, आधुनिक लोगो और विज़ुअल एसेट्स।\n6. **प्रेजेंटेशन डिज़ाइन**: स्टार्टअप पिच डेक और कॉर्पोरेट कीनोट्स।\n7. **डिजिटल मार्केटिंग एवं कंटेंट सपोर्ट**: रणनीतिक अभियान और संपादकीय कैलेंडर।\n8. **सोशल मीडिया मैनेजमेंट**: रणनीतिक प्रबंधन, कंटेंट योजना, रील्स, ऑडियंस एंगेजमेंट और परफॉर्मेंस एनालिसिस।\n\nआप किस सर्विस के बारे में अधिक जानना चाहते हैं?",
    "social": "हमारी **सोशल मीडिया मैनेजमेंट (Social Media Management)** सेवा व्यवसायों को एक मजबूत डिजिटल पहचान बनाने में मदद करती है:\n\n- सोशल मीडिया रणनीति एवं ब्रांड पोज़िशनिंग\n- 30-दिवसीय कंटेंट योजना एवं कैलेंडर\n- आकर्षक पोस्ट्स एवं कैरोसेल डिज़ाइन\n- रील्स एवं शॉर्ट-फॉर्म वीडियो प्रोडक्शन\n- पेज एवं प्रोफाइल प्रबंधन\n- दर्शकों के साथ जुड़ाव (Audience Engagement)\n- प्रदर्शन एवं मेट्रिक्स विश्लेषण\n\nक्या आप अपने ब्रांड के लिए सोशल मीडिया रणनीति शुरू करना चाहते हैं?",
    "team": "APX Digital का नेतृत्व हमारे समर्पित तकनीकी और रचनात्मक संस्थापकों द्वारा किया जाता है:\n\n- **आयुष गुप्ता (Ayush Gupta)** — संस्थापक (Founder): फुल-स्टैक इंजीनियर और एआई विशेषज्ञ।\n- **प्रिंस सिंह (Prince Singh)** — संस्थापक साझेदार (Founding Partner): फ्रंटएंड इंजीनियर और प्रोजेक्ट लीड।\n- **कोमल सोनी (Komal Soni)** — संस्थापक टीम सदस्य (Founding Team Member): वेब डेवलपमेंट, सॉफ्टवेयर इंजीनियरिंग, क्रिएटिव डिज़ाइन और डिजिटल कंटेंट प्रोडक्शन में कुशल।\n\nसंस्थापकों से सीधे बात करने के लिए ऊपर \"Talk to a Live Agent\" पर क्लिक करें!",
    "pricing": "APX Digital में प्रत्येक प्रोजेक्ट के लिए कस्टम कोटेशन प्रदान किया जाता है। हमारी मूल्य संरचना पारदर्शी है और प्रोजेक्ट के दायरे, तकनीकी आवश्यकताओं और समयसीमा पर आधारित होती है।\n\n24 घंटे के भीतर विस्तृत प्रस्ताव प्राप्त करने के लिए हमारे **Start Project** पेज पर जाएं!",
    "contact": "आप हमसे सीधे संपर्क कर सकते हैं:\n\n- **ईमेल**: contact@apxdigital.com\n- **फ़ोन / व्हाट्सएप**: +91 9519099011\n- **लिंक्डइन**: linkedin.com/company/apx-digital-india/\n- **वेबसाइट**: /contact या /start-project पेज पर फॉर्म भरें।",
    "tagline": "APX Digital का आधिकारिक आदर्श वाक्य है:\n\n**BUILD • CREATE • INNOVATE**\n\nहम उच्च प्रदर्शन सॉफ़्टवेयर बनाते हैं, आकर्षक विज़ुअल्स डिज़ाइन करते हैं और बुद्धिमान एआई प्रणालियों के साथ नवाचार करते हैं।",
    "fallback": "नमस्ते! मैं APX Digital का एआई असिस्टेंट हूँ। हम वेबसाइट डेवलपमेंट, ऐप डेवलपमेंट, एआई ऑटोमेशन, वीडियो एडिटिंग, ब्रांडिंग और सोशल मीडिया मैनेजमेंट में विशेषज्ञ हैं।\n\nकृपया मुझे अपने प्रोजेक्ट का विवरण, बजट या समयसीमा बताएं, या हमारी टीम से तुरंत बात करने के लिए \"Talk to a Live Agent\" चुनें!"
  },
  "es": {
    "services": "APX Digital ofrece 8 servicios técnicos y creativos principales:\n\n1. **Desarrollo Web**: Sitios web corporativos de alto rendimiento, páginas de destino y comercio electrónico.\n2. **Desarrollo de Aplicaciones**: Aplicaciones web y móviles dinámicas, y paneles de administración robustos.\n3. **Soluciones de IA y Automatización**: Chatbots personalizados, motores de flujo de trabajo inteligentes e integraciones de LLM.\n4. **Edición de Video y Motion Graphics**: Reels/Shorts virales, producciones de YouTube y gráficos en movimiento.\n5. **Diseño Gráfico y Branding**: Identidad de marca distintiva, logotipos vectoriales y material de marketing.\n6. **Diseño de Presentaciones**: Pitch decks para inversores, hojas de ruta financieras y conferencias.\n7. **Marketing Digital y Contenido**: Campañas estratégicas en redes sociales y marcos de contenido.\n8. **Gestión de Redes Sociales**: Planificación estratégica, diseño de publicaciones, producción de reels y análisis de rendimiento.\n\n¿En qué servicio podemos ayudar a su empresa hoy?",
    "social": "Nuestro servicio de **Gestión de Redes Sociales** ayuda a construir autoridad y acelerar el crecimiento orgánico:\n\n- Estrategia en redes sociales y posicionamiento de marca\n- Calendarios y planificación de contenido de 30 días\n- Diseño de publicaciones y carruseles de alta conversión\n- Producción de videos cortos y Reels\n- Gestión activa de perfiles y páginas\n- Interacción y fidelización de la comunidad\n- Análisis exhaustivo de métricas y crecimiento\n\n¿Desea que nuestro equipo analice la presencia en redes sociales de su marca?",
    "team": "APX Digital está dirigido por nuestro equipo fundador especializado:\n\n- **Ayush Gupta** — Fundador: Ingeniero de software full-stack y arquitecto de soluciones de IA.\n- **Prince Singh** — Socio Fundador: Ingeniero frontend, diseño UI/UX y líder de proyectos.\n- **Komal Soni** — Miembro del Equipo Fundador: Desarrollo técnico, diseño creativo y producción digital.\n\n¿Desea hablar directamente con los fundadores? Haga clic en \"Hablar con un Agente en Vivo\".",
    "pricing": "En APX Digital, adaptamos nuestros precios con total precisión al alcance, tecnologías y plazos de su proyecto, garantizando máxima rentabilidad sin costos ocultos.\n\nPara recibir una propuesta personalizada en menos de 24 horas, visite nuestra página **Iniciar un Proyecto**.",
    "contact": "Puede comunicarse con el equipo de APX Digital directamente:\n\n- **Correo electrónico**: contact@apxdigital.com\n- **Teléfono / WhatsApp**: +91 9519099011\n- **LinkedIn**: linkedin.com/company/apx-digital-india/\n- **Página Web**: Complete el formulario en /contact o /start-project.",
    "tagline": "El lema oficial de APX Digital es:\n\n**BUILD • CREATE • INNOVATE**\n\nConstruimos software de alto rendimiento, creamos experiencias visuales impactantes e innovamos con inteligencia artificial.",
    "fallback": "¡Gracias por contactarnos! Soy el asistente de IA de APX Digital. Nos especializamos en aplicaciones web personalizadas, soluciones móviles, flujos de trabajo con IA, edición de video, branding y gestión de redes sociales.\n\n¿Podría compartir los objetivos de su proyecto, plazo o presupuesto? ¡O haga clic en \"Hablar con un Agente en Vivo\" para chatear en tiempo real!"
  },
  "fr": {
    "services": "APX Digital propose 8 services techniques et créatifs d'élite :\n\n1. **Développement Web** : Sites d'entreprise haute performance, pages d'atterrissage et e-commerce.\n2. **Développement d'Applications** : Applications web et mobiles réactives et tableaux de bord d'administration.\n3. **Solutions d'IA et Automatisation** : Chatbots IA sur mesure, pipelines d'automatisation et intégrations LLM.\n4. **Montage Vidéo et Motion Design** : Formats courts viraux (Reels/Shorts), vidéos YouTube et animations graphiques.\n5. **Design Graphique et Image de Marque** : Identités visuelles de marque, logos vectoriels et supports marketing.\n6. **Design de Présentations & Pitch Decks** : Decks pour investisseurs et présentations d'entreprise stratégiques.\n7. **Marketing Digital et Support Contenu** : Campagnes ciblées sur les réseaux sociaux et stratégie éditoriale.\n8. **Gestion des Réseaux Sociaux** : Planification stratégique, création de publications, production de reels et analyse.\n\nSur quel service pouvons-nous accompagner votre entreprise aujourd'hui ?",
    "social": "Notre service de **Gestion des Réseaux Sociaux** permet de bâtir une autorité numérique durable :\n\n- Stratégie de positionnement et image de marque\n- Calendriers éditoriaux complets sur 30 jours\n- Conception de visuels et carrousels engageants\n- Création et montage de Reels / Shorts viraux\n- Gestion quotidienne et modération de communauté\n- Rapports d'analyse et suivi de la croissance\n\nSouhaitez-vous que notre équipe évalue votre présence sur les réseaux sociaux ?",
    "team": "APX Digital est conçu et dirigé par son équipe fondatrice technique :\n\n- **Ayush Gupta** — Fondateur : Ingénieur logiciel full-stack & architecte de solutions d'IA.\n- **Prince Singh** — Associé Fondateur : Ingénieur frontend, ergonomie UI/UX et direction de projet.\n- **Komal Soni** — Membre de l'Équipe Fondatrice : Développement technique, design créatif et production multimédia.\n\nPour échanger directement avec nos fondateurs, cliquez sur \"Parler à un Agent en Direct\" !",
    "pricing": "Chez APX Digital, notre tarification est calculée sur mesure selon l'envergure, les technologies et les échéances de votre projet, en toute transparence et sans frais imprévus.\n\nPour recevoir une proposition personnalisée sous 24h, visitez notre page **Lancer un Projet** !",
    "contact": "Vous pouvez contacter l'équipe APX Digital directement :\n\n- **E-mail** : contact@apxdigital.com\n- **Téléphone / WhatsApp** : +91 9519099011\n- **LinkedIn** : linkedin.com/company/apx-digital-india/\n- **Site Web** : Remplissez le formulaire sur /contact ou /start-project.",
    "tagline": "Le slogan officiel d'APX Digital est :\n\n**BUILD • CREATE • INNOVATE**\n\nNous développons des logiciels performants, concevons des visuels captivants et innovons avec l'intelligence artificielle.",
    "fallback": "Bonjour et bienvenue chez APX Digital ! Je suis votre assistant IA. Nous sommes spécialisés dans le développement web, les applications mobiles, l'automatisation par l'IA, le montage vidéo, le branding et la gestion des réseaux sociaux.\n\nParlez-moi de votre projet, de vos objectifs ou de votre calendrier, ou cliquez sur \"Parler à un Agent en Direct\" pour discuter immédiatement !"
  },
  "de": {
    "services": "APX Digital bietet 8 zentrale technische und kreative Dienstleistungen:\n\n1. **Webentwicklung**: Leistungsstarke Unternehmenswebsites, Landing Pages und E-Commerce-Plattformen.\n2. **App-Entwicklung**: Dynamische Web- und Mobil-Apps sowie maßgeschneiderte Admin-Dashboards.\n3. **KI-Lösungen & Automatisierung**: Maßgeschneiderte KI-Chatbots, Workflow-Engines und LLM-Integrationen.\n4. **Videoschnitt & Motion Graphics**: Virale Kurzvideos (Reels/Shorts), YouTube-Produktionen und Motion Design.\n5. **Grafikdesign & Branding**: Einzigartige Markenidentitäten, Vektorlogos und Marketingmaterialien.\n6. **Präsentationsdesign**: Investoren-Pitch-Decks, Finanzberichte und Konferenzfolien.\n7. **Digitales Marketing & Content-Support**: Strategische Social-Media-Kampagnen und Redaktionspläne.\n8. **Social Media Management**: Strategische Planung, Beitragsdesign, Reels-Produktion und Performance-Analysen.\n\nBei welchem Vorhaben dürfen wir Ihr Unternehmen heute unterstützen?",
    "social": "Unser Service für **Social Media Management** baut digitale Markenautorität auf und fördert organisches Wachstum:\n\n- Strategische Social-Media-Positionierung\n- 30-Tage-Redaktionspläne und Content-Kalender\n- Konversionsstarke Grafiken und Karussell-Beiträge\n- Produktion viraler Reels & Shorts\n- Aktive Profil- und Community-Betreuung\n- Ausführliche Performance- und Wachstumsberichte\n\nMöchten Sie, dass unser Team Ihre Social-Media-Präsenz analysiert?",
    "team": "APX Digital wird von unserem spezialisierten Gründerteam geführt:\n\n- **Ayush Gupta** — Gründer: Full-Stack-Softwareingenieur & KI-Lösungsarchitekt.\n- **Prince Singh** — Gründungspartner: Frontend-Ingenieur, UI/UX-Systeme und Projektleiter.\n- **Komal Soni** — Gründungsmitglied: Technische Entwicklung, kreatives Design und digitale Medienproduktion.\n\nMöchten Sie direkt mit unseren Gründern sprechen? Klicken Sie oben auf \"Mit Live-Berater sprechen\"!",
    "pricing": "Bei APX Digital kalkulieren wir jedes Projekt transparent nach Umfang, Technologieanforderungen und Zeitplan – ohne versteckte Kosten für maximalen Mehrwert.\n\nBesuchen Sie unsere Seite **Projekt starten**, um innerhalb von 24 Stunden ein detailliertes Angebot zu erhalten!",
    "contact": "So erreichen Sie das Team von APX Digital direkt:\n\n- **E-Mail**: contact@apxdigital.com\n- **Telefon / WhatsApp**: +91 9519099011\n- **LinkedIn**: linkedin.com/company/apx-digital-india/\n- **Website**: Senden Sie eine Anfrage über /contact oder /start-project.",
    "tagline": "Der offizielle Leitsatz von APX Digital lautet:\n\n**BUILD • CREATE • INNOVATE**\n\nWir entwickeln hochperformante Software, kreieren erstklassige visuelle Erlebnisse und treiben Innovationen mit künstlicher Intelligenz voran.",
    "fallback": "Herzlich willkommen bei APX Digital! Ich bin Ihr KI-Assistent. Wir sind spezialisiert auf moderne Webanwendungen, Apps, generative KI, Videoschnitt, Branding und Social Media Management.\n\nErzählen Sie mir gerne von Ihren Zielen, Ihrem Zeitplan oder Budget – oder klicken Sie auf \"Mit Live-Berater sprechen\" für den direkten Kontakt!"
  },
  "pt": {
    "services": "A APX Digital oferece 8 serviços técnicos e criativos de excelência:\n\n1. **Desenvolvimento Web**: Websites corporativos de alta performance, landing pages e e-commerce.\n2. **Desenvolvimento de Aplicativos**: Aplicações web e mobile dinâmicas e painéis de administração robustos.\n3. **Soluções de IA e Automação**: Chatbots de IA sob medida, automação de fluxos de trabalho e integrações de LLM.\n4. **Edição de Vídeo e Motion Graphics**: Conteúdo viral curto (Reels/Shorts), vídeos para YouTube e animações gráficas.\n5. **Design Gráfico e Branding**: Identidades visuais memoráveis, logotipos vetoriais e materiais de marketing.\n6. **Design de Apresentações**: Pitch decks para investidores e apresentações executivas persuasivas.\n7. **Marketing Digital e Conteúdo**: Campanhas estratégicas em redes sociais e planejamento editorial.\n8. **Gestão de Redes Sociais**: Planejamento estratégico, design de posts, produção de reels e análise de métricas.\n\nCom qual desses serviços podemos impulsionar o seu negócio hoje?",
    "social": "Nosso serviço de **Gestão de Redes Sociais** estabelece autoridade de marca e atrai novos clientes:\n\n- Estratégia de posicionamento em mídias sociais\n- Planejamento e calendários editoriais de 30 dias\n- Criação de posts e carrosséis com alto engajamento\n- Produção e edição de Reels e vídeos curtos virais\n- Gestão ativa de páginas e resposta à comunidade\n- Relatórios completos de crescimento e métricas\n\nGostaria de uma análise da presença da sua marca nas redes sociais?",
    "team": "A APX Digital é liderada pela nossa equipe de fundadores técnicos:\n\n- **Ayush Gupta** — Fundador: Engenheiro de software full-stack e arquiteto de IA.\n- **Prince Singh** — Sócio Fundador: Engenheiro frontend, especialista em UI/UX e líder de projetos.\n- **Komal Soni** — Membro da Equipe Fundadora: Desenvolvimento técnico, design criativo e produção digital.\n\nDeseja falar diretamente com os fundadores? Clique em \"Falar com Agente em Tempo Real\"!",
    "pricing": "Na APX Digital, a precificação é ajustada com total clareza ao escopo, tecnologia e prazos do seu projeto, garantindo o melhor custo-benefício sem taxas surpresa.\n\nAcesse nossa página **Iniciar um Projeto** para receber uma proposta sob medida em até 24 horas!",
    "contact": "Você pode entrar em contato direto com a equipe da APX Digital:\n\n- **E-mail**: contact@apxdigital.com\n- **Telefone / WhatsApp**: +91 9519099011\n- **LinkedIn**: linkedin.com/company/apx-digital-india/\n- **Site**: Envie uma mensagem pelas páginas /contact ou /start-project.",
    "tagline": "O lema oficial da APX Digital é:\n\n**BUILD • CREATE • INNOVATE**\n\nDesenvolvemos softwares de ponta, criamos experiências visuais marcantes e inovamos com inteligência artificial.",
    "fallback": "Olá! Bem-vindo à APX Digital. Sou o seu assistente de inteligência artificial. Somos especialistas em desenvolvimento web, aplicativos, automação com IA, edição de vídeo, branding e redes sociais.\n\nComo posso ajudar você hoje? Fique à vontade para detalhar seu projeto ou clicar em \"Falar com Agente em Tempo Real\"!"
  },
  "ar": {
    "services": "تقدم وكالة APX Digital ثماني خدمات تقنية وإبداعية رائدة:\n\n1. **تطوير المواقع الإلكترونية**: منصات شركات عالية الأداء، صفحات هبوط ومتاجر إلكترونية حديثة.\n2. **تطوير التطبيقات**: تطبيقات الويب والهواتف المحمولة ولوحات تحكم إدارية متقدمة.\n3. **حلول الذكاء الاصطناعي والأتمتة**: روبوتات محادثة مخصصة وأتمتة مسارات العمل وتكامل نماذج LLM.\n4. **تحرير الفيديو والموشن جرافيك**: مقاطع ريلز وشورتس سريعة الانتشار ومونتاج يوتيوب احترافي.\n5. **التصميم الجرافيكي وبناء الهوية التجارية**: هويات بصرية متميزة وشعارات متجهة ومواد تسويقية.\n6. **تصميم العروض التقديمية**: عروض تمويل للمستثمرين (Pitch Decks) وعروض المؤتمرات.\n7. **التسويق الرقمي وإدارة المحتوى**: حملات تسويقية استراتيجية وخطط نشر شهرية.\n8. **إدارة وسائل التواصل الاجتماعي**: تخطيط استراتيجي، تصميم منشورات، إنتاج مقاطع ريلز، وتحليلات الأداء.\n\nأي من هذه الخدمات ترغب في الاستفسار عنها اليوم؟",
    "social": "تساعدك خدمتنا في **إدارة وسائل التواصل الاجتماعي** على بناء حضور رقمي قوي وجذب عملاء جدد:\n\n- استراتيجية متكاملة لتموضع العلامة التجارية\n- خطة محتوى وجداول نشر شهرية لمدة 30 يوماً\n- تصميم منشورات وسلاسل صور (Carousels) عالية التفاعل\n- إنتاج مقاطع فيديو قصيرة وريلز جذابة\n- إدارة الحسابات والتفاعل الفوري مع المتابعين\n- تقارير تحليلية ومتابعة دقيقة لمعدلات النمو\n\nهل ترغب في أن يقوم فريقنا بتحليل الحسابات الحالية لعلامتك التجارية؟",
    "team": "يقود وكالة APX Digital فريق مؤسس متخصص يجمع بين الهندسة التقنية والإبداع:\n\n- **أيوش غوبتا (Ayush Gupta)** — المؤسس: مهندس برمجيات شامل ومهندس حلول الذكاء الاصطناعي.\n- **برنس سينغ (Prince Singh)** — الشريك المؤسس: مهندس الواجهات الأمامية وأنظمة UI/UX وقائد المشاريع.\n- **كومال سوني (Komal Soni)** — عضو الفريق المؤسس: تطوير تقني، تصميم إبداعي، وإنتاج محتوى رقمي.\n\nللتحدث مباشرة مع المؤسسين، اضغط على زر \"التحدث مع ممثل مباشر\" بالأعلى!",
    "pricing": "في APX Digital، نحدد التكلفة بدقة وشفافية وفقاً لنطاق المشروع، التقنيات المطلوبة والجدول الزمني المحدد، دون أي رسوم خفية.\n\nللحصول على عرض سعر مفصل خلال 24 ساعة، تفضل بزيارة صفحة **بدء مشروع**!",
    "contact": "يمكنك التواصل مباشرة مع فريق APX Digital عبر القنوات المعتمدة:\n\n- **البريد الإلكتروني**: contact@apxdigital.com\n- **الهاتف / واتساب**: +91 9519099011\n- **لينكد إن**: linkedin.com/company/apx-digital-india/\n- **الموقع**: املأ النموذج في صفحة /contact أو /start-project.",
    "tagline": "الشعار الرسمي لوكالة APX Digital هو:\n\n**BUILD • CREATE • INNOVATE**\n\nنبني برمجيات فائقة الأداء، نبتكر تصاميم بصرية مميزة، ونقود الابتكار بحلول الذكاء الاصطناعي.",
    "fallback": "أهلاً بك في وكالة APX Digital! أنا مساعدك الذكي. نحن متخصصون في تطوير المواقع والتطبيقات، أتمتة الذكاء الاصطناعي، إنتاج الفيديو، بناء الهويات البصرية، وإدارة منصات التواصل.\n\nأخبرني بمتطلبات مشروعك، ميزانيتك أو وقت التسليم، أو اضغط على \"التحدث مع ممثل مباشر\" للتواصل فوراً!"
  },
  "zh": {
    "services": "APX Digital 提供 8 项核心技术与创意数字化服务：\n\n1. **网站开发**：高性能企业官网、高转化着陆页及定制电子商务系统。\n2. **应用程序开发**：跨平台移动与 Web 应用、强大的后台管理控制台。\n3. **人工智能解决方案与自动化**：定制 AI 智能助手、自动化业务工作流及大模型 API 集成。\n4. **视频剪辑与动态图形**：爆款短视频（Reels/Shorts）、长视频制作与品牌动效。\n5. **平面设计与品牌建设**：独具特色的品牌视觉识别系统、矢量 Logo 与市场营销物料。\n6. **演示文稿与路演幻灯片设计**：专为投资人打造的商业计划书（Pitch Deck）与大会主题演讲幻灯片。\n7. **数字营销与内容支持**：战略性社媒营销方案与全月度内容策划规划。\n8. **社交媒体全案运营**：内容战略、图文排版、短视频制作、粉丝社群互动与数据分析。\n\n请问我们今天可以在哪项业务上为您提供支持？",
    "social": "我们的 **社交媒体全案运营** 服务帮助企业建立强大的数字影响力：\n\n- 社交媒体战略规划与品牌定位\n- 30 天月度内容排期与策划日历\n- 高转化率图文与轮播图设计\n- 爆款短视频与 Reels 剪辑制作\n- 官方账号日常维护与粉丝互动\n- 全面运营数据洞察与增长分析\n\n您希望我们的团队为您评估现有品牌的社媒表现吗？",
    "team": "APX Digital 由我们专业的技术与创意创始团队亲自挂帅带领：\n\n- **Ayush Gupta** — 创始人：全栈软件工程师兼 AI 架构师。\n- **Prince Singh** — 联合创始人：前端工程师、UI/UX 系统设计师兼项目交付总监。\n- **Komal Soni** — 创始团队成员：技术开发、创意设计与数字多媒体制作。\n\n如需与创始团队直接沟通，请点击上方的“联系真人顾问”！",
    "pricing": "在 APX Digital，我们根据您的项目范围、技术难度及交付时间提供透明公开的报价，绝无隐藏收费。\n\n欢迎访问我们的 **启动项目** 页面提交需求，我们将在 24 小时内为您提供定制化方案！",
    "contact": "您可以通过以下官方渠道直接联系 APX Digital 团队：\n\n- **电子邮箱**：contact@apxdigital.com\n- **电话 / WhatsApp**：+91 9519099011\n- **领英 (LinkedIn)**：linkedin.com/company/apx-digital-india/\n- **网站**：在 /contact 或 /start-project 页面填写咨询表单。",
    "tagline": "APX Digital 的官方品牌标语是：\n\n**BUILD • CREATE • INNOVATE**\n\n我们构建卓越软件，打造惊艳视觉，以人工智能赋能数字未来。",
    "fallback": "您好！欢迎来到 APX Digital。我是您的 AI 智能顾问。我们专注于定制网站开发、移动应用、AI 自动化流程、视频制作、品牌设计与社媒运营。\n\n请告诉我您的项目需求、预算或预期交付时间，或点击“联系真人顾问”与我们的团队实时沟通！"
  },
  "ja": {
    "services": "APX Digital は、8つの主要なエンジニアリングおよびクリエイティブサービスを提供しています：\n\n1. **Webサイト開発**：高パフォーマンスな企業サイト、LP、ECプラットフォームの構築。\n2. **アプリ開発**：直感的なWeb/モバイルアプリ、業務自動化ダッシュボードの設計。\n3. **AIソリューション＆自動化**：カスタムAIチャットボット、業務自動化パイプライン、LLM統合。\n4. **動画編集＆モーショングラフィックス**：SNS向けショート動画（Reels/Shorts）、YouTube動画制作。\n5. **グラフィックデザイン＆ブランディング**：独自のブランドアイデンティティ、ロゴ、販促資料の制作。\n6. **プレゼンテーション＆ピッチ資料設計**：投資家向けピッチデッキ、企業向け重要プレゼン資料。\n7. **デジタルマーケティング＆コンテンツ支援**：戦略的なSNSキャンペーンおよびコンテンツ企画。\n8. **SNS運用管理**：戦略立案、投稿デザイン、リール動画制作、フォロワー対応、分析レポート。\n\nお客様のビジネスにどのサービスでお役に立てますでしょうか？",
    "social": "当社の **SNS運用管理** サービスは、ブランド認知度を高め、持続的な成長を実現します：\n\n- SNS戦略とブランドポジショニングの策定\n- 30日間のコンテンツ企画カレンダーの構築\n- 高エンゲージメント投稿・カルーセルデザイン\n- バイラル向けリール・ショート動画の編集制作\n- アカウントの日々の運用およびフォロワー対応\n- 詳細な成長分析レポートの提供\n\nお客様のブランドのSNS分析をご希望ですか？お気軽にお知らせください。",
    "team": "APX Digital は、技術力と創造力を備えた創業チームが直接リードしています：\n\n- **Ayush Gupta** — 創業者：フルスタックソフトウェアエンジニア、AIソリューションアーキテクト。\n- **Prince Singh** — 共同創業者：フロントエンドエンジニア、UI/UXシステム設計、プロジェクト統括。\n- **Komal Soni** — 創業チームメンバー：技術開発、クリエイティブデザイン、デジタル制作。\n\n創業者と直接ご相談される場合は、画面上部の「ライブ担当者と話す」をクリックしてください！",
    "pricing": "APX Digital では、プロジェクトの規模、技術要件、納期に合わせて透明性の高い見積もりをご案内しています。隠れた追加費用は一切ございません。\n\n24時間以内に詳細な提案書をお届けしますので、ぜひ **プロジェクトを開始する** ページをご利用ください！",
    "contact": "APX Digital への公式連絡先は以下の通りです：\n\n- **メール**：contact@apxdigital.com\n- **電話 / WhatsApp**：+91 9519099011\n- **LinkedIn**：linkedin.com/company/apx-digital-india/\n- **Webサイト**：/contact または /start-project フォームよりご連絡ください。",
    "tagline": "APX Digital の公式タグライン：\n\n**BUILD • CREATE • INNOVATE**\n\n高性能なソフトウェアを構築し、魅力的なビジュアルを創造し、AIによる革新を推進します。",
    "fallback": "こんにちは！APX Digital のAIアシスタントです。Webサイト制作、アプリ開発、AI自動化、動画編集、ブランディング、SNS運用などを専門としています。\n\nプロジェクトの目的、ご予算、納期などをお聞かせいただくか、「ライブ担当者と話す」をクリックしてチームにお問い合わせください！"
  },
  "ko": {
    "services": "APX Digital은 8가지 핵심 엔지니어링 및 크리에이티브 서비스를 제공합니다:\n\n1. **웹사이트 개발**: 고성능 기업 웹사이트, 랜딩 페이지, 맞춤형 이커머스 솔루션.\n2. **앱 개발**: 반응형 웹 및 모바일 애플리케이션, 강력한 관리자 대시보드 구축.\n3. **AI 솔루션 및 자동화**: 맞춤형 AI 챗봇, 지능형 업무 자동화 워크플로, LLM 연동.\n4. **영상 편집 및 모션 그래픽**: 바이럴 숏폼(Reels/Shorts), 유튜브 영상 제작, 모션 그래픽.\n5. **그래픽 디자인 및 브랜딩**: 독창적인 브랜드 아이덴티티, 벡터 로고, 마케팅 시각 자료.\n6. **프레젠테이션 및 피치덱 디자인**: 투자 유치용 피치덱, 기업 IR 및 컨퍼런스 발표 자료.\n7. **디지털 마케팅 및 콘텐츠 지원**: 전략적 소셜 캠페인 기획 및 월간 콘텐츠 캘린더 운영.\n8. **소셜 미디어 관리**: 전략 기획, 게시물 디자인, 숏폼 제작, 팔로워 소통, 성과 분석.\n\n오늘 귀사의 비즈니스에 어떤 서비스를 도와드릴까요?",
    "social": "저희의 **소셜 미디어 관리** 서비스는 브랜드의 디지털 인지도를 높이고 유기적 성장을 이끕니다:\n\n- 소셜 미디어 전략 및 브랜드 포지셔닝\n- 30일 맞춤형 콘텐츠 캘린더 기획\n- 높은 전환율을 이끄는 카드뉴스 및 그래픽 디자인\n- 바이럴 숏폼 영상 및 릴스 제작\n- 프로필 최적화 및 커뮤니티 소통 관리\n- 상세한 성장 지표 및 성과 분석 보고서\n\n귀사 브랜드의 소셜 미디어 현황 분석을 원하시면 언제든 말씀해 주세요!",
    "team": "APX Digital은 전문 기술 역량과 크리에이티브를 갖춘 창업팀이 직접 이끌고 있습니다:\n\n- **Ayush Gupta** — 창립자: 풀스택 소프트웨어 엔지니어 및 AI 솔루션 아키텍트.\n- **Prince Singh** — 공동 창립 파트너: 프론트엔드 엔지니어, UI/UX 시스템 디자이너 및 프로젝트 총괄.\n- **Komal Soni** — 창립 팀원: 기술 개발, 크리에이티브 디자인 및 디지털 미디어 제작.\n\n창업팀과 직접 소통을 원하시면 상단의 \"실시간 상담원 연결\"을 클릭해 주세요!",
    "pricing": "APX Digital은 프로젝트의 범위, 기술 스택, 일정에 맞춘 투명하고 합리적인 견적을 제공하며 불필요한 숨은 비용이 없습니다.\n\n24시간 이내에 맞춤형 제안서를 받아보시려면 **프로젝트 시작하기** 페이지를 방문해 주세요!",
    "contact": "APX Digital 공식 연락처 안내:\n\n- **이메일**: contact@apxdigital.com\n- **전화 / WhatsApp**: +91 9519099011\n- **LinkedIn**: linkedin.com/company/apx-digital-india/\n- **웹사이트**: /contact 또는 /start-project 페이지에서 문의를 남겨주세요.",
    "tagline": "APX Digital의 공식 브랜드 슬로건:\n\n**BUILD • CREATE • INNOVATE**\n\n탁월한 성능의 소프트웨어를 구축하고, 강렬한 시각적 경험을 창조하며, 인공지능으로 미래를 혁신합니다.",
    "fallback": "안녕하세요! APX Digital의 AI 어시스턴트입니다. 저희는 웹 개발, 앱 제작, AI 워크플로 자동화, 영상 편집, 브랜딩, 소셜 미디어 관리를 전문으로 합니다.\n\n원하시는 프로젝트의 내용, 예산, 마감 일정을 알려주시거나 \"실시간 상담원 연결\"을 통해 즉시 상담을 시작해 보세요!"
  },
  "ru": {
    "services": "APX Digital предоставляет 8 ключевых технологических и креативных услуг:\n\n1. **Веб-разработка**: Высокопроизводительные корпоративные сайты, посадочные страницы (Landing Page) и платформы электронной коммерции.\n2. **Разработка приложений**: Динамические веб- и мобильные приложения, удобные административные панели.\n3. **AI-решения и автоматизация**: Индивидуальные AI-чат-боты, автоматизация бизнес-процессов и интеграция языковых моделей.\n4. **Видеомонтаж и моушн-дизайн**: Вирусные короткие видео (Reels/Shorts), полноформатные видео для YouTube и моушн-графика.\n5. **Графический дизайн и брендинг**: Уникальная айдентика бренда, векторные логотипы и рекламные материалы.\n6. **Дизайн презентаций и питч-деков**: Презентации для инвесторов (Pitch Deck), корпоративные отчеты и доклады.\n7. **Цифровой маркетинг и контент**: Стратегические кампании в соцсетях и редакционные планы.\n8. **Управление социальными сетями (SMM)**: Стратегическое планирование, дизайн постов, съемка рилс, работа с аудиторией и аналитика.\n\nКакая услуга актуальна для вашей компании сегодня?",
    "social": "Наша услуга **Управление социальными сетями** помогает бизнесу выстроить авторитет и привлечь органическую аудиторию:\n\n- Стратегия позиционирования в соцсетях\n- Планирование и контент-календари на 30 дней\n- Дизайн постов и каруселей с высокой вовлеченностью\n- Создание вирусных коротких видео (Reels/Shorts)\n- Ежедневное ведение профилей и модерация сообщества\n- Анализ показателей охвата и динамики роста\n\nХотите получить бесплатный аудит присутствия вашего бренда в социальных сетях?",
    "team": "APX Digital создана и управляется командой основателей:\n\n- **Аюш Гупта (Ayush Gupta)** — Основатель: Full-stack разработчик и архитектор AI-систем.\n- **Принс Сингх (Prince Singh)** — Партнер-основатель: Frontend-инженер, UI/UX архитектор и руководитель проектов.\n- **Комал Сони (Komal Soni)** — Член команды основателей: Техническая разработка, креативный дизайн и медиа-производство.\n\nЧтобы связаться с основателями напрямую, нажмите «Связаться с оператором» вверху!",
    "pricing": "В APX Digital стоимость формируется строго индивидуально исходя из объема задач, технологий и сроков, без скрытых платежей.\n\nЧтобы получить детальное коммерческое предложение в течение 24 часов, заполните бриф на странице **Начать проект**!",
    "contact": "Связаться с командой APX Digital можно напрямую:\n\n- **Email**: contact@apxdigital.com\n- **Телефон / WhatsApp**: +91 9519099011\n- **LinkedIn**: linkedin.com/company/apx-digital-india/\n- **Сайт**: Оставьте заявку на страницах /contact или /start-project.",
    "tagline": "Официальный слоган APX Digital:\n\n**BUILD • CREATE • INNOVATE**\n\nМы создаем надежный софт, формируем запоминающийся визуальный стиль и внедряем интеллектуальные AI-решения.",
    "fallback": "Здравствуйте! Я AI-ассистент агентства APX Digital. Мы специализируемся на разработке сайтов и приложений, автоматизации с помощью ИИ, видеомонтаже, брендинге и SMM.\n\nРасскажите о ваших целях, сроках или бюджете проекта, либо нажмите «Связаться с оператором» для живого общения!"
  },
  "it": {
    "services": "APX Digital offre 8 servizi tecnologici e creativi di alto livello:\n\n1. **Sviluppo Siti Web**: Portali aziendali ad alte prestazioni, landing page ad alta conversione ed e-commerce.\n2. **Sviluppo Applicazioni**: Applicazioni web e mobile dinamiche e dashboard amministrative avanzate.\n3. **Soluzioni AI e Automazione**: Chatbot AI personalizzati, automazione dei processi e integrazione di modelli LLM.\n4. **Montaggio Video e Motion Graphics**: Video brevi virali (Reels/Shorts), produzioni YouTube e grafiche animate.\n5. **Graphic Design e Branding**: Sistemi di identità visiva distintivi, loghi vettoriali e materiali promozionali.\n6. **Design Presentazioni e Pitch Deck**: Pitch deck per investitori e presentazioni aziendali strategiche.\n7. **Digital Marketing e Contenuti**: Campagne social media mirate e piani editoriali strategici.\n8. **Gestione Social Media**: Pianificazione strategica, grafica post, produzione reels, gestione community e analisi delle performance.\n\nSu quale servizio possiamo affiancare la tua azienda oggi?",
    "social": "Il nostro servizio di **Gestione Social Media** consolida la presenza del tuo brand e stimola la crescita organica:\n\n- Strategia di posizionamento sui canali social\n- Piani e calendari editoriali completi a 30 giorni\n- Design di grafiche e caroselli ad alto impatto\n- Produzione e montaggio di video brevi e Reels\n- Gestione attiva della community e interazione\n- Report approfonditi sulle performance e crescita\n\nDesideri che il nostro team analizzi la presenza social del tuo marchio?",
    "team": "APX Digital è ideata e guidata dal nostro team di fondatori:\n\n- **Ayush Gupta** — Fondatore: Ingegnere software full-stack e architetto di soluzioni AI.\n- **Prince Singh** — Socio Fondatore: Ingegnere frontend, designer di sistemi UI/UX e responsabile progetti.\n- **Komal Soni** — Membro del Team Fondatore: Sviluppo tecnico, design creativo e produzione digitale.\n\nVuoi parlare direttamente con i nostri fondatori? Clicca su \"Parla con un Operatore\" qui sopra!",
    "pricing": "In APX Digital, formuliamo preventivi trasparenti e calibrati con precisione su portata, tecnologie e tempi del progetto, senza costi imprevisti.\n\nPer ricevere una proposta su misura entro 24 ore, visita la pagina **Avvia un Progetto**!",
    "contact": "Puoi contattare direttamente il team di APX Digital:\n\n- **Email**: contact@apxdigital.com\n- **Telefono / WhatsApp**: +91 9519099011\n- **LinkedIn**: linkedin.com/company/apx-digital-india/\n- **Sito Web**: Compila la richiesta su /contact o /start-project.",
    "tagline": "Il motto ufficiale di APX Digital è:\n\n**BUILD • CREATE • INNOVATE**\n\nSviluppiamo software performante, creiamo esperienze visive straordinarie e innoviamo con l'intelligenza artificiale.",
    "fallback": "Ciao e benvenuto in APX Digital! Sono il tuo assistente AI. Siamo specializzati nello sviluppo di siti e app, automazione con IA, montaggio video, branding e gestione social media.\n\nRaccontami gli obiettivi, le tempistiche o il budget del tuo progetto, oppure clicca su \"Parla con un Operatore\" per chattare in tempo reale!"
  }
};

// POST /api/chat/ai - Knowledge-Grounded AI Assistant (Supports 12 Languages)
app.post('/api/chat/ai', (req, res) => {
  const { message, language } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const userQuery = message.toLowerCase();
  const langKey = aiChatMultilingual[language] ? language : (language === 'hi' ? 'hi' : 'en');
  const dict = aiChatMultilingual[langKey] || aiChatMultilingual['en'];
  let responseText = '';

  if (userQuery.includes('service') || userQuery.includes('offer') || userQuery.includes('what do you do') || userQuery.includes('काम') || userQuery.includes('सर्विस') || userQuery.includes('servicio') || userQuery.includes('leistung') || userQuery.includes('خدم') || userQuery.includes('服务') || userQuery.includes('サービス') || userQuery.includes('서비스') || userQuery.includes('услуг') || userQuery.includes('serviz')) {
    responseText = dict.services;
  } else if (userQuery.includes('social media') || userQuery.includes('smm') || userQuery.includes('सोशल') || userQuery.includes('redes') || userQuery.includes('réseaux') || userQuery.includes('تواصل') || userQuery.includes('社交') || userQuery.includes('соц')) {
    responseText = dict.social;
  } else if (userQuery.includes('team') || userQuery.includes('founder') || userQuery.includes('ayush') || userQuery.includes('prince') || userQuery.includes('komal') || userQuery.includes('टीम') || userQuery.includes('equipo') || userQuery.includes('équipe') || userQuery.includes('فريق') || userQuery.includes('团队') || userQuery.includes('チーム') || userQuery.includes('команд') || userQuery.includes('squadra')) {
    responseText = dict.team;
  } else if (userQuery.includes('price') || userQuery.includes('cost') || userQuery.includes('budget') || userQuery.includes('रेट') || userQuery.includes('फीस') || userQuery.includes('कीमत') || userQuery.includes('precio') || userQuery.includes('prix') || userQuery.includes('preis') || userQuery.includes('preço') || userQuery.includes('سعر') || userQuery.includes('价格') || userQuery.includes('価格') || userQuery.includes('가격') || userQuery.includes('цен') || userQuery.includes('prezzo')) {
    responseText = dict.pricing;
  } else if (userQuery.includes('contact') || userQuery.includes('email') || userQuery.includes('phone') || userQuery.includes('संपर्क') || userQuery.includes('contacto') || userQuery.includes('kontakt') || userQuery.includes('contato') || userQuery.includes('اتصال') || userQuery.includes('联系') || userQuery.includes('連絡') || userQuery.includes('연락') || userQuery.includes('контакт') || userQuery.includes('contatt')) {
    responseText = dict.contact;
  } else if (userQuery.includes('tagline') || userQuery.includes('motto') || userQuery.includes('slogan') || userQuery.includes('स्लोगन')) {
    responseText = dict.tagline;
  } else {
    responseText = dict.fallback;
  }

  return res.json({
    reply: responseText,
    sender: 'ai',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// ADMIN API ROUTES (Protected)
// ==========================================

// POST /api/admin/login
app.post('/api/admin/login', (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const ipRecord = loginAttempts.get(clientIp) || { count: 0, lastAttempt: 0 };

  // Rate limiting: 5 failed attempts in 1 minute
  if (ipRecord.count >= 5 && (now - ipRecord.lastAttempt) < 60000) {
    return res.status(429).json({ error: 'Too many failed login attempts. Please wait 60 seconds.' });
  }

  const { username, email, password } = req.body;
  const userIdentifier = (username || email || '').trim();
  const inputPassword = (password || '').trim();

  if (!userIdentifier || !inputPassword) {
    return res.status(400).json({ error: 'Username/Email and Password are required.' });
  }

  try {
    const adminStmt = db.prepare('SELECT * FROM admins WHERE username = ? OR email = ?');
    const admin = adminStmt.get(userIdentifier, userIdentifier);

    if (!admin) {
      ipRecord.count += 1;
      ipRecord.lastAttempt = now;
      loginAttempts.set(clientIp, ipRecord);
      return res.status(401).json({ error: 'Invalid administrator credentials.' });
    }

    const passwordMatch = bcrypt.compareSync(inputPassword, admin.password_hash);
    if (!passwordMatch) {
      ipRecord.count += 1;
      ipRecord.lastAttempt = now;
      loginAttempts.set(clientIp, ipRecord);
      return res.status(401).json({ error: 'Invalid administrator credentials.' });
    }

    // Reset rate limiter on successful authentication
    loginAttempts.delete(clientIp);

    const token = generateToken(admin.id, admin.email, admin.username);
    logActivity('auth', 'Admin Login Successful', `Admin ${admin.username} (${admin.name}) authenticated.`);

    return res.json({
      success: true,
      token,
      must_change_password: Boolean(admin.must_change_password),
      user: {
        id: admin.id,
        name: admin.name,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        agency: 'APX Digital'
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ error: 'Authentication service encountered an error.' });
  }
});

// POST /api/admin/change-password (Mandatory on First Login or via Settings)
app.post('/api/admin/change-password', requireAdmin, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const adminId = req.admin.id;

  if (!newPassword || newPassword.trim().length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters in length.' });
  }

  try {
    const adminStmt = db.prepare('SELECT * FROM admins WHERE id = ?');
    const admin = adminStmt.get(adminId);

    if (!admin) {
      return res.status(404).json({ error: 'Admin record not found.' });
    }

    // If current password provided, verify it
    if (currentPassword) {
      const isMatch = bcrypt.compareSync(currentPassword.trim(), admin.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password does not match.' });
      }
    }

    const saltRounds = 10;
    const newHash = bcrypt.hashSync(newPassword.trim(), saltRounds);
    const now = new Date().toISOString();

    const updateStmt = db.prepare(`
      UPDATE admins 
      SET password_hash = ?, must_change_password = 0, updated_at = ? 
      WHERE id = ?
    `);
    updateStmt.run(newHash, now, adminId);

    logActivity('auth', 'Admin Password Updated', `Admin ${admin.username} successfully set a permanent personal password.`);

    return res.json({
      success: true,
      message: 'Your administrator password has been permanently updated. Temporary credentials revoked.'
    });
  } catch (err) {
    console.error('Password change error:', err);
    return res.status(500).json({ error: 'Failed to update administrator password.' });
  }
});

// GET /api/admin/metrics
app.get('/api/admin/metrics', requireAdmin, (req, res) => {
  try {
    const totalMsgStmt = db.prepare('SELECT COUNT(*) as count FROM messages');
    const totalMessages = totalMsgStmt.get().count;

    const newMsgStmt = db.prepare("SELECT COUNT(*) as count FROM messages WHERE status = 'New'");
    const newMessages = newMsgStmt.get().count;

    const repliedMsgStmt = db.prepare("SELECT COUNT(*) as count FROM messages WHERE status = 'Replied'");
    const repliedMessages = repliedMsgStmt.get().count;

    const closedMsgStmt = db.prepare("SELECT COUNT(*) as count FROM messages WHERE status = 'Closed'");
    const closedMessages = closedMsgStmt.get().count;

    const activeChatsStmt = db.prepare("SELECT COUNT(*) as count FROM chat_conversations WHERE status = 'active'");
    const activeChats = activeChatsStmt.get().count;

    const inquiriesStmt = db.prepare("SELECT COUNT(*) as count FROM messages WHERE source = 'inquiry'");
    const totalInquiries = inquiriesStmt.get().count;

    const projStmt = db.prepare('SELECT COUNT(*) as count FROM portfolio_projects');
    const totalProjects = projStmt.get().count;

    const activitiesStmt = db.prepare('SELECT * FROM activities ORDER BY created_at DESC LIMIT 10');
    const recentActivities = activitiesStmt.all();

    return res.json({
      totalMessages,
      newMessages,
      repliedMessages,
      closedMessages,
      activeChats,
      totalInquiries,
      totalProjects,
      recentActivities
    });
  } catch (err) {
    console.error('Metrics error:', err);
    return res.status(500).json({ error: 'Failed to retrieve metrics' });
  }
});

// GET /api/admin/activities - Real Activity Logs
app.get('/api/admin/activities', requireAdmin, (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM activities ORDER BY created_at DESC LIMIT 50');
    const activities = stmt.all();
    return res.json({ success: true, activities });
  } catch (err) {
    console.error('Activities query error:', err);
    return res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

// GET /api/admin/notifications - Real Database Notifications
app.get('/api/admin/notifications', requireAdmin, (req, res) => {
  try {
    const unreadCount = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE is_read = 0').get().count;
    const recentNotifs = db.prepare('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 20').all();
    return res.json({ success: true, unreadCount, notifications: recentNotifs });
  } catch (err) {
    console.error('Notifications query error:', err);
    return res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// GET /api/admin/messages - Search & Filter Inquiries
app.get('/api/admin/messages', requireAdmin, (req, res) => {
  const { search, status, source } = req.query;

  try {
    let sql = `
      SELECT m.*, 
        (SELECT COUNT(*) FROM message_replies r WHERE r.message_id = m.id) as reply_count
      FROM messages m
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'All') {
      sql += ' AND m.status = ?';
      params.push(status);
    }

    if (source && source !== 'All') {
      sql += ' AND m.source = ?';
      params.push(source);
    }

    if (search && search.trim()) {
      sql += ' AND (m.name LIKE ? OR m.email LIKE ? OR m.subject LIKE ? OR m.message LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    sql += ' ORDER BY m.created_at DESC';

    const stmt = db.prepare(sql);
    const messages = stmt.all(...params);

    return res.json({ messages });
  } catch (err) {
    console.error('Fetch messages error:', err);
    return res.status(500).json({ error: 'Failed to query messages database' });
  }
});

// GET /api/admin/messages/:id - Detailed Message & Threaded Replies
app.get('/api/admin/messages/:id', requireAdmin, (req, res) => {
  const { id } = req.params;

  try {
    const msgStmt = db.prepare('SELECT * FROM messages WHERE id = ?');
    const message = msgStmt.get(id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const repliesStmt = db.prepare('SELECT * FROM message_replies WHERE message_id = ? ORDER BY created_at ASC');
    const replies = repliesStmt.all(id);

    return res.json({ message, replies });
  } catch (err) {
    console.error('Fetch message detail error:', err);
    return res.status(500).json({ error: 'Failed to load message conversation' });
  }
});

// PATCH /api/admin/messages/:id - Update Status
app.patch('/api/admin/messages/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['New', 'Read', 'Replied', 'Closed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const now = new Date().toISOString();
    const stmt = db.prepare('UPDATE messages SET status = ?, updated_at = ? WHERE id = ?');
    stmt.run(status, now, id);

    logActivity('status', `Message Status: ${status}`, `Inquiry ID ${id} transitioned to ${status}`);

    return res.json({ success: true, message: 'Status updated', status });
  } catch (err) {
    console.error('Update status error:', err);
    return res.status(500).json({ error: 'Failed to update message status' });
  }
});

// POST /api/admin/messages/:id/reply - Reply to Customer
app.post('/api/admin/messages/:id/reply', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { replyText, senderName } = req.body;

  if (!replyText || !replyText.trim()) {
    return res.status(400).json({ error: 'Reply text cannot be empty' });
  }

  const replyId = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const sender = req.admin.email;
  const sName = senderName || req.admin.name || 'Ayush Gupta (Founder)';

  try {
    // 1. Insert reply record
    const insertReply = db.prepare(`
      INSERT INTO message_replies (id, message_id, sender, sender_name, reply_text, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertReply.run(replyId, id, sender, sName, replyText.trim(), now);

    // 2. Mark message as Replied
    const updateMsg = db.prepare("UPDATE messages SET status = 'Replied', updated_at = ? WHERE id = ?");
    updateMsg.run(now, id);

    logActivity('reply', `Admin Replied to Inquiry`, `Message ID ${id} answered by ${sName}`);

    return res.status(201).json({
      success: true,
      reply: {
        id: replyId,
        message_id: id,
        sender,
        sender_name: sName,
        reply_text: replyText.trim(),
        created_at: now
      }
    });
  } catch (err) {
    console.error('Reply error:', err);
    return res.status(500).json({ error: 'Failed to store reply in database' });
  }
});

// DELETE /api/admin/messages/:id
app.delete('/api/admin/messages/:id', requireAdmin, (req, res) => {
  const { id } = req.params;

  try {
    const delReplies = db.prepare('DELETE FROM message_replies WHERE message_id = ?');
    delReplies.run(id);

    const delMsg = db.prepare('DELETE FROM messages WHERE id = ?');
    delMsg.run(id);

    logActivity('delete', `Message Deleted: ${id}`, 'Message and thread permanently removed.');

    return res.json({ success: true, message: 'Message deleted successfully.' });
  } catch (err) {
    console.error('Delete message error:', err);
    return res.status(500).json({ error: 'Failed to delete message' });
  }
});

// ==========================================
// PORTFOLIO CRUD (Admin Protected)
// ==========================================

// GET /api/admin/portfolio - All Projects (Published + Draft)
app.get('/api/admin/portfolio', requireAdmin, (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM portfolio_projects ORDER BY created_at DESC');
    const projects = stmt.all().map(p => ({
      ...p,
      technologies: JSON.parse(p.technologies || '[]'),
      gallery_images: JSON.parse(p.gallery_images || '[]'),
      is_featured: Boolean(p.is_featured)
    }));
    return res.json({ success: true, projects });
  } catch (err) {
    console.error('Admin portfolio list error:', err);
    return res.status(500).json({ error: 'Failed to load portfolio database.' });
  }
});

// POST /api/admin/portfolio - Add New Project
app.post('/api/admin/portfolio', requireAdmin, (req, res) => {
  const {
    title,
    slug,
    short_description,
    full_description,
    category,
    technologies,
    thumbnail_url,
    gallery_images,
    live_url,
    github_url,
    case_study_url,
    completion_date,
    is_featured,
    status
  } = req.body;

  if (!title || !short_description || !category || !thumbnail_url) {
    return res.status(400).json({ error: 'Title, short description, category, and thumbnail URL are required.' });
  }

  const id = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const projectSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) + `-${Date.now().toString(36)}`;
  const now = new Date().toISOString();

  const techJson = typeof technologies === 'string' 
    ? JSON.stringify(technologies.split(',').map(t => t.trim()).filter(Boolean))
    : JSON.stringify(technologies || []);

  const galleryJson = typeof gallery_images === 'string'
    ? JSON.stringify(gallery_images.split(',').map(g => g.trim()).filter(Boolean))
    : JSON.stringify(gallery_images || []);

  try {
    const stmt = db.prepare(`
      INSERT INTO portfolio_projects (
        id, title, slug, short_description, full_description, category, technologies,
        thumbnail_url, gallery_images, live_url, github_url, case_study_url, completion_date,
        is_featured, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      title.trim(),
      projectSlug,
      short_description.trim(),
      (full_description || '').trim(),
      category.trim(),
      techJson,
      thumbnail_url.trim(),
      galleryJson,
      (live_url || '').trim(),
      (github_url || '').trim(),
      (case_study_url || '').trim(),
      (completion_date || '').trim(),
      is_featured ? 1 : 0,
      status === 'Draft' ? 'Draft' : 'Published',
      now,
      now
    );

    logActivity('portfolio', `New Project Added: ${title}`, `Status: ${status || 'Published'}, Category: ${category}`);

    return res.status(201).json({
      success: true,
      message: 'Portfolio project created successfully.',
      project: {
        id,
        title,
        slug: projectSlug,
        status: status || 'Published'
      }
    });
  } catch (err) {
    console.error('Create portfolio project error:', err);
    return res.status(500).json({ error: 'Database error creating project: ' + err.message });
  }
});

// PUT /api/admin/portfolio/:id - Edit Existing Project
app.put('/api/admin/portfolio/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const {
    title,
    slug,
    short_description,
    full_description,
    category,
    technologies,
    thumbnail_url,
    gallery_images,
    live_url,
    github_url,
    case_study_url,
    completion_date,
    is_featured,
    status
  } = req.body;

  try {
    const existing = db.prepare('SELECT * FROM portfolio_projects WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const now = new Date().toISOString();
    const techJson = typeof technologies === 'string'
      ? JSON.stringify(technologies.split(',').map(t => t.trim()).filter(Boolean))
      : JSON.stringify(technologies || JSON.parse(existing.technologies || '[]'));

    const galleryJson = typeof gallery_images === 'string'
      ? JSON.stringify(gallery_images.split(',').map(g => g.trim()).filter(Boolean))
      : JSON.stringify(gallery_images || JSON.parse(existing.gallery_images || '[]'));

    const updateStmt = db.prepare(`
      UPDATE portfolio_projects SET
        title = ?,
        slug = ?,
        short_description = ?,
        full_description = ?,
        category = ?,
        technologies = ?,
        thumbnail_url = ?,
        gallery_images = ?,
        live_url = ?,
        github_url = ?,
        case_study_url = ?,
        completion_date = ?,
        is_featured = ?,
        status = ?,
        updated_at = ?
      WHERE id = ?
    `);

    updateStmt.run(
      title ? title.trim() : existing.title,
      slug ? slug.trim() : existing.slug,
      short_description ? short_description.trim() : existing.short_description,
      full_description !== undefined ? full_description.trim() : existing.full_description,
      category ? category.trim() : existing.category,
      techJson,
      thumbnail_url ? thumbnail_url.trim() : existing.thumbnail_url,
      galleryJson,
      live_url !== undefined ? live_url.trim() : existing.live_url,
      github_url !== undefined ? github_url.trim() : existing.github_url,
      case_study_url !== undefined ? case_study_url.trim() : existing.case_study_url,
      completion_date !== undefined ? completion_date.trim() : existing.completion_date,
      is_featured !== undefined ? (is_featured ? 1 : 0) : existing.is_featured,
      status ? status : existing.status,
      now,
      id
    );

    logActivity('portfolio', `Project Updated: ${title || existing.title}`, `Status: ${status || existing.status}`);

    return res.json({ success: true, message: 'Project updated successfully.' });
  } catch (err) {
    console.error('Update portfolio project error:', err);
    return res.status(500).json({ error: 'Failed to update project: ' + err.message });
  }
});

// DELETE /api/admin/portfolio/:id - Delete Project
app.delete('/api/admin/portfolio/:id', requireAdmin, (req, res) => {
  const { id } = req.params;

  try {
    const existing = db.prepare('SELECT title FROM portfolio_projects WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const delStmt = db.prepare('DELETE FROM portfolio_projects WHERE id = ?');
    delStmt.run(id);

    logActivity('portfolio', `Project Deleted: ${existing.title}`, `Project ID ${id} removed.`);

    return res.json({ success: true, message: 'Project removed from database.' });
  } catch (err) {
    console.error('Delete portfolio project error:', err);
    return res.status(500).json({ error: 'Failed to delete portfolio project' });
  }
});

// GET /api/admin/conversations - Live Chat Threads
app.get('/api/admin/conversations', requireAdmin, (req, res) => {
  try {
    const convStmt = db.prepare(`
      SELECT c.*,
        (SELECT message FROM chat_messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM chat_messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message_time
      FROM chat_conversations c
      ORDER BY c.last_activity DESC
    `);
    const conversations = convStmt.all();
    return res.json({ conversations });
  } catch (err) {
    console.error('Conversations error:', err);
    return res.status(500).json({ error: 'Failed to load chat conversations' });
  }
});

// GET /api/admin/conversations/:id/messages
app.get('/api/admin/conversations/:id/messages', requireAdmin, (req, res) => {
  const { id } = req.params;
  try {
    const stmt = db.prepare('SELECT * FROM chat_messages WHERE conversation_id = ? ORDER BY created_at ASC');
    const messages = stmt.all(id);
    return res.json({ messages });
  } catch (err) {
    console.error('Conversation messages error:', err);
    return res.status(500).json({ error: 'Failed to load conversation history' });
  }
});

// GET /api/services-tools - Public Services Tools List
app.get('/api/services-tools', (req, res) => {
  try {
    const tools = db.prepare('SELECT * FROM services_tools WHERE is_visible = 1').all().map(t => ({
      ...t,
      features: JSON.parse(t.features || '[]'),
      is_free: Boolean(t.is_free),
      is_visible: Boolean(t.is_visible)
    }));
    return res.json({ success: true, tools });
  } catch (err) {
    console.error('Fetch services tools error:', err);
    return res.status(500).json({ error: 'Failed to fetch services tools' });
  }
});

// GET /api/admin/services-tools - Admin Services Tools List
app.get('/api/admin/services-tools', requireAdmin, (req, res) => {
  try {
    const tools = db.prepare('SELECT * FROM services_tools').all().map(t => ({
      ...t,
      features: JSON.parse(t.features || '[]'),
      is_free: Boolean(t.is_free),
      is_visible: Boolean(t.is_visible)
    }));
    return res.json({ success: true, tools });
  } catch (err) {
    console.error('Fetch admin services tools error:', err);
    return res.status(500).json({ error: 'Failed to fetch services tools for admin' });
  }
});

// PUT /api/admin/services-tools/:id - Admin Update Services Tool
app.put('/api/admin/services-tools/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { title, description, url, badge, is_free, is_visible, features } = req.body;
  try {
    const existing = db.prepare('SELECT * FROM services_tools WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    const now = new Date().toISOString();
    const updateStmt = db.prepare(`
      UPDATE services_tools
      SET title = ?, description = ?, url = ?, badge = ?, is_free = ?, is_visible = ?, features = ?, updated_at = ?
      WHERE id = ?
    `);
    const featJson = Array.isArray(features) ? JSON.stringify(features) : (existing.features || '[]');
    updateStmt.run(
      (title !== undefined ? title : existing.title).trim(),
      (description !== undefined ? description : existing.description).trim(),
      (url !== undefined ? url : existing.url).trim(),
      (badge !== undefined ? badge : existing.badge).trim(),
      is_free !== undefined ? (is_free ? 1 : 0) : existing.is_free,
      is_visible !== undefined ? (is_visible ? 1 : 0) : existing.is_visible,
      featJson,
      now,
      id
    );
    logActivity('services', `Service Tool Updated: ${title || existing.title}`, `URL: ${url || existing.url}`);
    return res.json({ success: true, message: 'Tool updated successfully' });
  } catch (err) {
    console.error('Update services tool error:', err);
    return res.status(500).json({ error: 'Failed to update tool: ' + err.message });
  }
});

// ==========================================
// WEBSOCKET SERVER FOR REAL-TIME LIVE CHAT
// ==========================================

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

// Track connected sockets
const adminSockets = new Set();
const visitorSockets = new Map(); // conversationId -> WebSocket

function broadcastToAdmins(payload) {
  const data = JSON.stringify(payload);
  for (const client of adminSockets) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

wss.on('connection', (ws) => {
  let clientType = 'unknown';
  let currentConvId = null;

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());

      // 1. Admin Authentication via WS
      if (msg.type === 'admin:auth') {
        const decoded = verifyToken(msg.token);
        if (decoded) {
          clientType = 'admin';
          adminSockets.add(ws);
          ws.send(JSON.stringify({ type: 'admin:auth_success', activeAdmins: adminSockets.size }));
          // Notify any pending visitors that an admin is online
          for (const [, vWs] of visitorSockets) {
            if (vWs.readyState === WebSocket.OPEN) {
              vWs.send(JSON.stringify({ type: 'system:status', online: true, message: 'An APX Digital specialist is online and ready to assist you.' }));
            }
          }
        } else {
          ws.send(JSON.stringify({ type: 'admin:auth_failed' }));
        }
      }

      // 2. Visitor Initializes Live Chat
      else if (msg.type === 'visitor:init') {
        const { visitorId, name, email, conversationId } = msg;
        clientType = 'visitor';
        const convId = conversationId || `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        currentConvId = convId;
        visitorSockets.set(convId, ws);

        const now = new Date().toISOString();

        // Check if conversation exists
        const checkStmt = db.prepare('SELECT * FROM chat_conversations WHERE id = ?');
        let conv = checkStmt.get(convId);
        if (!conv) {
          const insertConv = db.prepare(`
            INSERT INTO chat_conversations (id, visitor_id, visitor_name, visitor_email, status, unread_admin, created_at, last_activity)
            VALUES (?, ?, ?, ?, 'active', 1, ?, ?)
          `);
          insertConv.run(convId, visitorId || 'anon', name || 'Visitor', email || '', now, now);
        }

        const isAdminOnline = adminSockets.size > 0;

        // Send confirmation & history back to visitor
        const historyStmt = db.prepare('SELECT * FROM chat_messages WHERE conversation_id = ? ORDER BY created_at ASC');
        const history = historyStmt.all(convId);

        ws.send(JSON.stringify({
          type: 'visitor:ready',
          conversationId: convId,
          online: isAdminOnline,
          statusMessage: isAdminOnline 
            ? 'An APX Digital specialist is online and ready to assist you.' 
            : "Our team is currently unavailable. Please leave your message, and we'll get back to you.",
          history
        }));

        // Notify admins about active visitor session
        broadcastToAdmins({
          type: 'admin:visitor_joined',
          conversation: { id: convId, visitor_name: name, visitor_email: email, last_activity: now }
        });
      }

      // 3. Visitor Sends Message
      else if (msg.type === 'visitor:message') {
        const { conversationId, text, senderName } = msg;
        if (!text || !text.trim() || !conversationId) return;

        const msgId = `cmsg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const now = new Date().toISOString();
        const sName = senderName || 'Visitor';

        // Store message
        const insertStmt = db.prepare(`
          INSERT INTO chat_messages (id, conversation_id, sender, sender_name, message, created_at)
          VALUES (?, ?, 'visitor', ?, ?, ?)
        `);
        insertStmt.run(msgId, conversationId, sName, text.trim(), now);

        // Update conversation activity
        const updateConv = db.prepare(`
          UPDATE chat_conversations 
          SET last_activity = ?, unread_admin = unread_admin + 1 
          WHERE id = ?
        `);
        updateConv.run(now, conversationId);

        const payload = {
          id: msgId,
          conversation_id: conversationId,
          sender: 'visitor',
          sender_name: sName,
          message: text.trim(),
          created_at: now
        };

        ws.send(JSON.stringify({ type: 'chat:message_ack', ...payload }));

        broadcastToAdmins({
          type: 'chat:new_message',
          ...payload
        });
      }

      // 4. Admin Sends Reply
      else if (msg.type === 'admin:message') {
        const { conversationId, text, senderName } = msg;
        if (!text || !text.trim() || !conversationId) return;

        const msgId = `cmsg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const now = new Date().toISOString();
        const sName = senderName || 'Ayush Gupta (Founder)';

        // Store message
        const insertStmt = db.prepare(`
          INSERT INTO chat_messages (id, conversation_id, sender, sender_name, message, created_at)
          VALUES (?, ?, 'admin', ?, ?, ?)
        `);
        insertStmt.run(msgId, conversationId, sName, text.trim(), now);

        const updateConv = db.prepare(`
          UPDATE chat_conversations 
          SET last_activity = ?, unread_admin = 0 
          WHERE id = ?
        `);
        updateConv.run(now, conversationId);

        const payload = {
          id: msgId,
          conversation_id: conversationId,
          sender: 'admin',
          sender_name: sName,
          message: text.trim(),
          created_at: now
        };

        // Send to visitor socket if connected
        const vWs = visitorSockets.get(conversationId);
        if (vWs && vWs.readyState === WebSocket.OPEN) {
          vWs.send(JSON.stringify({ type: 'chat:new_message', ...payload }));
        }

        // Echo to all admin sockets so other admin windows see it
        broadcastToAdmins({
          type: 'chat:new_message',
          ...payload
        });
      }

    } catch (e) {
      console.error('WebSocket message parsing error:', e);
    }
  });

  ws.on('close', () => {
    if (clientType === 'admin') {
      adminSockets.delete(ws);
      if (adminSockets.size === 0) {
        for (const [, vWs] of visitorSockets) {
          if (vWs.readyState === WebSocket.OPEN) {
            vWs.send(JSON.stringify({
              type: 'system:status',
              online: false,
              message: "Our team is currently unavailable. Please leave your message, and we'll get back to you."
            }));
          }
        }
      }
    } else if (clientType === 'visitor' && currentConvId) {
      visitorSockets.delete(currentConvId);
    }
  });
});

if (!isVercel) {
  server.listen(PORT, '127.0.0.1', () => {
    console.log(`[APX Server] Running on http://127.0.0.1:${PORT}`);
    console.log(`[APX Server] Native SQLite Database: ${dbPath}`);
    console.log(`[APX Server] Real-Time WebSockets initialized on path /ws`);
  });
}

export default app;
