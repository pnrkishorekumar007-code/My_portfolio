/**
 * Studio Content Data
 * 
 * Custom content for Kishorekumar R's monitor towers.
 */

export const PLATFORM_CONFIG = {
    youtube: {
        color: '#FF0000',
        accentColor: '#cc0000',
        icon: '▶',
        label: 'Tech Video',
        shape: 'tv',
    },
    blog: {
        color: '#eab308',
        accentColor: '#ca8a04',
        icon: '📝',
        label: 'Case Study',
        shape: 'monitor',
    },
    tiktok: {
        color: '#00F2EA',
        accentColor: '#FF0050',
        icon: '📱',
        label: 'Micro Log',
        shape: 'phone',
    },
    linkedin: {
        color: '#0077B5',
        accentColor: '#005E93',
        icon: 'in',
        label: 'Milestone',
        shape: 'monitor',
    },
    codrops: {
        color: '#0099FF',
        accentColor: '#0077CC',
        icon: '💧',
        label: 'Featured',
        shape: 'monitor',
    },
    github: {
        color: '#333333',
        accentColor: '#24292e',
        icon: '⌂',
        label: 'Profile',
        shape: 'monitor',
    },
    instagram: {
        color: '#E1306C',
        accentColor: '#C13584',
        icon: '📷',
        label: 'Social',
        shape: 'phone',
    },
};

const RAW_CONTENT_DATA = [
    // ============ Education ============
    {
        id: 'studio-education',
        platform: 'linkedin',
        title: 'BCA — SRM University, Chennai',
        description: 'Bachelor of Computer Applications with a focus on full-stack web development, Python/Django, and JavaScript ecosystems.',
        thumbnail: null,
        url: 'https://www.linkedin.com/in/kishore007kumar',
        date: '2024-08-01',
        readTime: '3 min',
    },
    // ============ Experience ============
    {
        id: 'studio-elevanceskills-internship',
        platform: 'linkedin',
        title: 'Full Stack Developer Intern — ElevanceSkills',
        description: 'Shipped incremental upgrades to a live Twitter/X clone: payments integration, forgot-password recovery, device-aware login security, audio tweets, and multilingual support.',
        thumbnail: null,
        url: 'https://www.linkedin.com/in/kishore007kumar',
        date: '2026-03-15',
        readTime: '4 min',
    },
    {
        id: 'studio-internship',
        platform: 'linkedin',
        title: 'Full Stack Developer Intern — Inspire Softech',
        description: 'Structured 3-month internship building responsive interfaces with HTML/CSS/Bootstrap/JS and back-end logic with Python and Django.',
        thumbnail: null,
        url: 'https://www.linkedin.com/in/kishore007kumar',
        date: '2025-09-01',
        readTime: '5 min',
    },
    // ============ Projects ============
    {
        id: 'studio-healthmate',
        platform: 'blog',
        title: 'HealthMate — Solo Full-Stack Build',
        description: 'A health-management web app built end-to-end — Django/Python backend, user authentication, health tracking dashboards, and a responsive HTML/CSS/JS frontend.',
        frontTexture: '/textures/studio/monitorfront_postnafbdoublewinner.webp',
        paintedFrontTexture: '/textures/studio/monitorfront_postnafbdoublewinner_painted.webp',
        thumbnail: null,
        url: 'https://github.com/pnrkishorekumar007-code/healthmate',
        date: '2025-06-01',
        readTime: '6 min',
    },
    {
        id: 'studio-zivah',
        platform: 'blog',
        title: 'Zivah Styles — E-Commerce Frontend',
        description: 'A clothing shop web app with structured HTML/CSS/JS modules — interactive product browsing and dynamic page behaviour.',
        frontTexture: '/textures/studio/tvfront_filmikprojektdlamultiego.webp',
        paintedFrontTexture: '/textures/studio/tvfront_filmikprojektdlamultiego_painted.webp',
        thumbnail: null,
        url: 'https://github.com/pnrkishorekumar007-code/zivah-styles-v',
        date: '2026-01-15',
        readTime: '5 min',
    },
    {
        id: 'studio-codewave-clg',
        platform: 'blog',
        title: 'CodeWave CLG — Registration Portal',
        description: 'An online college event registration portal with a clean, form-based interface for student sign-ups.',
        frontTexture: '/textures/studio/tvfront_filmikedytowaniezdjec.webp',
        paintedFrontTexture: '/textures/studio/tvfront_filmikedytowaniezdjec_painted.webp',
        thumbnail: null,
        url: 'https://github.com/pnrkishorekumar007-code/codewave-clg',
        date: '2026-02-10',
        readTime: '4 min',
    },
    {
        id: 'studio-twiller',
        platform: 'blog',
        title: 'Twiller — Full-Stack Twitter Clone',
        description: 'A full-stack Twitter/X clone with subscription payments, forgot-password recovery, device-aware login security, audio tweets, and multilingual support, backed by an Express/MongoDB API.',
        thumbnail: null,
        url: 'https://twiller-nine.vercel.app',
        date: '2026-04-01',
        readTime: '6 min',
    },
    {
        id: 'studio-janvoice',
        platform: 'blog',
        title: 'JanVoice — Voice-Based Citizen Complaints',
        description: 'A multilingual platform where citizens speak a complaint aloud and it gets transcribed, classified, and routed to the right government department — built with Next.js and MongoDB.',
        thumbnail: null,
        url: 'https://voice-mu-two.vercel.app/',
        date: '2026-05-01',
        readTime: '5 min',
    },
    {
        id: 'studio-alumni-nexus',
        platform: 'blog',
        title: 'Alumni Nexus — SRM Networking Platform',
        description: 'An alumni networking platform for SRM University connecting students and graduates for mentorship and community engagement — built with React and Tailwind.',
        thumbnail: null,
        url: 'https://github.com/pnrkishorekumar007-code/Alumni-Nexus',
        date: '2026-03-01',
        readTime: '4 min',
    },
    {
        id: 'studio-tb-creation',
        platform: 'blog',
        title: 'TB Creation — Manga Publishing Platform',
        description: 'A manga/comic publishing platform with a friend — script and comic uploads, author profiles, bookmarks, and a chapter-reading experience.',
        thumbnail: null,
        url: 'https://github.com/pnrkishorekumar007-code/TB-Creation',
        date: '2025-11-01',
        readTime: '4 min',
    },
    // ============ Events & Hackathons ============
    {
        id: 'studio-codewave-hackathon',
        platform: 'linkedin',
        title: 'CodeWave 2026 — Technical Team',
        description: 'Served on the Technical Team, Support Team, and as Disciplinary Head for a large-scale intercollegiate hackathon.',
        thumbnail: null,
        url: 'https://www.linkedin.com/in/kishore007kumar',
        date: '2026-02-20',
        readTime: '3 min',
    },
    {
        id: 'studio-byteblitz',
        platform: 'linkedin',
        title: 'ByteBlitz 2026 — Organizing Team',
        description: 'Contributed to event planning, execution, and coordination as part of the organizing team for a non-technical intercollegiate event.',
        thumbnail: null,
        url: 'https://www.linkedin.com/in/kishore007kumar',
        date: '2026-01-05',
        readTime: '3 min',
    },
    // ============ Creative ============
    {
        id: 'studio-sketching',
        platform: 'tiktok',
        title: 'Sketching & Manga Illustration',
        description: 'Pencil sketching, portrait art, and manga illustration — published work through the Thunder Boys startup.',
        frontTexture: '/textures/studio/phonefront_followmeontiktok.webp',
        paintedFrontTexture: '/textures/studio/phonefront_followmeontiktok_painted.webp',
        thumbnail: null,
        url: '#',
        date: '2025-12-01',
        views: '—',
        likes: '—',
    },
    // ============ Social & Profiles ============
    {
        id: 'studio-github',
        platform: 'github',
        title: 'GitHub — Open Source & Projects',
        description: 'Explore my open-source contributions, personal projects, and code repositories — full-stack apps, hackathon builds, and experimental work.',
        thumbnail: null,
        url: 'https://github.com/pnrkishorekumar007-code',
        date: '2026-01-01',
        readTime: '—',
    },
    {
        id: 'studio-linkedin',
        platform: 'linkedin',
        title: 'LinkedIn — Professional Network',
        description: 'Connect with me professionally — work experience, endorsements, certifications, and career updates.',
        thumbnail: null,
        url: 'https://www.linkedin.com/in/kishore007kumar',
        date: '2026-01-01',
        readTime: '—',
    },
    {
        id: 'studio-instagram',
        platform: 'instagram',
        title: 'Instagram — @__.kishoree',
        description: 'Creative work, sketches, manga illustrations, and behind-the-scenes from hackathons and campus events.',
        thumbnail: null,
        url: 'https://www.instagram.com/__.kishoree',
        date: '2026-01-01',
        views: '—',
        likes: '—',
    },
    {
        id: 'studio-resume',
        platform: 'tiktok',
        title: 'Resume — Full Portfolio CV',
        description: 'Download or view my complete resume with education, internships, skills, and project highlights.',
        thumbnail: null,
        url: '/resume.pdf',
        date: '2026-01-01',
        views: '—',
        likes: '—',
    },
];

