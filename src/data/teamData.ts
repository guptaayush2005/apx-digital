export interface SkillCategory {
  category: { en: string; hi: string };
  skills: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  designation: { en: string; hi: string };
  officialRole: 'FOUNDER' | 'CO-FOUNDER' | 'FOUNDING PARTNER' | 'FOUNDING TEAM MEMBER';
  photoUrl: string;
  education: { en: string; hi: string };
  summary: { en: string; hi: string };
  technicalSkills: string[];
  categorizedSkills?: SkillCategory[];
  professionalHighlights: { en: string[]; hi: string[] };
  keyProjects: { en: string[]; hi: string[] };
  achievements: { en: string[]; hi: string[] };
  certifications: string[];
  socials: {
    linkedin?: string;
    github?: string;
    email?: string;
    whatsapp?: string;
  };
}

export const teamData: TeamMember[] = [
  {
    id: 'ayush-gupta',
    name: 'Ayush Gupta',
    officialRole: 'FOUNDER',
    designation: {
      en: 'FOUNDER',
      hi: 'संस्थापक (FOUNDER)',
    },
    photoUrl: '/team/ayush-gupta.jpg',
    education: {
      en: 'B.Tech in Computer Science & Information Technology — Dronacharya Group of Institutions, Greater Noida',
      hi: 'बी.टेक (कंप्यूटर साइंस एवं इंफॉर्मेशन टेक्नोलॉजी) — द्रोणाचार्य ग्रुप ऑफ इंस्टीट्यूशंस, ग्रेटर नोएडा',
    },
    professionalHighlights: {
      en: [
        'Founder of APX Digital.',
        'Full-stack web development and backend API development.',
        'Python, FastAPI, JavaScript and Firebase.',
        'AI, Machine Learning and workflow automation.',
        'Hack-A-Geek Runner-Up.',
        'Build with Bharat 4.0 — Top 25 Finalist.',
        'SIH Internal Hackathon — Top 30.',
      ],
      hi: [
        'APX Digital के संस्थापक।',
        'फुल-स्टैक वेब डेवलपमेंट एवं बैकएंड एपीआई डेवलपमेंट।',
        'पायथन, फास्टएपीआई, जावास्क्रिप्ट एवं फायरबेस।',
        'एआई, मशीन लर्निंग एवं वर्कफ़्लो ऑटोमेशन।',
        'हैक-ए-गीक रनर-अप।',
        'बिल्ड विद भारत 4.0 — टॉप 25 फाइनलिस्ट।',
        'एसआईएच इंटरनल हैकाथॉन — टॉप 30।',
      ],
    },
    summary: {
      en: 'Founder and Lead Technologist at APX Digital. Passionate software architect and full-stack engineer with hands-on expertise across modern web development, AI workflow automation, backend APIs, and cybersecurity. Proven track record leading multidisciplinary teams to podium finishes in high-stakes national hackathons and publishing IEEE research.',
      hi: 'APX Digital के संस्थापक एवं प्रमुख तकनीकी रणनीतिकार। आधुनिक वेब डेवलपमेंट, एआई वर्कफ़्लो ऑटोमेशन, बैकएंड एपीआई और साइबर सुरक्षा में गहरी विशेषज्ञता। राष्ट्रीय हैकाथॉन में टीम नेतृत्व और आईईईई शोध प्रकाशन का प्रामाणिक अनुभव।',
    },
    technicalSkills: [
      'Python',
      'FastAPI',
      'HTML5 / CSS3',
      'JavaScript',
      'Streamlit',
      'Firebase (Firestore & Auth)',
      'Machine Learning (XGBoost, Scikit-learn)',
      'Prompt Engineering & Generative AI',
      'Cybersecurity & Threat Analysis',
      'RESTful APIs',
      'Git & GitHub',
      'PostgreSQL',
    ],
    keyProjects: {
      en: [
        'AapdaSetu: AI-powered disaster intelligence & flash flood-risk early warning platform (FastAPI, XGBoost, PostgreSQL, IoT, GIS)',
        "ClimateTwin AI: India's Climate Digital Twin forecasting atmospheric hazards (Streamlit, NASA POWER API, Plotly)",
        'AI App Compiler: Autonomous software blueprint generator translating requirements into validated schemas (Python, Pydantic)',
        'Ayush Store Management: Full-stack retail portal with secure Admin Dashboard and Firestore database',
        'Ayush Service Centre: Multi-page business website with Google Maps & direct WhatsApp inquiry integration',
      ],
      hi: [
        'आपदासेतु: एआई-सक्षम आपदा खुफिया एवं बाढ़ जोखिम चेतावनी प्रणाली (FastAPI, XGBoost, PostgreSQL)',
        'क्लाइमेटट्विन एआई: नासा पावर एपीआई और प्लॉटली आधारित जलवायु डिजिटल ट्विन',
        'एआई ऐप कंपाइलर: प्राकृतिक भाषा से संरचित सॉफ्टवेयर ब्लूप्रिंट बनाने वाला सिस्टम',
        'आयुष स्टोर मैनेजमेंट: फायरबेस प्रमाणीकरण और डेटाबेस के साथ ई-कॉमर्स पोर्टल',
        'आयुष सर्विस सेंटर: गूगल मैप्स और व्हाट्सएप इंटीग्रेशन वाली कॉर्पोरेट वेबसाइट',
      ],
    },
    achievements: {
      en: [
        'Smart India Hackathon (SIH) College Level Winner & Team Leader',
        'Runner-Up at Hack-A-Geek (National Level Hackathon)',
        '1st Prize in Paper Presentation on "Phishing Detection Using Machine Learning"',
        'Lead Author on Research Paper "Healora - AI Powered Healthcare and Emergency System" accepted in IEEE International Conference (IEEE-ICAAIC 2026)',
        'Lead Author on Research Paper "A Machine Learning Based Architecture for Phishing URL Detection" accepted in IEEE International Conference (IEEE-CSNT 2026)',
      ],
      hi: [
        'स्मार्ट इंडिया हैकाथॉन (SIH) कॉलेज स्तर विजेता एवं टीम लीडर',
        'हैक-ए-गीक (राष्ट्रीय स्तर हैकाथॉन) उपविजेता',
        'मशीन लर्निंग आधारित फ़िशिंग डिटेक्शन पेपर प्रेजेंटेशन में प्रथम पुरस्कार',
        'आईईईई इंटरनेशनल कॉन्फ्रेंस (IEEE-ICAAIC 2026) में स्वीकृत "Healora" एआई हेल्थकेयर रिसर्च पेपर के मुख्य लेखक',
        'आईईईई इंटरनेशनल कॉन्फ्रेंस (IEEE-CSNT 2026) में स्वीकृत फ़िशिंग यूआरएल डिटेक्शन रिसर्च पेपर के मुख्य लेखक',
      ],
    },
    certifications: [
      'Postman API Fundamentals Student Expert',
      'Foundational C# with Microsoft (freeCodeCamp)',
      'Building Modern Python Applications on AWS',
      'Python Programming — DGI',
    ],
    socials: {
      linkedin: 'https://www.linkedin.com/in/ayush-gupta-844516330',
      github: 'https://github.com/guptaayush2005',
      email: 'guptaayush932589@gmail.com',
      whatsapp: 'https://wa.me/919519099011',
    },
  },
  {
    id: 'prince-singh',
    name: 'Prince Singh',
    officialRole: 'CO-FOUNDER',
    designation: {
      en: 'CO-FOUNDER',
      hi: 'सह-संस्थापक (CO-FOUNDER)',
    },
    photoUrl: '/team/prince-singh.jpg',
    education: {
      en: 'B.Tech in Computer Science',
      hi: 'बी.टेक (कंप्यूटर साइंस)',
    },
    professionalHighlights: {
      en: [
        'Co-Founder at APX Digital.',
        'Python and C programming.',
        'HTML, CSS and JavaScript.',
        'Software product development.',
        'Hackathon participation: Zinnovatio 3.0 and Internal SIH 2025.',
        'Campus ambassador and representative experience.',
        'NASSCOM & Skill India Digital Hub Software Product Developer certification.',
      ],
      hi: [
        'APX Digital के सह-संस्थापक (Co-Founder)।',
        'पायथन एवं सी प्रोग्रामिंग।',
        'एचटीएमएल, सीएसएस एवं जावास्क्रिप्ट।',
        'सॉफ्टवेयर उत्पाद विकास।',
        'हैकाथॉन प्रतिभागिता: Zinnovatio 3.0 एवं इंटरनल SIH 2025।',
        'कैंपस एंबेसडर एवं प्रतिनिधि अनुभव।',
        'नास्कॉम एवं स्किल इंडिया डिजिटल हब सॉफ्टवेयर प्रोडक्ट डेवलपर प्रमाणीकरण।',
      ],
    },
    summary: {
      en: 'Co-Founder and Software Engineer at APX Digital. Bridges software product development, technical architecture, and team strategy. Experienced with C, Python, and modern web technologies, with a strong focus on algorithmic problem solving, hackathon execution, and building scalable technological solutions for startups.',
      hi: 'APX Digital के सह-संस्थापक और सॉफ्टवेयर इंजीनियर। सॉफ्टवेयर उत्पाद विकास, तकनीकी आर्किटेक्चर और टीम रणनीति में कुशल। सी, पायथन और आधुनिक वेब तकनीकों में गहन अनुभव, एल्गोरिदम समस्या-समाधान और राष्ट्रीय हैकाथॉन में सक्रिय भूमिका।',
    },
    technicalSkills: [
      'Python',
      'C Programming',
      'HTML5 & CSS3',
      'JavaScript',
      'Software Architecture',
      'Data Structures & Algorithms',
      'Product Development',
      'Team Leadership',
      'Git & GitHub',
    ],
    keyProjects: {
      en: [
        'AapdaSetu: Early Warning & Flood Intelligence System (Collaborative Team Development)',
        'Modular Web Applications & Dynamic Client Interfaces',
        'Algorithmic System Prototypes and Performance Optimization',
      ],
      hi: [
        'आपदासेतु: आपदा पूर्व चेतावनी एवं बाढ़ खुफिया प्रणाली (सहयोगात्मक विकास)',
        'मॉड्यूलर वेब एप्लिकेशन और डायनामिक क्लाइंट इंटरफेस',
        'एल्गोरिदम सिस्टम प्रोटोटाइप और परफॉर्मेंस ऑप्टिमाइज़ेशन',
      ],
    },
    achievements: {
      en: [
        'Active Hackathon Team Partner across national engineering challenges',
        'Campus Ambassador representing technical learning communities',
        'Entrepreneurship and technological development leadership',
        'Verified software development certifications',
      ],
      hi: [
        'राष्ट्रीय इंजीनियरिंग हैकाथॉन में सक्रिय टीम पार्टनर',
        'तकनीकी शिक्षण समुदायों का प्रतिनिधित्व करने वाले कैंपस एंबेसडर',
        'उद्यमिता और तकनीकी उत्पाद विकास में नेतृत्व',
        'सॉफ्टवेयर डेवलपमेंट में प्रमाणित तकनीकी योग्यता',
      ],
    },
    certifications: [
      'Software Development Fundamentals',
      'Python Programming & Problem Solving',
    ],
    socials: {
      linkedin: 'https://www.linkedin.com/in/prince-singh-265767324/',
      email: 'guptaayush932589@gmail.com',
    },
  },
  {
    id: 'komal-soni',
    name: 'Komal Soni',
    officialRole: 'FOUNDING TEAM MEMBER',
    designation: {
      en: 'FOUNDING TEAM MEMBER',
      hi: 'संस्थापक टीम सदस्य (FOUNDING TEAM MEMBER)',
    },
    photoUrl: '/team/komal-soni.jpg',
    education: {
      en: 'B.Tech in Computer Science and Engineering',
      hi: 'बी.टेक (कंप्यूटर साइंस एंड इंजीनियरिंग)',
    },
    professionalHighlights: {
      en: [
        'Founding Team Member at APX Digital.',
        'Java and Python.',
        'HTML, CSS and JavaScript.',
        'Data Structures and Algorithms.',
        'Object-Oriented Programming and SQL.',
        'Flash Flood Prediction System project.',
        'KCC National Hackathon participation.',
      ],
      hi: [
        'APX Digital की संस्थापक टीम सदस्य।',
        'जावा एवं पायथन।',
        'एचटीएमएल, सीएसएस एवं जावास्क्रिप्ट।',
        'डेटा स्ट्रक्चर्स एवं एल्गोरिदम।',
        'ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग एवं एसक्यूएल।',
        'फ्लैश फ्लड प्रेडिक्शन सिस्टम प्रोजेक्ट।',
        'केसीसी नेशनल हैकाथॉन प्रतिभागिता।',
      ],
    },
    summary: {
      en: 'Founding Team Member at APX Digital, with an interest in web development, software engineering, creative design, and digital content production. Skilled in Java, Python, HTML, CSS, and JavaScript, with knowledge of Data Structures, Algorithms, Object-Oriented Programming, and database management. Also interested in video editing, presentation design, visual storytelling, and creating engaging digital experiences. Passionate about learning new technologies, collaborating with creative teams, and building innovative solutions that combine technology and creativity.',
      hi: 'APX Digital की संस्थापक टीम सदस्य, जिनकी रुचि वेब डेवलपमेंट, सॉफ्टवेयर इंजीनियरिंग, रचनात्मक डिज़ाइन और डिजिटल सामग्री निर्माण में है। जावा, पायथन, एचटीएमएल, सीएसएस और जावास्क्रिप्ट में कुशल, डेटा स्ट्रक्चर्स, एल्गोरिदम, ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग (OOP) और डेटाबेस प्रबंधन का ठोस ज्ञान। वीडियो संपादन, प्रेजेंटेशन डिज़ाइन, विज़ुअल स्टोरीटेलिंग और आकर्षक डिजिटल अनुभव तैयार करने में विशेष रुचि। नई तकनीकों को सीखने, रचनात्मक टीमों के साथ सहयोग करने और प्रौद्योगिकी एवं रचनात्मकता को जोड़ने वाले अभिनव समाधान तैयार करने के लिए समर्पित।',
    },
    technicalSkills: [
      'Java',
      'Python',
      'HTML5',
      'CSS3',
      'JavaScript',
      'Object-Oriented Programming (OOP)',
      'Data Structures & Algorithms (DSA)',
      'Presentation Design',
      'Visual Design & Creative Content',
      'Video Editing & Basic Motion Graphics',
      'SQL & PostgreSQL',
      'Git & GitHub',
      'VS Code',
    ],
    categorizedSkills: [
      {
        category: { en: 'Programming', hi: 'प्रोग्रामिंग' },
        skills: ['Java', 'Python', 'OOP', 'DSA'],
      },
      {
        category: { en: 'Web Development', hi: 'वेब डेवलपमेंट' },
        skills: ['HTML5', 'CSS3', 'JavaScript'],
      },
      {
        category: { en: 'Creative & Design', hi: 'रचनात्मक एवं डिज़ाइन' },
        skills: ['Presentation Design', 'Visual Design', 'Creative Content'],
      },
      {
        category: { en: 'Media Production', hi: 'मीडिया प्रोडक्शन' },
        skills: ['Video Editing', 'Basic Motion Graphics'],
      },
      {
        category: { en: 'Database & Tools', hi: 'डेटाबेस एवं टूल्स' },
        skills: ['SQL', 'PostgreSQL', 'Git & GitHub', 'VS Code'],
      },
    ],
    keyProjects: {
      en: [
        'Disaster Management — Flash Flood Prediction System using Python, Machine Learning, XGBoost, IoT sensors, Satellite data, and PostgreSQL',
        'Dynamic Web Application Frontends with responsive UI styling',
        'Creative Presentation & Pitch Deck Graphics for Agency Showcases',
      ],
      hi: [
        'आपदा प्रबंधन: पायथन, मशीन लर्निंग, एक्सजीबूस्ट, आईओटी और सैटेलाइट डेटा आधारित फ्लैश फ्लड प्रेडिक्शन सिस्टम',
        'रिस्पॉन्सिव यूआई स्टाइलिंग के साथ डायनामिक वेब एप्लिकेशन फ्रंटएंड',
        'एजेंसी शोकेस के लिए क्रिएटिव प्रेजेंटेशन और पिच डेक डिज़ाइन',
      ],
    },
    achievements: {
      en: [
        'Key contributor to national hackathon disaster intelligence systems',
        'Academic excellence in computer science, algorithmic problem solving, and OOP',
        'Active participant in cross-functional engineering teams, tech workshops, and creative design',
        'Verified certificates in Java, Python, and Web Development',
      ],
      hi: [
        'राष्ट्रीय हैकाथॉन आपदा खुफिया प्रणालियों में प्रमुख योगदानकर्ता',
        'कंप्यूटर विज्ञान, एल्गोरिदम समस्या-समाधान और ओओपी में उत्कृष्ट अकादमिक प्रदर्शन',
        'क्रॉस-फंक्शनल इंजीनियरिंग टीमों और तकनीकी कार्यशालाओं में सक्रिय भागीदारी',
        'जावा, पायथन और वेब डेवलपमेंट में प्रमाणित प्रमाण पत्र',
      ],
    },
    certifications: [
      'Java & Object-Oriented Software Engineering',
      'Python & Algorithmic Problem Solving',
      'Database Management Systems (SQL)',
    ],
    socials: {
      linkedin: 'https://www.linkedin.com/in/komal-soni-profile',
      email: 'guptaayush932589@gmail.com',
    },
  },
];
