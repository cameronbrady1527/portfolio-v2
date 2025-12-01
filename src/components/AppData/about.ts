/*
 *  DATA STORAGE FOR ABOUT PAGE
 *  Storage of data for journey timeline, experiences, volunteer work, and personal interests
 */

// Type definitions
export interface JourneyTimelineItem {
  year: string;
  period: string;
  title: string;
  description: string;
  iconName: 'Heart' | 'GraduationCap' | 'TreePine' | 'Zap' | 'Brain' | 'Code' | 'Stethoscope' | 'Lightbulb' | 'Briefcase' | 'BookOpen';
  color: string;
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  iconName: 'Code' | 'Briefcase' | 'BookOpen' | 'GraduationCap' | 'TreePine' | 'Brain';
  color: 'blue' | 'purple' | 'green' | 'indigo' | 'emerald' | 'pink';
  current?: boolean; // Mark if this is a current/active position
}

export interface VolunteerWork {
  title: string;
  role: string;
  description: string;
  imageAlt: string;
  imageSrc?: string; // Optional - will be added when photos are available
  imageClassName?: string; // Optional - custom positioning classes for the image
  link?: string; // Optional - external link for the organization
}

export interface PersonalInterest {
  title: string;
  description: string;
  imageAlt: string;
  imageSrc?: string; // Optional - will be added when photos are available
  gradientFrom: string;
  gradientTo: string;
}

export interface AboutData {
  journeyTimeline: JourneyTimelineItem[];
  experiences: Experience[];
  volunteerWork: VolunteerWork[];
  personalInterests: PersonalInterest[];
}

// Journey Timeline Data
const journeyTimeline: JourneyTimelineItem[] = [
  {
    year: "2018-2019",
    period: "The Beginning",
    title: "Service & Discovery",
    description: "Started tutoring classmates in CS and advanced STEM subjects while volunteering with Sparrows Nest and Appalachia Service Project, renovating homes for families in need. Discovered the power of combining technical skills with a genuine, passionate devotion to others.",
    iconName: "Heart",
    color: "from-red-500 to-pink-500"
  },
  {
    year: "2019-2023",
    period: "Entrepreneurship",
    title: "Building for Impact",
    description: "Co-founded and scaled The Clover Project to donate 25+ tons of produce to food banks across the Hudson Valley. Built volunteer tracking systems and sustainable agricultural practices.",
    iconName: "TreePine",
    color: "from-green-500 to-emerald-500"
  },
  {
    year: "2019-2024",
    period: "Cornell",
    title: "Education & Leadership",
    description: "Managed and developed the Clove Project through college, while studying Computer Science, Applied Economics, and Agricultural Sciences at Cornell. Rose to Head Teaching Assistant in an upper-level class, leading teams and using data analytics to improve student outcomes. Applied new technical skills to the Clover Project to streamline efficiency and prioritize impact.",
    iconName: "GraduationCap",
    color: "from-blue-500 to-purple-500"
  },
  {
    year: "2024-Present",
    period: "Today",
    title: "Multi-Faceted Career",
    description: "Software engineer building AI applications, substitute teacher, tutor, nonprofit consultant, and researcher developing ML systems for early Alzheimer's detection. Serving on Walk to End Alzheimer's committee. Learning in-demand technical skills through research and application, especially in the AI and Machine Learning space.",
    iconName: "Zap",
    color: "from-orange-500 to-yellow-500"
  }
];

