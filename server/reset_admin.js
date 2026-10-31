import bcrypt from 'bcryptjs';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';

const dbPath = path.join(process.cwd(), 'data', 'apx.db');
const db = new DatabaseSync(dbPath);

const hash = bcrypt.hashSync('2589', 10);
const now = new Date().toISOString();

const stmt = db.prepare('UPDATE admins SET password_hash = ?, must_change_password = 1, updated_at = ? WHERE username = ?');
stmt.run(hash, now, 'APK');

const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get('APK');
console.log('Admin record successfully reset:');
console.log('Username:', admin.username);
console.log('Email:', admin.email);
console.log('must_change_password:', admin.must_change_password);
console.log('Verified 2589 match:', bcrypt.compareSync('2589', admin.password_hash));
