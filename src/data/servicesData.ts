export interface ServiceItem {
  id: string;
  slug: string;
  iconName: string;
  title: { en: string; hi: string };
  tagline: { en: string; hi: string };
  description: { en: string; hi: string };
  deliverables: { en: string[]; hi: string[] };
  benefits: { en: string[]; hi: string[] };
  features: { en: string[]; hi: string[] };
  technologies: string[];
  isTool?: boolean;
  toolUrl?: string;
  badge?: string;
}

export const servicesData: ServiceItem[] = [
  {
    id: 'web-dev',
    slug: 'website-development',
    iconName: 'Globe',
    title: {
      en: 'Website Development',
      hi: 'वेबसाइट डेवलपमेंट',
    },
    tagline: {
      en: 'High-speed, SEO-optimized, pixel-perfect web experiences that convert visitors into loyal clients.',
      hi: 'उच्च गति, एसईओ-अनुकूलित और आकर्षक वेबसाइट्स जो विज़िटर्स को ग्राहकों में बदलती हैं।',
    },
    description: {
      en: 'We craft modern, responsive, and performance-obsessed websites for startups, businesses, creators, and individuals. From lightning-fast marketing landing pages to complex multi-page corporate portals and custom e-commerce stores, we engineer digital flagships with uncompromising attention to typography, speed, and usability.',
      hi: 'हम स्टार्टअप्स, कंपनियों और रचनाकारों के लिए आधुनिक, रिस्पॉन्सिव और उच्च-प्रदर्शन वेबसाइट्स का निर्माण करते हैं। लैंडिंग पेज से लेकर मल्टी-पेज कॉर्पोरेट पोर्टल और ई-कॉमर्स स्टोर तक, हम हर विवरण पर ध्यान देते हैं।',
    },
    features: {
      en: [
        'Business & Corporate Websites',
        'High-Converting Landing Pages',
        'Personal Portfolio Websites',
        'Multi-Page Web Platforms',
        'E-Commerce & Online Stores',
        'Full Responsive Web Design',
        'Modern Website Redesigns',
        'Speed & SEO Optimization',
      ],
      hi: [
        'व्यावसायिक एवं कॉर्पोरेट वेबसाइट्स',
        'उच्च-रूपांतरण लैंडिंग पेज',
        'पर्सनल पोर्टफोलियो वेबसाइट्स',
        'मल्टी-पेज वेब प्लेटफॉर्म्स',
        'ई-कॉमर्स एवं ऑनलाइन स्टोर्स',
        'मोबाइल-अनुकूलित रिस्पॉन्सिव डिज़ाइन',
        'वेबसाइट री-डिज़ाइन एवं आधुनिकीकरण',
        'वेबसाइट मेंटेनेंस एवं एसईओ अनुकूलन',
      ],
    },
    deliverables: {
      en: [
        'Fully responsive code compliant with modern web standards',
        'Interactive UI components with smooth micro-animations',
        'Complete SEO meta structure & schema markup',
        'Integrated inquiry forms & analytics tracking',
        'Deployment to Vercel, Netlify, or custom cloud server',
        'Comprehensive handover documentation & CMS walkthrough',
      ],
      hi: [
        'आधुनिक वेब मानकों के अनुसार पूरी तरह रिस्पॉन्सिव कोड',
        'स्मूथ एनिमेशन के साथ इंटरैक्टिव यूआई घटक',
        'एसईओ मेटा संरचना एवं स्कीमा मार्कअप',
        'एकीकृत संपर्क फ़ॉर्म और एनालिटिक्स ट्रैकिंग',
        'क्लाउड सर्वर पर लाइव डिप्लॉयमेंट',
        'दस्तावेज़ीकरण एवं पूर्ण हैंडओवर',
      ],
    },
    benefits: {
      en: [
        'Sub-second page load times for superior search engine rankings',
        'Flawless visual appeal across mobile, tablet, and ultra-wide screens',
        'Clear conversion pathways designed to drive authentic inquiries',
        'Clean maintainable codebase that scales with your growth',
      ],
      hi: [
        'बेहतर सर्च इंजन रैंकिंग के लिए अत्यंत तेज़ लोडिंग समय',
        'मोबाइल, टैबलेट और डेस्कटॉप पर बेदाग दृश्य अनुभव',
        'पूछताछ और बिक्री बढ़ाने के लिए स्पष्ट कॉल-टू-एक्शन',
        'स्वच्छ कोड जो आपके व्यवसाय के साथ आसानी से विकसित हो सके',
      ],
    },
    technologies: ['React', 'Next.js', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Vercel', 'Firebase'],
  },
  {
    id: 'app-dev',
    slug: 'app-development',
    iconName: 'Smartphone',
    title: {
      en: 'App Development',
      hi: 'ऐप डेवलपमेंट',
    },
    tagline: {
      en: 'Robust web applications, administrative dashboards, and custom software systems.',
      hi: 'मजबूत वेब एप्लिकेशन, एडमिन डैशबोर्ड और कस्टम सॉफ्टवेयर प्रणालियां।',
    },
    description: {
      en: 'We build intuitive, scalable, and resilient digital applications designed to power business operations and engage modern users. From centralized admin dashboards and SaaS applications to cross-platform mobile experiences, we combine robust architectures with frictionless user experiences.',
      hi: 'हम सहज, स्केलेबल और आधुनिक वेब और मोबाइल एप्लिकेशन विकसित करते हैं। एडमिन डैशबोर्ड से लेकर कस्टम सॉफ्टवेयर और सास (SaaS) टूल तक, हम बेहतरीन यूआई/यूएक्स के साथ मजबूत बैकएंड तैयार करते हैं।',
    },
    features: {
      en: [
        'Dynamic Web Applications',
        'Cross-Platform Mobile Apps',
        'Business Software & ERP Modules',
        'Custom Admin Dashboards',
        'Application UI/UX Architecture',
        'Role-Based Access & Auth Systems',
      ],
      hi: [
        'डायनेमिक वेब एप्लिकेशन्स',
        'मोबाइल एप्लिकेशन्स',
        'व्यावसायिक कस्टम सॉफ्टवेयर',
        'एडमिन एवं एनालिटिक्स डैशबोर्ड्स',
        'एप्लिकेशन यूआई/यूएक्स आर्किटेक्चर',
        'भूमिका-आधारित प्रमाणीकरण प्रणाली',
      ],
    },
    deliverables: {
      en: [
        'Production-ready application with clean architecture',
        'Secure user authentication (OAuth, Firebase, JWT)',
        'Database schema design (PostgreSQL, Firestore, MongoDB)',
        'RESTful & GraphQL API integration endpoints',
        'Interactive real-time charts & data views',
      ],
      hi: [
        'स्वच्छ आर्किटेक्चर के साथ प्रोडक्शन-रेडी ऐप',
        'सुरक्षित उपयोगकर्ता प्रमाणीकरण',
        'डेटाबेस स्कीमा डिज़ाइन एवं डेटा मॉडलिंग',
        'आरईएसटी और ग्राफक्यूएल एपीआई इंटीग्रेशन',
        'इंटरैक्टिव रियल-टाइम चार्ट्स एवं डेटा व्यू',
      ],
    },
    benefits: {
      en: [
        'Automate complex operational workflows and reduce manual overhead',
        'Real-time access to key metrics and business analytics',
        'Bank-grade authentication and data encryption practices',
        'Modular architecture ready for enterprise scale',
      ],
      hi: [
        'जटिल कार्यप्रवाह को स्वचालित कर समय की बचत',
        'रियल-टाइम व्यावसायिक मेट्रिक्स तक त्वरित पहुंच',
        'सुरक्षित प्रमाणीकरण और डेटा एन्क्रिप्शन',
        'मॉड्यूलर आर्किटेक्चर जो भविष्य में आसानी से विस्तार योग्य है',
      ],
    },
    technologies: ['React', 'FastAPI', 'Node.js', 'Python', 'PostgreSQL', 'Firebase', 'REST APIs', 'Docker'],
  },
  {
    id: 'ai-solutions',
    slug: 'ai-solutions-automation',
    iconName: 'Cpu',
    title: {
      en: 'AI Solutions & Automation',
      hi: 'एआई समाधान एवं ऑटोमेशन',
    },
    tagline: {
      en: 'Intelligent AI workflows, conversational bots, and automated decision engines.',
      hi: 'बुद्धिमान एआई वर्कफ़्लो, चैटबॉट्स और स्वचालित निर्णय इंजन।',
    },
    description: {
      en: 'Harness the transformative power of generative AI and machine learning to automate repetitive tasks, extract high-value insights, and provide 24/7 intelligent customer engagement. We build bespoke AI chatbots, intelligent search systems, predictive risk models, and workflow automations tailored to your operational needs.',
      hi: 'दोहराए जाने वाले कार्यों को स्वचालित करने, मूल्यवान अंतर्दृष्टि निकालने और 24/7 बुद्धिमान ग्राहक सेवा प्रदान करने के लिए आधुनिक एआई का लाभ उठाएं। हम कस्टम चैटबॉट, प्रेडिक्टिव मॉडल और वर्कफ़्लो ऑटोमेशन बनाते हैं।',
    },
    features: {
      en: [
        'AI-Powered Business Applications',
        'Conversational AI Chatbots (English & Hinglish)',
        'LLM & OpenAI / Gemini API Integration',
        'Workflow & Document Automation',
        'Predictive Machine Learning Models',
        'Intelligent Analytics & Data Extraction',
      ],
      hi: [
        'एआई-सक्षम व्यावसायिक एप्लिकेशन्स',
        'संवादी एआई चैटबॉट्स (अंग्रेजी एवं हिंग्लिश)',
        'एलएलएम एवं जेमिनी/ओपनएआई एपीआई एकीकरण',
        'दस्तावेज़ एवं प्रक्रिया ऑटोमेशन',
        'प्रेडिक्टिव मशीन लर्निंग मॉडल्स',
        'बुद्धिमान एनालिटिक्स एवं डेटा निष्कर्षण',
      ],
    },
    deliverables: {
      en: [
        'Trained/fine-tuned or prompt-engineered AI engine',
        'Custom conversational web widget with context memory',
        'Seamless API connectors to your existing databases/tools',
        'Automated background jobs and webhook notifications',
        'Prompt safety rails and response validation pipeline',
      ],
      hi: [
        'अनुकूलित एआई इंजन एवं सिस्टम प्रॉम्ट्स',
        'कस्टम चैटबॉट विजेट',
        'डेटाबेस और टूल के साथ सहज एपीआई कनेक्टर्स',
        'स्वचालित बैकग्राउंड जॉब्स और वेबहुक अलर्ट्स',
        'प्रॉम्ट सुरक्षा और सत्यापन पाइपलाइन',
      ],
    },
    benefits: {
      en: [
        'Save hundreds of operational hours through intelligent task delegation',
        'Instant answers for website visitors driving higher lead conversion',
        'Data-driven predictions to identify risks and growth opportunities early',
        'Continuous improvement with self-refining pipeline logic',
      ],
      hi: [
        'स्वचालित कार्यों के माध्यम से सैकड़ों कार्य-घंटों की बचत',
        'विज़िटर्स को तत्काल उत्तर जिससे लीड रूपांतरण बढ़ता है',
        'डेटा-संचालित पूर्वानुमानों से नए अवसरों की पहचान',
        'आधुनिक एआई तकनीकों के साथ निरंतर सुधार',
      ],
    },
    technologies: ['Python', 'FastAPI', 'Gemini API', 'OpenAI', 'XGBoost', 'Scikit-learn', 'Streamlit', 'LangChain'],
  },
  {
    id: 'video-editing',
    slug: 'video-editing-motion-graphics',
    iconName: 'Film',
    title: {
      en: 'Video Editing & Motion Graphics',
      hi: 'वीडियो एडिटिंग एवं मोशन ग्राफिक्स',
    },
    tagline: {
      en: 'Cinematic storytelling, viral social reels, and dynamic motion graphics that command attention.',
      hi: 'सिनेमैटिक स्टोरीटेलिंग, सोशल रील्स और डायनेमिक मोशन ग्राफिक्स जो दर्शकों को आकर्षित करते हैं।',
    },
    description: {
      en: 'In an attention-driven digital economy, compelling video is the highest-converting medium. Our creative suite delivers punchy short-form content (Instagram Reels, YouTube Shorts), polished long-form YouTube edits, promotional product teasers, corporate brand videos, and kinetic motion graphics tailored for maximum retention.',
      hi: 'आज के डिजिटल युग में वीडियो सबसे प्रभावशाली माध्यम है। हम इंस्टाग्राम रील्स, यूट्यूब शॉर्ट्स, विस्तृत यूट्यूब वीडियो, कॉर्पोरेट प्रमोशनल वीडियो और आकर्षक मोशन ग्राफिक्स तैयार करते हैं।',
    },
    features: {
      en: [
        'Instagram Reels & TikToks with Viral Pacing',
        'YouTube Shorts with Retention Hooks',
        'Long-Form YouTube Video Production',
        'Corporate & Startup Brand Storytelling',
        'SaaS Product Walkthroughs & Teasers',
        'Kinetic Typography & Lower Thirds',
      ],
      hi: [
        'इंस्टाग्राम रील्स एवं शॉर्ट्स',
        'उच्च-अवधारण यूट्यूब शॉर्ट्स',
        'विस्तृत यूट्यूब वीडियो एडिटिंग',
        'कॉर्पोरेट एवं स्टार्टअप ब्रांड वीडियो',
        'उत्पाद प्रदर्शन एवं टीज़र वीडियो',
        'काइनेटिक टाइपोग्राफी एवं मोशन ग्राफिक्स',
      ],
    },
    deliverables: {
      en: [
        'Color-graded 4K/1080p master files optimized for social platforms',
        'Dynamic subtitles with custom fonts, animations, and sound effects',
        'Licensed high-energy background music and sound design',
        'Multiple aspect ratios (9:16 vertical, 16:9 widescreen, 1:1 square)',
        'Custom thumbnail options crafted for maximum click-through rate',
      ],
      hi: [
        'सोशल मीडिया के लिए अनुकूलित 4K/1080p वीडियो फाइल्स',
        'एनिमेटेड सबटाइटल्स और आकर्षक साउंड इफेक्ट्स',
        'लाइसेंस प्राप्त बैकग्राउंड म्यूजिक',
        'विभिन्न पहलू अनुपात (9:16 वर्टिकल, 16:9 वाइडस्क्रीन)',
        'आकर्षक कस्टम थंबनेल डिज़ाइन',
      ],
    },
    benefits: {
      en: [
        'Multiply organic reach across Instagram, YouTube, and LinkedIn',
        'Establish founder authority and brand prestige through cinematic polish',
        'Significantly higher audience watch times and engagement rates',
        'Streamlined content pipeline that frees you to focus on your core craft',
      ],
      hi: [
        'इंस्टाग्राम, यूट्यूब और लिंक्डइन पर ऑर्गैनिक रीच में वृद्धि',
        'सिनेमैटिक गुणवत्ता के माध्यम से ब्रांड की विश्वसनीयता',
        'उच्च दर्शक अवधारण (Watch Time) और जुड़ाव दर',
        'नियमित और पेशेवर वीडियो कंटेंट पाइपलाइन',
      ],
    },
    technologies: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'CapCut Pro', 'Motion Design', 'Sound Synthesis'],
  },
  {
    id: 'graphic-design',
    slug: 'graphic-design-branding',
    iconName: 'Palette',
    title: {
      en: 'Graphic Design & Branding',
      hi: 'ग्राफिक डिज़ाइन एवं ब्रांडिंग',
    },
    tagline: {
      en: 'Distinctive brand identities, logo marks, and visual collateral that leave lasting impressions.',
      hi: 'विशिष्ट ब्रांड पहचान, लोगो और दृश्य प्रचार सामग्री जो गहरी छाप छोड़ती है।',
    },
    description: {
      en: 'Great brands are unmistakable. We build iconic visual identities that articulate your company’s values and make your offerings unforgettable. From precision-engineered logos and color palettes to marketing collateral, social media design systems, and advertising creatives, we elevate your perception.',
      hi: 'एक बेहतरीन ब्रांड की पहचान अलग ही होती है। हम प्रतिष्ठित लोगो, सामंजस्यपूर्ण रंग पैलेट, मार्केटिंग सामग्री, सोशल मीडिया क्रिएटिव और विज्ञापन बैनर तैयार करते हैं जो आपके व्यवसाय को प्रीमियम लुक देते हैं।',
    },
    features: {
      en: [
        'Brand Identity & Design Systems',
        'Logo Design & Vector Monograms',
        'Social Media Creative Templates',
        'Marketing Posters, Banners & Flyers',
        'Business Cards & Stationery Sets',
        'Advertising Creatives & Display Assets',
      ],
      hi: [
        'ब्रांड पहचान एवं संपूर्ण डिज़ाइन सिस्टम',
        'लोगो डिज़ाइन एवं वेक्टर मोनोग्राम',
        'सोशल मीडिया क्रिएटिव टेम्प्लेट्स',
        'मार्केटिंग पोस्टर्स, बैनर्स एवं फ्लायर्स',
        'विज़िटिंग कार्ड्स एवं स्टेशनरी डिज़ाइन',
        'विज्ञापन क्रिएटिव एवं डिजिटल एसेट्स',
      ],
    },
    deliverables: {
      en: [
        'Comprehensive brand guidelines manual (typography, colors, spacing)',
        'Vector logo files (.SVG, .AI, .EPS, .PNG, .PDF) for print and digital',
        'Editable social media templates (Figma / Canva)',
        'Ready-to-print stationery and promotional collaterals',
        'Brand assets kit with high-resolution transparent badges',
      ],
      hi: [
        'व्यापक ब्रांड दिशानिर्देश नियमावली (टाइपोग्राफी, रंग, नियम)',
        'वेक्टर लोगो फाइल्स (एसवीजी, पीएनजी, पीडीएफ)',
        'संपादन योग्य सोशल मीडिया टेम्प्लेट्स',
        'प्रिंट-रेडी स्टेशनरी और प्रचार सामग्री',
        'हाई-रिज़ॉल्यूशन ब्रांड एसेट्स किट',
      ],
    },
    benefits: {
      en: [
        'Command premium pricing with a world-class professional aesthetic',
        'Uniform visual coherence across all customer-facing touchpoints',
        'Stand apart decisively from competitors with unique visual character',
        'Accelerate marketing output with pre-built modular design systems',
      ],
      hi: [
        'विश्वस्तरीय पेशेवर सौंदर्य के साथ प्रीमियम मूल्य निर्धारण',
        'सभी ग्राहक संपर्कों में एक समान और सुसंगत पहचान',
        'प्रतिस्पर्धियों से अलग एक अनूठी और आकर्षक दृश्य पहचान',
        'तैयार डिज़ाइन सिस्टम के साथ तेज़ मार्केटिंग उत्पादन',
      ],
    },
    technologies: ['Figma', 'Adobe Illustrator', 'Photoshop', 'Vector Graphics', 'Design Tokens', 'Canva Pro'],
  },
  {
    id: 'presentation-design',
    slug: 'presentation-design',
    iconName: 'Presentation',
    title: {
      en: 'Presentation Design',
      hi: 'प्रेजेंटेशन डिज़ाइन',
    },
    tagline: {
      en: 'High-stakes startup pitch decks, investor presentations, and corporate proposals that win.',
      hi: 'स्टार्टअप पिच डेक, निवेशक प्रस्तुतियां और व्यावसायिक प्रस्ताव जो सफलता दिलाते हैं।',
    },
    description: {
      en: 'Transform complex business ideas and dense technical data into persuasive, visually stunning narratives. Whether you are pitching venture capital investors, delivering a conference keynote, or submitting a high-value commercial proposal, our decks are engineered to captivate audiences and drive action.',
      hi: 'जटिल व्यावसायिक विचारों और तकनीकी डेटा को सम्मोहक और प्रभावशाली विज़ुअल स्लाइड में बदलें। चाहे आप निवेशकों के सामने पिच कर रहे हों, सम्मेलन में बोल रहे हों, या कोई बड़ा व्यावसायिक प्रस्ताव प्रस्तुत कर रहे हों।',
    },
    features: {
      en: [
        'Startup Seed & Series-A Pitch Decks',
        'Investor Presentations & Financial Roadmaps',
        'Corporate Business Proposals',
        'Technical & Research Conference Decks',
        'Academic & Hackathon Presentations',
        'Custom Branded Keynote Templates',
      ],
      hi: [
        'स्टार्टअप पिच डेक (इन्वेस्टर रेडी)',
        'निवेशक प्रस्तुतियां एवं रोडमैप',
        'व्यावसायिक प्रस्ताव (Business Proposals)',
        'तकनीकी एवं शोध सम्मेलन प्रस्तुतियां',
        'अकादमिक एवं हैकाथॉन प्रेजेंटेशन्स',
        'कस्टम ब्रांडेड स्लाइड टेम्प्लेट्स',
      ],
    },
    deliverables: {
      en: [
        'Fully editable PowerPoint (.PPTX) & Google Slides master file',
        'Clickable interactive PDF with embedded links and table of contents',
        'Custom bespoke charts, data infographics, and iconography',
        'Slide transitions and subtle narrative pacing animations',
        'Print-ready high-resolution presentation booklet version',
      ],
      hi: [
        'संपादन योग्य पावरपॉइंट (.PPTX) और गूगल स्लाइड्स फाइल',
        'क्लिक करने योग्य इंटरैक्टिव पीडीएफ',
        'कस्टम इन्फोग्राफिक्स, डेटा चार्ट्स और आइकन्स',
        'स्लाइड ट्रांज़िशन और सूक्ष्म एनिमेशन्स',
        'प्रिंट-रेडी उच्च-रिज़ॉल्यूशन संस्करण',
      ],
    },
    benefits: {
      en: [
        'Capture and hold the attention of time-constrained angel investors',
        'Distill intricate product architectures into crystal-clear infographics',
        'Elevate perceived company maturity and domain authority',
        'Reusable master slide designs that your team can update anytime',
      ],
      hi: [
        'निवेशकों और निर्णयकर्ताओं का तुरंत ध्यान आकर्षित करें',
        'जटिल तकनीकी आर्किटेक्चर को सरल और स्पष्ट इन्फोग्राफिक्स में समझें',
        'कंपनी की विश्वसनीयता और पेशेवर परिपक्वता प्रदर्शित करें',
        'पुन: प्रयोज्य मास्टर स्लाइड जिन्हें आपकी टीम कभी भी अपडेट कर सकती है',
      ],
    },
    technologies: ['PowerPoint', 'Google Slides', 'Keynote', 'Figma', 'Infographic Design', 'Vector Assets'],
  },
  {
    id: 'digital-marketing',
    slug: 'digital-marketing-content-support',
    iconName: 'Megaphone',
    title: {
      en: 'Digital Marketing & Content Support',
      hi: 'डिजिटल मार्केटिंग एवं कंटेंट सपोर्ट',
    },
    tagline: {
      en: 'Strategic social creatives, content roadmaps, and digital growth acceleration.',
      hi: 'रणनीतिक सोशल क्रिएटिव, कंटेंट रोडमैप और डिजिटल विकास में तेजी।',
    },
    description: {
      en: 'Building a great product is only half the battle; ensuring your ideal clients discover it is the other. We provide comprehensive digital marketing creative support, helping your brand maintain an authoritative presence across LinkedIn, Instagram, and web channels with tactical campaigns and high-performing content.',
      hi: 'एक बेहतरीन उत्पाद बनाना केवल आधी यात्रा है; सही ग्राहकों तक पहुंचना उतना ही आवश्यक है। हम रणनीतिक सोशल मीडिया क्रिएटिव, कंटेंट प्लानिंग और डिजिटल उपस्थिति बढ़ाने में आपका मार्गदर्शन करते हैं।',
    },
    features: {
      en: [
        'Social Media Campaign Creatives',
        'Content Planning & Editorial Calendars',
        'Digital Brand Presence Consulting',
        'Promotional Content & Launch Campaigns',
        'LinkedIn Thought Leadership Design',
        'Brand Awareness Collateral',
      ],
      hi: [
        'सोशल मीडिया अभियान क्रिएटिव',
        'कंटेंट योजना एवं संपादकीय कैलेंडर',
        'डिजिटल ब्रांड उपस्थिति परामर्श',
        'प्रमोशनल कंटेंट एवं प्रोडक्ट लॉन्च अभियान',
        'लिंक्डइन थॉट लीडरशिप डिज़ाइन',
        'ब्रांड जागरूकता प्रचार सामग्री',
      ],
    },
    deliverables: {
      en: [
        'Monthly batches of high-conversion social static & motion posts',
        'Structured 30-day editorial content calendar with captions and hashtags',
        'Custom promotional banners for sales sprints and product announcements',
        'Performance tracking recommendations and engagement audits',
      ],
      hi: [
        'उच्च-रूपांतरण वाले सोशल मीडिया पोस्ट्स का मासिक सेट',
        'कैप्शन और हैशटैग के साथ 30-दिवसीय कंटेंट कैलेंडर',
        'उत्पाद लॉन्च और ऑफ़र के लिए प्रमोशनल बैनर्स',
        'प्रदर्शन ट्रैकिंग और जुड़ाव बढ़ाने के सुझाव',
      ],
    },
    benefits: {
      en: [
        'Consistent, professional digital presence without consuming your team’s bandwidth',
        'Higher engagement and follower retention across core professional networks',
        'Aligned messaging that drives traffic directly into your conversion funnel',
        'Agile creative turnaround to capitalize on industry trends',
      ],
      hi: [
        'आपकी टीम का समय बचाते हुए निरंतर पेशेवर डिजिटल उपस्थिति',
        'प्रमुख नेटवर्क पर अधिक जुड़ाव और फॉलोअर्स की संख्या में वृद्धि',
        'सटीक संदेश जो सीधे आपकी वेबसाइट पर योग्य ग्राहक लाते हैं',
        'आधुनिक रुझानों का तुरंत लाभ उठाने की तत्परता',
      ],
    },
    technologies: ['Canva Pro', 'Figma', 'Meta Suite', 'Buffer', 'Copywriting Frameworks', 'Analytics'],
  },
  {
    id: 'social-media-management',
    slug: 'social-media-management',
    iconName: 'Share2',
    title: {
      en: 'Social Media Management',
      hi: 'सोशल मीडिया मैनेजमेंट',
    },
    tagline: {
      en: 'Strategic social media management, content planning, and performance-focused content strategies.',
      hi: 'रणनीतिक सोशल मीडिया प्रबंधन, कंटेंट योजना और विकास-उन्मुख रणनीतियाँ।',
    },
    description: {
      en: 'We help businesses build a strong digital presence through strategic social media management, content planning, creative posts, audience engagement, brand consistency, and performance-focused content strategies.',
      hi: 'हम व्यवसायों को रणनीतिक सोशल मीडिया प्रबंधन, कंटेंट योजना, रचनात्मक पोस्ट, दर्शकों के जुड़ाव, ब्रांड निरंतरता और प्रदर्शन-केंद्रित रणनीतियों के माध्यम से एक मजबूत डिजिटल पहचान बनाने में मदद करते हैं।',
    },
    features: {
      en: [
        'Social Media Strategy',
        'Content Planning & Calendars',
        'Social Media Post Design',
        'Reels & Short-Form Video Content',
        'Page Management',
        'Audience Engagement',
        'Performance Analysis',
      ],
      hi: [
        'सोशल मीडिया रणनीति (Social Media Strategy)',
        'कंटेंट योजना एवं संपादकीय कैलेंडर',
        'सोशल मीडिया पोस्ट एवं क्रिएटिव डिज़ाइन',
        'रील्स एवं शॉर्ट-फॉर्म वीडियो कंटेंट',
        'पेज एवं प्रोफ़ाइल प्रबंधन',
        'दर्शकों के साथ सक्रिय जुड़ाव (Audience Engagement)',
        'प्रदर्शन एवं मेट्रिक्स विश्लेषण (Performance Analysis)',
      ],
    },
    deliverables: {
      en: [
        'Custom social media roadmap aligned with business goals',
        '30-day comprehensive content calendar with copy and hooks',
        'High-converting static carousels and motion post assets',
        'Optimized short-form video reels ready for publication',
        'Regular community management and message triage',
        'Monthly detailed growth and engagement analytics report',
      ],
      hi: [
        'व्यावसायिक लक्ष्यों के अनुसार कस्टम सोशल मीडिया रोडमैप',
        'आकर्षक कॉपी और हुक के साथ 30-दिवसीय विस्तृत कैलेंडर',
        'उच्च-रूपांतरण वाले कैरोसेल और मोशन पोस्ट ग्राफिक्स',
        'प्रकाशन के लिए तैयार अनुकूलित शॉर्ट-फॉर्म वीडियो रील्स',
        'सामुदायिक प्रबंधन और टिप्पणियों पर प्रतिक्रिया',
        'मासिक विस्तृत विकास और जुड़ाव विश्लेषण रिपोर्ट',
      ],
    },
    benefits: {
      en: [
        'Establish recognized industry authority and brand trust',
        'Maintain a continuous, predictable cadence of high-quality content',
        'Convert casual social impressions into qualified customer inquiries',
        'Free up internal resources while growing across multiple channels',
      ],
      hi: [
        'उद्योग में प्रतिष्ठा और ब्रांड पर ग्राहकों का गहरा विश्वास',
        'उच्च-गुणवत्ता वाले कंटेंट का निरंतर और सुसंगत प्रवाह',
        'सोशल मीडिया दर्शकों को वास्तविक ग्राहकों में बदलना',
        'मल्टी-प्लेटफ़ॉर्म विकास के साथ अपनी टीम का समय बचाना',
      ],
    },
    technologies: ['Meta Business Suite', 'LinkedIn Creator', 'Instagram Studio', 'Figma', 'Buffer', 'CapCut Pro', 'Analytics'],
  },
  {
    id: 'resume-builder',
    slug: 'free-resume-builder',
    iconName: 'FileText',
    isTool: true,
    toolUrl: 'https://apx-resume-builder.vercel.app/',
    badge: 'FREE TOOL',
    title: {
      en: 'Free AI-Assisted Resume Builder',
      hi: 'फ्री एआई-असिस्टेड रिज्यूमे बिल्डर',
    },
    tagline: {
      en: 'Create a professional, job-ready resume with our free online Resume Builder.',
      hi: 'हमारे निःशुल्क ऑनलाइन रिज्यूमे बिल्डर के साथ एक पेशेवर, नौकरी के लिए तैयार रिज्यूमे बनाएं।',
    },
    description: {
      en: 'Create a professional, job-ready resume with our free online Resume Builder. Organize your education, skills, projects, experience and achievements into a clean, professional resume format.',
      hi: 'हमारे निःशुल्क ऑनलाइन रिज्यूमे बिल्डर के साथ एक पेशेवर, नौकरी के लिए तैयार रिज्यूमे बनाएं। अपनी शिक्षा, कौशल, प्रोजेक्ट्स, अनुभव और उपलब्धियों को एक स्वच्छ, पेशेवर रिज्यूमे प्रारूप में व्यवस्थित करें।',
    },
    features: {
      en: [
        'Easy resume creation',
        'Personal information and contact details',
        'Education and academic details',
        'Technical skills and certifications',
        'Projects and achievements',
        'Professional experience',
        'Clean resume templates',
        'Resume preview and PDF export',
      ],
      hi: [
        'आसान रिज्यूमे निर्माण (Easy Resume Creation)',
        'व्यक्तिगत जानकारी और संपर्क विवरण',
        'शिक्षा और अकादमिक विवरण',
        'तकनीकी कौशल और प्रमाणपत्र',
        'प्रोजेक्ट्स और उपलब्धियां',
        'पेशेवर कार्य अनुभव',
        'आधुनिक एवं स्वच्छ रिज्यूमे टेम्पलेट्स',
        'लाइव पूर्वावलोकन और पीडीएफ एक्सपोर्ट',
      ],
    },
    deliverables: {
      en: [
        'Instant web-based resume editor with real-time preview',
        'Industry-standard formatting optimized for ATS scanners',
        'Modular sections for skills, experience, and certifications',
        'One-click PDF download with crisp vector typography',
        '100% free access with no sign-up paywalls',
      ],
      hi: [
        'रीयल-टाइम पूर्वावलोकन के साथ त्वरित वेब-आधारित रिज्यूमे संपादक',
        'एटीएस स्कैनर (ATS) के लिए अनुकूलित मानक प्रारूप',
        'कौशल, अनुभव और प्रमाणपत्रों के लिए मॉड्यूलर सेक्शन',
        'स्पष्ट टाइपोग्राफी के साथ एक-क्लिक पीडीएफ डाउनलोड',
        'बिना किसी शुल्क या पेवॉल के 100% निःशुल्क उपयोग',
      ],
    },
    benefits: {
      en: [
        'Completely free to use with zero hidden subscriptions or paywalls',
        'ATS-friendly structure designed to pass recruiter screening filters',
        'Clean, polished visual layout that creates a commanding first impression',
        'Fast and intuitive interface that saves hours of document formatting',
      ],
      hi: [
        'शून्य छिपे हुए शुल्क के साथ उपयोग करने के लिए पूरी तरह से मुफ्त',
        'भर्तीकर्ताओं के स्क्रीनिंग फिल्टर पास करने के लिए एटीएस-अनुकूल संरचना',
        'स्वच्छ, परिष्कृत लेआउट जो पहली नज़र में गहरा प्रभाव छोड़ता है',
        'तेज़ और सहज इंटरफ़ेस जो घंटों का फ़ॉर्मेटिंग समय बचाता है',
      ],
    },
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'jsPDF', 'HTML5 Canvas', 'Vercel Cloud'],
  },
];