const ytTextures = ['/textures/studio/tvfront_filmikprojektdlamultiego.webp', '/textures/studio/tvfront_filmikedytowaniezdjec.webp'];
const ytPaintedTextures = ['/textures/studio/tvfront_filmikprojektdlamultiego_painted.webp', '/textures/studio/tvfront_filmikedytowaniezdjec_painted.webp'];
const blogTextures = ['/textures/studio/monitorfront_postnafbdoublewinner.webp'];
const blogPaintedTextures = ['/textures/studio/monitorfront_postnafbdoublewinner_painted.webp'];
const ttTextures = ['/textures/studio/phonefront_followmeontiktok.webp'];
const ttPaintedTextures = ['/textures/studio/phonefront_followmeontiktok_painted.webp'];

let ytIdx = 0, blogIdx = 0, ttIdx = 0;
let ytPIdx = 0, blogPIdx = 0, ttPIdx = 0;

export const CONTENT_DATA = RAW_CONTENT_DATA.map((item) => {
    return {
        ...item,
        frontTexture: item.frontTexture || (
            item.platform === 'youtube' ? ytTextures[ytIdx++ % ytTextures.length] :
                item.platform === 'blog' ? blogTextures[blogIdx++ % blogTextures.length] :
                    ttTextures[ttIdx++ % ttTextures.length]
        ),
        paintedFrontTexture: item.paintedFrontTexture || (
            item.platform === 'youtube' ? ytPaintedTextures[ytPIdx++ % ytPaintedTextures.length] :
                item.platform === 'blog' ? blogPaintedTextures[blogPIdx++ % blogPaintedTextures.length] :
                    ttPaintedTextures[ttPIdx++ % ttPaintedTextures.length]
        )
    };
});

export const getContentByPlatform = (platform) => {
    if (platform === 'all') return CONTENT_DATA;
    return CONTENT_DATA.filter(item => item.platform === platform);
};

export const getLatestContent = () => {
    return [...CONTENT_DATA].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
};
