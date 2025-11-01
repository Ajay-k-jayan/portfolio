/**
 * LinkedIn Recommendations Data
 * 
 * NOTE: LinkedIn doesn't provide a public API for fetching recommendations.
 * You need to manually copy your recommendations from your LinkedIn profile:
 * https://www.linkedin.com/in/ajay-k-jayan/recommendations/
 * 
 * Steps to add recommendations:
 * 1. Go to your LinkedIn profile recommendations section
 * 2. For each recommendation, copy:
 *    - Person's name
 *    - Their position/title
 *    - Company name
 *    - Recommendation text/quote
 *    - Date received
 *    - Their LinkedIn profile URL (click on their name)
 *    - Company website URL (if available)
 * 3. Add it to this array following the structure below
 */

export interface Recommendation {
  id: string
  name: string
  position: string
  company: string
  companyUrl?: string
  linkedinUrl?: string
  avatar?: string
  quote: string
  date: string
  rating?: number
  relationship: string
}

export const recommendationsData: Recommendation[] = [
  {
    id: '1',
    name: 'Aswin K T',
    position: 'Software Engineer | Python Developer | Backend Specialist | Problem Solver',
    company: 'Current Company',
    linkedinUrl: 'https://www.linkedin.com/in/aswin-k-t',
    quote: 'I had the pleasure of working with Ajay KJ since our internship days, and I\'ve seen him grow into a highly skilled and dependable front-end developer. His expertise in Angular is exceptional, and his ability to quickly adapt to new challenges and technologies is impressive. Ajay consistently brought fresh ideas to the table and collaborated seamlessly with the team. I\'ve learned a lot from working alongside him, and I\'m confident he will be an asset to any organization he joins.',
    date: '2025-07-29',
    rating: 5,
    relationship: 'Former Colleague'
  },
  {
    id: '2',
    name: 'Ushanandini A',
    position: 'Senior Software Developer',
    company: 'Current Company',
    linkedinUrl: 'https://www.linkedin.com/in/ushanandini-a',
    quote: 'Ajay is a very talented person that I know from Beinex . He is smart and always on top for problem solving. He always try to learn something new.Im very much happy that I could work with him.',
    date: '2025-04-08',
    rating: 5,
    relationship: 'Former Colleague'
  },
  {
    id: '3',
    name: 'Haritha Unni',
    position: 'Frontend Developer',
    company: 'Current Company',
    linkedinUrl: 'https://www.linkedin.com/in/haritha-unni',
    quote: 'Ajay is a highly skilled and hardworking Angular developer with a deep understanding of front-end technologies. He is a problem-solver, always eager to learn and adapt to new challenges, making him a valuable asset to any development team. Highly recommended for any project requiring expertise in Angular and front-end development!',
    date: '2025-01-30',
    rating: 5,
    relationship: 'Former Colleague'
  },
  {
    id: '4',
    name: 'Alan Babu',
    position: 'Software Engineer',
    company: 'Beinex',
    linkedinUrl: 'https://www.linkedin.com/in/alan-babu',
    quote: 'I had the pleasure of working with Ajay, and I can confidently say he is an outstanding software developer. His expertise in Angular, keen attention to detail, and exceptional problem-solving skills are truly remarkable. He is a fantastic team player and always ready to take on challenges.',
    date: '2025-01-15',
    rating: 5,
    relationship: 'Former Colleague'
  },
]

