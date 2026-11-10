# APX DIGITAL — Production Architecture & Administration Guide

## 1. Overview
APX DIGITAL is built with a high-performance modern web stack featuring:
- **Frontend**: React 19, TypeScript, Vite, Framer Motion, Vanilla CSS with obsidian dark theme and orange-gold accents.
- **Backend API & WebSockets**: Node.js, Express, WebSocket (`ws`), Bcrypt salted hashing, Database adapter (PostgreSQL & SQLite).
- **ORM & Data Models**: SQLAlchemy 2.0 models (`database/models.py`) and PostgreSQL schema (`database/schema.sql`).

---

## 2. Team Profiles Layout & Professional Highlights
All three team profiles in `src/pages/TeamPage.tsx` use a balanced two-column CSS Grid (`minmax(300px, 38%) 1fr` on desktop, stacking seamlessly on mobile):

### Left Column (~40% width):
1. **Original Professional Photograph**: High-resolution portrait with face framing and gold role badge overlay.
2. **Name and Designation**: Prominently displayed with crisp typography.
3. **LinkedIn / GitHub / Email buttons**: Quick access channels.
4. **Professional Highlights Card**: Positioned immediately below the social buttons, formatted as a glassmorphism card with orange checkmarks (`CheckCircle2`).
   - **Ayush Gupta**: Founder of APX Digital, Full-stack web dev & backend API dev, Python/FastAPI/JavaScript/Firebase, AI/ML & workflow automation, Hack-A-Geek Runner-Up, Build with Bharat 4.0 Top 25 Finalist, SIH Internal Hackathon Top 30.
   - **Prince Singh**: Founding Partner at APX Digital, Python and C programming, HTML/CSS/JavaScript, Software product development, Hackathons: Zinnovatio 3.0 & Internal SIH 2025, Campus ambassador, NASSCOM & Skill India Digital Hub Software Product Developer certification.
   - **Komal Soni**: Founding Team Member at APX Digital, Java and Python, HTML/CSS/JavaScript, Data Structures and Algorithms, OOP and SQL, Flash Flood Prediction System project, KCC National Hackathon participation.
5. **Verified Direct Channel**: Direct WhatsApp inquiry link.

### Right Column (~60% width):
- **Professional Biography**: Complete career narrative.
- **Education**: Institution and degree.
- **Core Technical Skills & Expertise**: Categorized skill pills.
- **Key Projects & Architecture**: High-impact systems.
- **Achievements, Hackathons & Honors**: Research papers and podium finishes.
- **Certifications**: Industry credentials.

---

## 3. Single-Column Vertical Language Dropdown
Located in the navbar (`src/components/LanguageToggle.tsx`):
- Displays all 12 supported international languages in a **single vertical column** directly below the globe icon:
  1. English
  2. हिन्दी (Hindi)
  3. Español (Spanish)
  4. Français (French)
  5. Deutsch (German)
  6. Português (Portuguese)
  7. العربية (Arabic)
  8. 简体中文 (Chinese)
  9. 日本語 (Japanese)
  10. 한국어 (Korean)
  11. Русский (Russian)
  12. Italiano (Italian)
- Active language is highlighted with an orange background and checkmark (`✓`).
- Vertically scrollable if height constrained (`max-height: min(420px, calc(100vh - 100px))`).
- Outside-click detection and smooth CSS animations.

---

## 4. Admin Authentication & Security
- **Access Route**: `/admin/login` (accessible via the `ShieldCheck` icon in the navbar or direct URL).
- **Initial Temporary Credentials**:
  - **Username**: `APK` (or email: `admin@apxdigital.com`)
  - **Password**: `2589`
- **Security Features**:
  - Passwords stored as salted bcrypt hashes (`bcrypt.hashSync(..., 10)`).
  - Rate limiting protects against brute force attacks (max 5 failed attempts per minute).
  - **Mandatory Password Change**: On first login with temporary password `"2589"`, the administrator is prompted with a modal to set a permanent personal password (minimum 6 characters).
  - Signed HMAC SHA-256 tokens authenticate subsequent requests.
  - Show/Hide password toggle for user convenience.

---

## 5. Clickable Admin Dashboard & CRM
Located at `/admin/dashboard`:
- **Clickable Metric Cards**:
  - `Total Inquiries` → Opens Inbox with all customer messages.
  - `New Messages` → Filters Inbox to show only unread submissions.
  - `Replied` → Filters Inbox to show answered inquiries.
  - `Active Live Chats` → Launches the real-time live chat operator console.
  - `Total Projects` → Navigates to Website CMS / Portfolio management.
- **Audit Log**: Live database activity records tracking logins, submissions, replies, and content edits.
- **Notification Bell**: Displays live unread counts for customer messages.

---

## 6. Portfolio Management (CRUD)
Inside the **Website CMS** tab:
- **Add New Project**: Modal to create a project with Title, Slug, Short Description, Full Description, Category, Technologies, Thumbnail URL, Gallery Images, Live URL, GitHub URL, Case Study URL, Featured toggle, and Status (`Published` / `Draft`).
- **Edit Project**: Modify any project details or replace thumbnails.
- **Delete Project**: Remove projects with a confirmation safety prompt.
- **Public Our Work Page Integration**: `PortfolioPage.tsx` fetches from `/api/portfolio` and only displays `Published` projects, featuring the approved project (`https://ayush-hardware-general-store.vercel.app/`) as the initial flagship entry.

---

## 7. PostgreSQL Database Setup Instructions
To point the application to your local PostgreSQL instance:
1. Ensure the PostgreSQL service is active (`postgresql-x64-18`).
2. Create the target database:
   ```bash
   createdb -U postgres apx_digital
   ```
3. Initialize tables using the provided schema:
   ```bash
   psql -U postgres -d apx_digital -f database/schema.sql
   ```
4. Copy `.env.example` to `.env` and set your database connection string:
   ```env
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/apx_digital
   PORT=5000
   ```
5. Restart the server (`node server/server.js`).