// Professional Experience Data
const experiences: Experience[] = [
  {
    title: "Software Engineer",
    company: "Astral",
    period: "Jun 2025 - Present",
    description: "Building full-stack AI-powered web applications and web crawling automations for clients and the Astral platform.",
    iconName: "Code",
    color: "blue",
    current: true
  },
  {
    title: "Independent Nonprofit Consultant",
    company: "Community Mindfulness Project",
    period: "Jan 2025 - Jun 2025",
    description: "Developed free, open-source nonprofit data analysis tools covering 1.8M+ organizations. Created digital board handbook and advised on strategic program development.",
    iconName: "Briefcase",
    color: "purple"
  },
  {
    title: "Substitute Teacher",
    company: "Arlington Central School District",
    period: "2024 - Present",
    description: "K-12 classroom coverage across all subjects. Specialized in supporting students with IEPs and learning disabilities through personalized instruction.",
    iconName: "BookOpen",
    color: "green",
    current: true
  },
  {
    title: "Head Teaching Assistant",
    company: "Cornell Dyson School",
    period: "Aug 2022 - Jan 2024",
    description: "Led team of 5 TAs for Farm Business Management course. Used data analytics to tailor lesson planning and improve student engagement and performance.",
    iconName: "GraduationCap",
    color: "indigo"
  },
  {
    title: "CEO & Co-Founder",
    company: "The Clover Project",
    period: "Feb 2019 - May 2023",
    description: "Founded nonprofit farm organization fighting food insecurity. Donated 25+ tons of produce and built SQL volunteer tracking system. Now restructuring for national expansion.",
    iconName: "TreePine",
    color: "emerald"
  },
  {
    title: "Independent Tutor",
    company: "Private Practice",
    period: "2018 - Present",
    description: "K-12 tutoring specializing in math and science subjects. Consistently high success rates through personalized, adaptive teaching approaches.",
    iconName: "Brain",
    color: "pink",
    current: true
  }
];

// Volunteer Work Data
const volunteerWork: VolunteerWork[] = [
  {
    title: "Walk to End Alzheimer's",
    role: "Community Engagement Committee",
    description: "Recruiting volunteers and raising community awareness about Alzheimer's disease and research funding.",
    imageAlt: "Walk to End Alzheimer's event",
    imageSrc: "/imgs/alz-walk-research.jpg",
    imageClassName: "object-top",
    link: "https://act.alz.org/site/SPageServer?pagename=walk_about"
  },
  {
    title: "The Clover Project",
    role: "Founder & CEO",
    description: "25+ tons of fresh produce donated to food banks and families facing food insecurity across the Hudson Valley.",
    imageAlt: "Clover Project garden",
    imageSrc: "/imgs/clover-aerial.jpeg"
  },
  {
    title: "Appalachia Service Project",
    role: "Volunteer (2018-2019)",
    description: "Home renovation and repair for low-income families in the lower Appalachian region.",
    imageAlt: "Home renovation project",
    imageSrc: "/imgs/asp-working.jpeg",
    link: "https://asphome.org/"
  },
  {
    title: "Sparrow's Nest",
    role: "Volunteer & Donor",
    description: "Supporting families affected by cancer through produce donations, volunteer service, and fundraising.",
    imageAlt: "Community service",
    imageSrc: "/imgs/sparrows-race.jpeg",
    link: "https://sparrowsnestcharity.org/"
  }
];

// Personal Interests Data
const personalInterests: PersonalInterest[] = [
  {
    title: "Running",
    description: "Staying fit and clearing my mind on the trails",
    imageAlt: "Running",
    gradientFrom: "blue-200",
    gradientTo: "blue-300",
    imageSrc: "/imgs/running.jpeg"
  },
  {
    title: "NY Rangers",
    description: "Lifelong hockey fan and Rangers supporter",
    imageAlt: "NY Rangers fan",
    gradientFrom: "slate-200",
    gradientTo: "slate-300",
    imageSrc: "/imgs/nyrangers.jpeg"
  },
  {
    title: "Reading & Nature",
    description: "Finding inspiration in books and the outdoors",
    imageAlt: "Nature and reading",
    gradientFrom: "green-200",
    gradientTo: "green-300",
    imageSrc: "/imgs/reading-spot.jpeg"
  }
];

// Combined About Data
const ABOUT_DATA: AboutData = {
  journeyTimeline,
  experiences,
  volunteerWork,
  personalInterests
};

export default ABOUT_DATA;
