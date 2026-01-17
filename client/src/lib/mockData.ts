export interface University {
  id: string;
  name: string;
  nameAr: string;
  location: string;
  locationAr: string;
  rating: number;
  fees: number;
  image: string;
  description: string;
  descriptionAr: string;
}

export interface College {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  majors: Major[];
}

export interface Major {
  id: string;
  name: string;
  nameAr: string;
  collegeId: string;
  description: string;
  descriptionAr: string;
  years: number;
  fees: number;
  gpa: number;
}

export interface Article {
  id: string;
  title: string;
  titleAr: string;
  image: string;
  universityId: string;
  universityName: string;
  universityNameAr: string;
  date: string;
  content: string;
}

import uniImage1 from '@assets/generated_images/classic_university_building.png';
import uniImage2 from '@assets/generated_images/high-tech_engineering_campus.png';
import uniImage3 from '@assets/generated_images/modern_university_campus_hero.png';

export const universities: University[] = [
  {
    id: '1',
    name: 'King Saud University',
    nameAr: 'جامعة الملك سعود',
    location: 'Riyadh, Saudi Arabia',
    locationAr: 'الرياض، المملكة العربية السعودية',
    rating: 4.8,
    fees: 0,
    image: uniImage1,
    description: 'A premier public university in Riyadh, known for its extensive research programs.',
    descriptionAr: 'جامعة حكومية رائدة في الرياض، تشتهر ببرامجها البحثية المكثفة.'
  },
  {
    id: '2',
    name: 'King Fahd University of Petroleum & Minerals',
    nameAr: 'جامعة الملك فهد للبترول والمعادن',
    location: 'Dhahran, Saudi Arabia',
    locationAr: 'الظهران، المملكة العربية السعودية',
    rating: 4.9,
    fees: 0,
    image: uniImage2,
    description: 'Specialized in science, engineering, and management. A hub for innovation.',
    descriptionAr: 'متخصصة في العلوم والهندسة والإدارة. مركز للابتكار.'
  },
  {
    id: '3',
    name: 'Alfaisal University',
    nameAr: 'جامعة الفيصل',
    location: 'Riyadh, Saudi Arabia',
    locationAr: 'الرياض، المملكة العربية السعودية',
    rating: 4.5,
    fees: 80000,
    image: uniImage3,
    description: 'A private non-profit university offering world-class education.',
    descriptionAr: 'جامعة خاصة غير ربحية تقدم تعليماً بمستوى عالمي.'
  }
];

export const colleges: College[] = [
  {
    id: 'c1',
    name: 'College of Engineering',
    nameAr: 'كلية الهندسة',
    image: uniImage2,
    majors: []
  },
  {
    id: 'c2',
    name: 'College of Medicine',
    nameAr: 'كلية الطب',
    image: uniImage3,
    majors: []
  },
  {
    id: 'c3',
    name: 'College of Computer Science',
    nameAr: 'كلية علوم الحاسب',
    image: uniImage2,
    majors: []
  }
];

export const majors: Major[] = [
  {
    id: 'm1',
    name: 'Software Engineering',
    nameAr: 'هندسة البرمجيات',
    collegeId: 'c3',
    description: 'Learn to design and build complex software systems.',
    descriptionAr: 'تعلم تصميم وبناء أنظمة البرمجيات المعقدة.',
    years: 4,
    fees: 80000,
    gpa: 4.5
  },
  {
    id: 'm2',
    name: 'Civil Engineering',
    nameAr: 'الهندسة المدنية',
    collegeId: 'c1',
    description: 'Design and oversee construction of infrastructure projects.',
    descriptionAr: 'تصميم والإشراف على بناء مشاريع البنية التحتية.',
    years: 4,
    fees: 75000,
    gpa: 4.0
  },
  {
    id: 'm3',
    name: 'Medicine',
    nameAr: 'الطب',
    collegeId: 'c2',
    description: 'Prepare for a career in healthcare and patient treatment.',
    descriptionAr: 'الاستعداد لمهنة في مجال الرعاية الصحية وعلاج المرضى.',
    years: 7,
    fees: 120000,
    gpa: 4.8
  }
];

// Link majors to colleges
colleges[0].majors.push(majors[1]);
colleges[1].majors.push(majors[2]);
colleges[2].majors.push(majors[0]);

export const articles: Article[] = [
  {
    id: 'a1',
    title: 'Top 10 Tips for Freshmen',
    titleAr: 'أهم 10 نصائح للطلاب المستجدين',
    image: uniImage1,
    universityId: '1',
    universityName: 'King Saud University',
    universityNameAr: 'جامعة الملك سعود',
    date: '2025-10-15',
    content: 'Starting university can be daunting. Here are some tips to help you succeed...'
  },
  {
    id: 'a2',
    title: 'The Future of AI in Education',
    titleAr: 'مستقبل الذكاء الاصطناعي في التعليم',
    image: uniImage2,
    universityId: '2',
    universityName: 'KFUPM',
    universityNameAr: 'جامعة الملك فهد',
    date: '2025-11-01',
    content: 'How artificial intelligence is reshaping the way we learn and teach...'
  }
];
