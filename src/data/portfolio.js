const portfolio = {
  name: 'N Dhanya',
  brand: 'N Dhanya.',
  title: 'Freelance Web Developer',
  email: 'dhanyanesam05@gmail.com',
  github: 'https://github.com/Dhanya-15',
  timezone: 'Asia/Kolkata',

  hero: {
  eyebrow: 'Independent Freelancer',
  greeting: "Hi, I'm Dhanya.",
  lead: 'I am',
  roles: ['a Web Developer', 'Available for Work', 'a Creative Developer'],
  intro: 'I design and build fast, responsive React websites with creative, interactive details for real users.',
  footerLeft: 'Available for work',
  footerCenter: 'Chennai, India · Remote friendly',
  footerRight: 'Scroll to explore',
},
services: {
  heading: 'Magic happens behind the doors',
  doorLabel: 'Web Development',
  hint: 'Click the door to step inside',
  phrases: ['Your Vision.', 'My Code.', 'Our Creation.'],
},

  portrait: { src: 'public/images/dhanya.png', alt: 'Portrait of N Dhanya' }, // e.g. '/images/dhanya.jpg'

  skills: [
    { group: 'Frontend', items: ['React.js', 'JavaScript (ES6+)', 'Tailwind CSS', 'GSAP'] },
    { group: 'Backend', items: ['Node.js', 'MongoDB', 'Python'] },
  ],

  projects: [
    {
      id: 'mindful-movement-tribe',
      name: 'Mindful Movement Tribe',
      category: 'Wellness Website',
      description: 'Mindful Movement Tribe is a modern, responsive React website developed for a certified yoga instructor with over 4 years of experience. Designed with a calming blue color palette and smooth animations, the website showcases yoga classes, professional certifications, workshops, and international client testimonials. It also features a custom contact form to help visitors connect with the instructor and enroll in yoga sessions.',
      features: ['Feature one', 'Feature two', 'Feature three'],
      tech: ['React.js','JavaScript','Tailwind CSS'],
      liveUrl: 'https://mindful-movement-tribe.vercel.app/',
      color: '#fde2e4',
      logo: '',
      screenshot: '',
      embeddable: true,
    },
    {
      id: 'project-calm-signal',
      name: 'Project Calm Signal',
      category: 'Web App',
      description: 'Replace with your exact description.',
      features: ['Feature one', 'Feature two', 'Feature three'],
      tech: ['React', 'Node.js'],
      liveUrl: 'https://dhanya-15.github.io/Project-Calm-Signal/',
      color: '#dbe7ff',
      logo: '',
      screenshot: '',
      embeddable: true,
    },
    {
      id: 'myjournal',
      name: 'MyJournal',
      category: 'Personal Project',
      description: 'Replace with your exact description.',
      features: ['Feature one', 'Feature two', 'Feature three'],
      tech: ['React', 'MongoDB', 'Node.js'],
      liveUrl: 'https://my-journal-eta-one.vercel.app/',
      color: '#e2f5df',
      logo: '',
      screenshot: '',
      embeddable: true,
    },
    {
      id: 'fitverse',
      name: 'Fitverse – 3D Workout Tracker',
      category: 'Personal Project',
      description: 'Replace with your exact description.',
      features: ['Feature one', 'Feature two', 'Feature three'],
      tech: ['React', 'CSS 3D'],
      liveUrl: 'https://dhanya-15.github.io/fitverse-workout-web/',
      color: '#fff1c9',
      logo: '',
      screenshot: '',
      embeddable: true,
    },
  ],

  story: { label: 'My story', heading: 'Let’s go back in time.' },

  timeline: [
    { short: 'OCT 2026', title: 'Project Calm Signal', role: 'Freelance Web Developer', projectId: 'project-calm-signal', year: '2026', points: [] },
    { short: 'JUL 2026 — AUG 2026', title: 'Mindful Movement Tribe', role: 'Freelance Web Developer', projectId: 'mindful-movement-tribe', year: '2026', points: [] },
    { short: 'NOV 2025 — DEC 2025', title: 'Fitverse', role: 'Personal Project', projectId: 'fitverse', year: '2025', points: [] },
    { short: 'JUN 2025 — JUL 2025', title: 'MyJournal', role: 'Personal Project', projectId: 'myjournal', year: '2025', points: [] },
  ],
  features: {
    linkedin: { enabled: false, url: '' },
    testimonials: { enabled: false, items: [] },
  },
};

export default portfolio;