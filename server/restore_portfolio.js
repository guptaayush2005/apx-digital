import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'data', 'apx.db');

const db = new DatabaseSync(dbPath);

// Set AapdaSetu to Draft (preserving data in database, not deleting)
const updateDraft = db.prepare(`
  UPDATE portfolio_projects 
  SET status = 'Draft', is_featured = 0 
  WHERE id = 'proj_init_1' OR slug LIKE '%aapda%'
`);
updateDraft.run();

// Check if Ayush Service Center exists
const existing = db.prepare("SELECT * FROM portfolio_projects WHERE id = 'ayush-service-center'").get();
const now = new Date().toISOString();

if (existing) {
  const updateAyush = db.prepare(`
    UPDATE portfolio_projects 
    SET title = ?, slug = ?, short_description = ?, full_description = ?, category = ?, technologies = ?, thumbnail_url = ?, gallery_images = ?, live_url = ?, is_featured = 1, status = 'Published', updated_at = ?
    WHERE id = 'ayush-service-center'
  `);
  updateAyush.run(
    'Ayush Service Center — Store Management Website & Admin Dashboard',
    'ayush-service-center-store',
    'Complete business website and dynamic store management platform with Firebase Firestore & Authentication.',
    'A full-stack business web platform built to give a local retail business an online presence and a real-time product management workflow. Features an authenticated Admin Dashboard to dynamically add, edit, and update store items and inventory without altering code, backed by Firebase Firestore NoSQL database and secure Firebase Authentication.',
    'Website Development',
    JSON.stringify(['HTML5', 'CSS3', 'JavaScript', 'Firebase Firestore', 'Firebase Authentication', 'Firebase Hosting', 'Dynamic Admin Dashboard']),
    '/projects/ayush-service-center.jpg',
    JSON.stringify(['/projects/ayush-service-center.jpg']),
    'https://lnkd.in/p/gXGmXQrv',
    now
  );
} else {
  const insertAyush = db.prepare(`
    INSERT INTO portfolio_projects (
      id, title, slug, short_description, full_description, category, technologies,
      thumbnail_url, gallery_images, live_url, github_url, case_study_url, completion_date,
      is_featured, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertAyush.run(
    'ayush-service-center',
    'Ayush Service Center — Store Management Website & Admin Dashboard',
    'ayush-service-center-store',
    'Complete business website and dynamic store management platform with Firebase Firestore & Authentication.',
    'A full-stack business web platform built to give a local retail business an online presence and a real-time product management workflow. Features an authenticated Admin Dashboard to dynamically add, edit, and update store items and inventory without altering code, backed by Firebase Firestore NoSQL database and secure Firebase Authentication.',
    'Website Development',
    JSON.stringify(['HTML5', 'CSS3', 'JavaScript', 'Firebase Firestore', 'Firebase Authentication', 'Firebase Hosting', 'Dynamic Admin Dashboard']),
    '/projects/ayush-service-center.jpg',
    JSON.stringify(['/projects/ayush-service-center.jpg']),
    'https://lnkd.in/p/gXGmXQrv',
    null,
    null,
    '2025-11',
    1,
    'Published',
    now,
    now
  );
}

console.log('Portfolio projects in SQLite:');
console.log(db.prepare('SELECT id, title, status, is_featured, thumbnail_url, live_url FROM portfolio_projects').all());
