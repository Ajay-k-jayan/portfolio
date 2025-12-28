// Comprehensive translation system for all languages

export type LanguageCode = 
  | 'en-US' | 'ml' | 'hi'

export interface Language {
  code: LanguageCode
  name: string
  nativeName: string
  flag: string
}

export const languages: Language[] = [
  // Working languages with full translations
  { code: 'en-US', name: 'English', nativeName: 'English (US)', flag: '🇺🇸' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
]

// Translation keys - comprehensive list
export interface Translations {
  // Common
  searchPlaceholder: string
  changeLanguage: string
  theme: string
  settings: string
  save: string
  cancel: string
  reset: string
  apply: string
  
  // Navigation
  welcome: string
  about: string
  projects: string
  skills: string
  experience: string
  contact: string
  achievements: string
  certifications: string
  blogs: string
  recommendations: string
  socialMedias: string
  
  // Welcome Page
  welcomeTitle: string
  welcomeSubtitle: string
  quickStart: string
  recent: string
  activity: string
  insights: string
  shortcuts: string
  overview: string
  contactInformation: string
  features: string
  quickLinks: string
  resume: string
  downloadResume: string
  getInTouch: string
  viewProjects: string
  
  // Stats
  yearsExperience: string
  projectsCompleted: string
  skillsMastered: string
  certificationsCount: string
  
  // Settings
  appearance: string
  notifications: string
  navigation: string
  header: string
  statusBar: string
  language: string
  selectLanguage: string
  fontSize: string
  fontFamily: string
  animationSpeed: string
  showStats: string
  showSocialLinks: string
  showRecentItems: string
  showResumeDownload: string
  
  // Actions
  viewAll: string
  download: string
  copy: string
  copied: string
  open: string
  close: string
  
  // Contact
  name: string
  email: string
  phone: string
  location: string
  available: string
  openToOpportunities: string
  sendEmail: string
  message: string
  subject: string
  
  // Status
  success: string
  error: string
  warning: string
  info: string
  loading: string
  
  // Skills Page
  skillsPageTitle: string
  skillsPageDescription: string
  frontendLanguages: string
  programmingLanguages: string
  frameworksAndLibraries: string
  versionControl: string
  tools: string
  areasOfExpertise: string
  searchSkills: string
  filter: string
  sortBy: string
  viewMode: string
  gridView: string
  listView: string
  networkView: string
  allCategories: string
  allLevels: string
  expert: string
  advanced: string
  intermediate: string
  beginner: string
  sortByName: string
  sortByLevel: string
  sortByYears: string
  sortByCategory: string
  ascending: string
  descending: string
  showFilters: string
  hideFilters: string
  resetFilters: string
  verified: string
  years: string
  level: string
  category: string
  
  // Projects Page
  projectsPageTitle: string
  projectsPageDescription: string
  featuredProjects: string
  showCodePreview: string
  showLiveDemo: string
  viewCode: string
  viewDemo: string
  technologies: string
  period: string
  sortByPeriod: string
  sortByTitle: string
  
  // Experience Page
  experiencePageTitle: string
  experiencePageDescription: string
  workExperience: string
  company: string
  sortByCompany: string
  
  // Social Media Page
  socialMediaPageTitle: string
  socialMediaPageDescription: string
  connectWithMe: string
  socialPlatforms: string
  githubProfile: string
  recentRepositories: string
  contactForm: string
  yourName: string
  yourEmail: string
  emailSubject: string
  writeMessage: string
  openingEmail: string
  emailOpened: string
  all: string
  development: string
  professional: string
  communication: string
  social: string
  followers: string
  following: string
  repositories: string
  searchPlatforms: string
  
  // Recommendations Page
  recommendationsPageTitle: string
  recommendationsPageDescription: string
  testimonials: string
  sortByDate: string
  position: string
  
  // Settings Page
  display: string
  content: string
  compactView: string
  showAnimations: string
  chooseColorTheme: string
  adjustTextSize: string
  chooseFontStyle: string
  displayStatsOnWelcomePage: string
  displaySocialMediaLinks: string
  displayGitHubProfileData: string
  displayRecentlyViewedItems: string
  notifyAboutUpdates: string
  fastAccessToPages: string
  displayRecentItemsInSidebar: string
  showThemeSelectorInHeader: string
  showLanguageSelectorInHeader: string
  showDateAndTimeInStatusBar: string
  showWeatherInformation: string
  showCurrentLocation: string
  showNetworkLatency: string
  showCpuAndMemoryUsage: string
  showSocialMediaLinks: string
  showResumeDownloadButton: string
  useCompactSpacing: string
  enableSmoothTransitions: string
  controlAnimationDuration: string
  resetToDefaults: string
  settingsReset: string
  allSettingsRestoredToDefaults: string
  settingChanged: string
  updated: string
  
  // Common UI
  search: string
  noResultsFound: string
  filterBy: string
  sort: string
  view: string
  show: string
  hide: string
  expand: string
  collapse: string
  select: string
  clear: string
  confirm: string
  delete: string
  edit: string
  back: string
  next: string
  previous: string
  more: string
  less: string
  
  // File Explorer
  fileExplore: string
  explorer: string
  files: string
  folders: string
  openFile: string
  closeFile: string
  
  // Form Validation
  required: string
  invalidEmail: string
  minLength: string
  maxLength: string
  characters: string
  minimumRequired: string
  
  // Status Messages
  resumeDownloadStarted: string
  resumeDownloadComplete: string
  languageChanged: string
  themeChanged: string
  interfaceLanguageUpdated: string
  themeUpdated: string
  
  // Timeline Page
  timeline: string
  timelineDescription: string
  timelinePageTitle: string
  horizontalView: string
  verticalView: string
  searchTimeline: string
  allEvents: string
  education: string
  noEventsFound: string
  noEventsToDisplay: string
  ongoing: string
  keyAchievements: string
  event: string
  events: string
  totalEvents: string
  
  // Welcome Tab Additional
  newProject: string
  openProject: string
  cloneFromGit: string
  contactMe: string
  generateAgentInstructions: string
  openProjectsTab: string
  repositoryOpened: string
  portfolioRepositoryOpened: string
  openingAIChatbot: string
  getStartedWithPortfolio: string
  exploreSkillsProjects: string
  learnTheFundamentals: string
  discoverCoreTechnologies: string
  viewResume: string
  downloadResumeLearn: string
  connectOnLinkedIn: string
  viewProfessionalProfile: string
  openingLinkedInProfile: string
  welcomeToPortfolio: string
  start: string
  contactMethods: string
  aurexProject: string
  noRecentItems: string
  more: string
  
  // Contact Form Additional
  whatsThisAbout: string
  tellMeAboutProject: string
  messageSentSuccessfully: string
  emailClientOpened: string
  sendMessage: string
  sortByNameAZ: string
  sortByNameZA: string
  noItemsFound: string
  clearSearch: string
  clearSearchFilters: string
  searchContactMethods: string
  sortContactItems: string
  allFieldsRequired: string
  emailClientOpenedPleaseSend: string
  failedToOpenEmailClient: string
  contactAndSocialMedia: string
  socialPlatforms: string
  professionalInfo: string
  githubRepositories: string
  availability: string
  company: string
  codeRepositories: string
  professionalNetwork: string
  secureMessaging: string
  availableForFreelance: string
  searchSettings: string
  showStatistics: string
  themeSwitcher: string
  languageSwitcher: string
  dateTime: string
  weather: string
  networkStatus: string
  systemInfo: string
  useCompactSpacing: string
  enableSmoothTransitions: string
  controlAnimationDuration: string
  chooseColorTheme: string
  selectInterfaceLanguage: string
  adjustTextSize: string
  chooseFontStyle: string
  displayStatsOnWelcomePage: string
  displayGitHubProfileData: string
  displayRecentlyViewedItems: string
  fastAccessToPages: string
  displayRecentItemsInSidebar: string
  showThemeSelectorInHeader: string
  showLanguageSelectorInHeader: string
  showDateAndTimeInStatusBar: string
  showWeatherInformation: string
  showCurrentLocation: string
  showNetworkLatency: string
  showCpuAndMemoryUsage: string
  showSocialMediaLinks: string
  showResumeDownloadButton: string
  notifyAboutUpdates: string
  newest: string
  oldest: string
  noProjectsFound: string
  noProjectsAvailable: string
  noExperienceFound: string
  noExperienceAvailable: string
}

// Default English translations (US)
const enUSTranslations: Translations = {
  searchPlaceholder: 'Search',
  changeLanguage: 'Change Language',
  theme: 'Theme',
  settings: 'Settings',
  close: 'Close',
  save: 'Save',
  cancel: 'Cancel',
  reset: 'Reset',
  apply: 'Apply',
  
  welcome: 'Welcome',
  about: 'About',
  projects: 'Projects',
  skills: 'Skills',
  experience: 'Experience',
  contact: 'Contact',
  achievements: 'Achievements',
  certifications: 'Certifications',
  blogs: 'Blogs',
  recommendations: 'Recommendations',
  socialMedias: 'Social Media',
  
  welcomeTitle: 'Welcome, I\'m Ajay K J',
  welcomeSubtitle: 'Experienced front-end developer with 3+ years of demonstrated expertise in Angular programming, web development, and responsive UI design. Passionate about creating intuitive, performant, and accessible user experiences.',
  quickStart: 'Quick Start',
  recent: 'Recent',
  activity: 'Activity',
  insights: 'Insights',
  shortcuts: 'Shortcuts',
  overview: 'Overview',
  contactInformation: 'Contact Information',
  features: 'Features',
  quickLinks: 'Quick Links',
  resume: 'Resume',
  downloadResume: 'Download Resume',
  getInTouch: 'Get in Touch',
  viewProjects: 'View Projects',
  
  yearsExperience: 'Years Experience',
  projectsCompleted: 'Projects Completed',
  skillsMastered: 'Skills Mastered',
  certificationsCount: 'Certifications',
  
  appearance: 'Appearance',
  notifications: 'Notifications',
  navigation: 'Navigation',
  header: 'Header',
  statusBar: 'Status Bar',
  language: 'Language',
  selectLanguage: 'Select Language',
  fontSize: 'Font Size',
  fontFamily: 'Font Family',
  animationSpeed: 'Animation Speed',
  showStats: 'Show Stats',
  showSocialLinks: 'Show Social Links',
  showRecentItems: 'Show Recent Items',
  showResumeDownload: 'Show Resume Download',
  
  viewAll: 'View All',
  download: 'Download',
  copy: 'Copy',
  copied: 'Copied',
  open: 'Open',
  
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  location: 'Location',
  available: 'Available',
  openToOpportunities: 'Open to Opportunities',
  sendEmail: 'Send Email',
  message: 'Message',
  subject: 'Subject',
  
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
  loading: 'Loading',
  
  // Skills Page
  skillsPageTitle: 'Skills & Expertise',
  skillsPageDescription: 'Comprehensive overview of technical skills and proficiencies',
  frontendLanguages: 'Frontend Languages',
  programmingLanguages: 'Programming Languages',
  frameworksAndLibraries: 'Frameworks and Libraries',
  versionControl: 'Version Control',
  tools: 'Tools',
  areasOfExpertise: 'Areas of Expertise',
  searchSkills: 'Search skills...',
  filter: 'Filter',
  sortBy: 'Sort By',
  viewMode: 'View Mode',
  gridView: 'Grid View',
  listView: 'List View',
  networkView: 'Network View',
  allCategories: 'All Categories',
  allLevels: 'All Levels',
  expert: 'Expert',
  advanced: 'Advanced',
  intermediate: 'Intermediate',
  beginner: 'Beginner',
  sortByName: 'Sort by Name',
  sortByLevel: 'Sort by Level',
  sortByYears: 'Sort by Years',
  sortByCategory: 'Sort by Category',
  ascending: 'Ascending',
  descending: 'Descending',
  showFilters: 'Show Filters',
  hideFilters: 'Hide Filters',
  resetFilters: 'Reset Filters',
  verified: 'Verified',
  years: 'Years',
  level: 'Level',
  category: 'Category',
  
  // Projects Page
  projectsPageTitle: 'Featured Projects',
  projectsPageDescription: 'Showcase of my portfolio projects and case studies',
  featuredProjects: 'Featured Projects',
  showCodePreview: 'Show Code Preview',
  showLiveDemo: 'Show Live Demo',
  viewCode: 'View Code',
  viewDemo: 'View Demo',
  technologies: 'Technologies',
  period: 'Period',
  sortByPeriod: 'Sort by Period',
  sortByTitle: 'Sort by Title',
  
  // Experience Page
  experiencePageTitle: 'Work Experience',
  experiencePageDescription: 'Professional experience and career timeline',
  workExperience: 'Work Experience',
  company: 'Company',
  sortByCompany: 'Sort by Company',
  
  // Social Media Page
  socialMediaPageTitle: 'Social Medias',
  socialMediaPageDescription: 'Connect with me across various social media platforms',
  connectWithMe: 'Connect With Me',
  socialPlatforms: 'Social Platforms',
  githubProfile: 'GitHub Profile',
  recentRepositories: 'Recent Repositories',
  contactForm: 'Contact Form',
  yourName: 'Your Name',
  yourEmail: 'Your Email',
  emailSubject: 'Email Subject',
  writeMessage: 'Write your message here... (minimum 10 characters)',
  openingEmail: 'Opening Email...',
  emailOpened: 'Email Opened!',
  all: 'All',
  development: 'Development',
  professional: 'Professional',
  communication: 'Communication',
  social: 'Social',
  followers: 'Followers',
  following: 'Following',
  repositories: 'Repositories',
  searchPlatforms: 'Search platforms...',
  
  // Recommendations Page
  recommendationsPageTitle: 'Recommendations',
  recommendationsPageDescription: 'Testimonials and recommendations from colleagues, managers, and collaborators',
  testimonials: 'Testimonials',
  sortByDate: 'Sort by Date',
  sortByName: 'Sort by Name',
  position: 'Position',
  
  // Settings Page
  display: 'Display',
  content: 'Content',
  compactView: 'Compact View',
  showAnimations: 'Show Animations',
  chooseColorTheme: 'Choose color theme',
  adjustTextSize: 'Adjust text size',
  chooseFontStyle: 'Choose font style',
  displayStatsOnWelcomePage: 'Display stats on welcome page',
  displaySocialMediaLinks: 'Display social media links',
  displayGitHubProfileData: 'Display GitHub profile data',
  displayRecentlyViewedItems: 'Display recently viewed items',
  notifyAboutUpdates: 'Notify about updates',
  fastAccessToPages: 'Fast access to pages',
  displayRecentItemsInSidebar: 'Display recent items in sidebar',
  showThemeSelectorInHeader: 'Show theme selector in header',
  showLanguageSelectorInHeader: 'Show language selector in header',
  showDateAndTimeInStatusBar: 'Show date and time in status bar',
  showWeatherInformation: 'Show weather information',
  showCurrentLocation: 'Show current location',
  showNetworkLatency: 'Show network latency',
  showCpuAndMemoryUsage: 'Show CPU and memory usage',
  showSocialMediaLinks: 'Show social media links',
  showResumeDownloadButton: 'Show resume download button',
  useCompactSpacing: 'Use compact spacing',
  enableSmoothTransitions: 'Enable smooth transitions',
  controlAnimationDuration: 'Control animation duration',
  resetToDefaults: 'Reset to Defaults',
  settingsReset: 'Settings Reset',
  allSettingsRestoredToDefaults: 'All settings restored to defaults',
  settingChanged: 'Setting Changed',
  updated: 'updated',
  
  // Common UI
  search: 'Search',
  noResultsFound: 'No results found',
  filterBy: 'Filter By',
  sort: 'Sort',
  view: 'View',
  show: 'Show',
  hide: 'Hide',
  expand: 'Expand',
  collapse: 'Collapse',
  select: 'Select',
  clear: 'Clear',
  confirm: 'Confirm',
  delete: 'Delete',
  edit: 'Edit',
  back: 'Back',
  next: 'Next',
  previous: 'Previous',
  more: 'More',
  less: 'Less',
  
  // File Explorer
  fileExplore: 'File Explore',
  explorer: 'Explorer',
  files: 'Files',
  folders: 'Folders',
  openFile: 'Open File',
  closeFile: 'Close File',
  
  // Form Validation
  required: 'Required',
  invalidEmail: 'Please enter a valid email address',
  minLength: 'Minimum length',
  maxLength: 'Maximum length',
  characters: 'characters',
  minimumRequired: 'minimum required',
  
  // Status Messages
  resumeDownloadStarted: 'Resume download started',
  resumeDownloadComplete: 'Resume download completed successfully',
  languageChanged: 'Language Changed',
  themeChanged: 'Theme Changed',
  interfaceLanguageUpdated: 'Interface language updated to',
  themeUpdated: 'Theme updated to',
  
  // Timeline Page
  timeline: 'Timeline',
  timelineDescription: 'Visual timeline of career journey, projects, and achievements',
  timelinePageTitle: 'Timeline',
  horizontalView: 'Horizontal View',
  verticalView: 'Vertical View',
  searchTimeline: 'Search timeline...',
  allEvents: 'All Events',
  education: 'Education',
  noEventsFound: 'No events found matching your search.',
  noEventsToDisplay: 'No events to display.',
  ongoing: 'Ongoing',
  keyAchievements: 'Key Achievements',
  event: 'event',
  events: 'events',
  totalEvents: 'Total Events',
  
  // Welcome Tab Additional
  newProject: 'New Project...',
  openProject: 'Open Project...',
  cloneFromGit: 'Clone from Git...',
  contactMe: 'Contact Me...',
  generateAgentInstructions: 'Generate Agent Instructions...',
  openProjectsTab: 'Open Projects tab to view portfolio projects',
  repositoryOpened: 'Repository Opened',
  portfolioRepositoryOpened: 'Portfolio repository opened in new tab',
  openingAIChatbot: 'Opening AI Chatbot',
  getStartedWithPortfolio: 'Get started with Portfolio',
  exploreSkillsProjects: 'Explore my skills, projects, and experience. Learn about my journey as a software engineer.',
  learnTheFundamentals: 'Learn the Fundamentals',
  discoverCoreTechnologies: 'Discover my core technologies: Angular, React, TypeScript, and modern web development.',
  viewResume: 'View Resume',
  downloadResumeLearn: 'Download my resume and learn about my professional background and achievements.',
  connectOnLinkedIn: 'Connect on LinkedIn',
  viewProfessionalProfile: 'View my professional profile, recommendations, and connect with me on LinkedIn.',
  openingLinkedInProfile: 'Opening LinkedIn profile',
  welcomeToPortfolio: 'Welcome to',
  start: 'Start',
  contactMethods: 'CONTACT METHODS',
  aurexProject: 'Aurex Project',
  noRecentItems: 'No recent items yet. Start exploring!',
  more: 'More...',
  
  // Contact Form Additional
  whatsThisAbout: 'What\'s this about?',
  tellMeAboutProject: 'Tell me about your project or just say hello...',
  messageSentSuccessfully: 'Message sent successfully! Email client opened.',
  emailClientOpened: 'Email client opened',
  sendMessage: 'Send Message',
  sortByNameAZ: 'Sort by Name (A-Z)',
  sortByNameZA: 'Sort by Name (Z-A)',
  noItemsFound: 'No items found matching your search.',
  clearSearch: 'Clear search',
  clearSearchFilters: 'Clear search filters',
  searchContactMethods: 'Search contact methods and social platforms',
  sortContactItems: 'Sort contact items',
  allFieldsRequired: 'All fields are required',
  emailClientOpenedPleaseSend: 'Email client opened. Please send your message.',
  failedToOpenEmailClient: 'Failed to open email client',
  contactAndSocialMedia: 'Contact & Social Media',
  socialPlatforms: 'SOCIAL PLATFORMS',
  professionalInfo: 'PROFESSIONAL INFO',
  githubRepositories: 'GITHUB REPOSITORIES',
  availability: 'Availability',
  company: 'Company',
  codeRepositories: 'Code repositories',
  professionalNetwork: 'Professional network',
  secureMessaging: 'Secure messaging',
  availableForFreelance: 'Available for Freelance • Mon-Fri: 9AM-6PM IST',
  searchSettings: 'Search settings...',
  showStatistics: 'Show Statistics',
  themeSwitcher: 'Theme Switcher',
  languageSwitcher: 'Language Switcher',
  dateTime: 'Date & Time',
  weather: 'Weather',
  networkStatus: 'Network Status',
  systemInfo: 'System Info',
  useCompactSpacing: 'Use compact spacing',
  enableSmoothTransitions: 'Enable smooth transitions',
  controlAnimationDuration: 'Control animation duration',
  chooseColorTheme: 'Choose color theme',
  selectInterfaceLanguage: 'Select interface language',
  adjustTextSize: 'Adjust text size',
  chooseFontStyle: 'Choose font style',
  displayStatsOnWelcomePage: 'Display stats on welcome page',
  displayGitHubProfileData: 'Display GitHub profile data',
  displayRecentlyViewedItems: 'Display recently viewed items',
  fastAccessToPages: 'Fast access to pages',
  displayRecentItemsInSidebar: 'Display recent items in sidebar',
  showThemeSelectorInHeader: 'Show theme selector in header',
  showLanguageSelectorInHeader: 'Show language selector in header',
  showDateAndTimeInStatusBar: 'Show date and time in status bar',
  showWeatherInformation: 'Show weather information',
  showCurrentLocation: 'Show current location',
  showNetworkLatency: 'Show network latency',
  showCpuAndMemoryUsage: 'Show CPU and memory usage',
  showSocialMediaLinks: 'Show social media links',
  showResumeDownloadButton: 'Show resume download button',
  notifyAboutUpdates: 'Notify about updates',
  newest: 'Newest',
  oldest: 'Oldest',
  noProjectsFound: 'No projects found matching your search.',
  noProjectsAvailable: 'No projects available.',
  noExperienceFound: 'No experience found matching your search.',
  noExperienceAvailable: 'No experience available.',
}

// Get base language code (e.g., 'en-US' -> 'en')
const getBaseLanguage = (code: LanguageCode): string => {
  return code.split('-')[0]
}

// Translation mapping - using English as base for most variants
export const translations: Record<LanguageCode, Translations> = {
  // English
  'en-US': enUSTranslations,
  
  // Malayalam - merge with English for missing keys
  'ml': {
    ...enUSTranslations,
    searchPlaceholder: 'തിരയുക',
    changeLanguage: 'Cambiar idioma',
    theme: 'Tema',
    settings: 'Configuración',
    close: 'Cerrar',
    save: 'Guardar',
    cancel: 'Cancelar',
    reset: 'Restablecer',
    apply: 'Aplicar',
    welcome: 'Bienvenido',
    about: 'Acerca de',
    projects: 'Proyectos',
    skills: 'Habilidades',
    experience: 'Experiencia',
    contact: 'Contacto',
    achievements: 'Logros',
    certifications: 'Certificaciones',
    blogs: 'Blogs',
    recommendations: 'Recomendaciones',
    socialMedias: 'Redes Sociales',
    welcomeTitle: 'Bienvenido, soy Ajay K J',
    welcomeSubtitle: 'Desarrollador front-end con más de 3 años de experiencia demostrada en programación Angular, desarrollo web y diseño de UI responsive. Apasionado por crear experiencias de usuario intuitivas, eficientes y accesibles.',
    quickStart: 'Inicio Rápido',
    recent: 'Reciente',
    activity: 'Actividad',
    insights: 'Perspectivas',
    shortcuts: 'Atajos',
    overview: 'Resumen',
    contactInformation: 'Información de Contacto',
    features: 'Características',
    quickLinks: 'Enlaces Rápidos',
    resume: 'Currículum',
    downloadResume: 'Descargar Currículum',
    getInTouch: 'Ponerse en Contacto',
    viewProjects: 'Ver Proyectos',
    yearsExperience: 'Años de Experiencia',
    projectsCompleted: 'Proyectos Completados',
    skillsMastered: 'Habilidades Dominadas',
    certificationsCount: 'Certificaciones',
    appearance: 'Apariencia',
    notifications: 'Notificaciones',
    navigation: 'Navegación',
    header: 'Encabezado',
    statusBar: 'Barra de Estado',
    language: 'Idioma',
    selectLanguage: 'Seleccionar Idioma',
    fontSize: 'Tamaño de Fuente',
    fontFamily: 'Familia de Fuente',
    animationSpeed: 'Velocidad de Animación',
    showStats: 'Mostrar Estadísticas',
    showSocialLinks: 'Mostrar Enlaces Sociales',
    showRecentItems: 'Mostrar Elementos Recientes',
    showResumeDownload: 'Mostrar Descarga de Currículum',
    viewAll: 'Ver Todo',
    download: 'Descargar',
    copy: 'Copiar',
    copied: 'Copiado',
    open: 'Abrir',
    name: 'Nombre',
    email: 'Correo Electrónico',
    phone: 'Teléfono',
    location: 'Ubicación',
    available: 'Disponible',
    openToOpportunities: 'Abierto a Oportunidades',
    sendEmail: 'Enviar Correo',
    message: 'Mensaje',
    subject: 'Asunto',
    success: 'Éxito',
    error: 'Error',
    warning: 'Advertencia',
    info: 'Información',
    loading: 'Cargando',
    // Skills Page
    skillsPageTitle: 'Habilidades y Experiencia',
    skillsPageDescription: 'Resumen completo de habilidades técnicas y competencias',
    frontendLanguages: 'Lenguajes Frontend',
    programmingLanguages: 'Lenguajes de Programación',
    frameworksAndLibraries: 'Frameworks y Bibliotecas',
    versionControl: 'Control de Versiones',
    tools: 'Herramientas',
    areasOfExpertise: 'Áreas de Experiencia',
    searchSkills: 'Buscar habilidades...',
    filter: 'Filtrar',
    sortBy: 'Ordenar Por',
    viewMode: 'Modo de Vista',
    gridView: 'Vista de Cuadrícula',
    listView: 'Vista de Lista',
    networkView: 'Vista de Red',
    allCategories: 'Todas las Categorías',
    allCategories: 'Todas las Categorías',
    allLevels: 'Todos los Niveles',
    expert: 'Experto',
    advanced: 'Avanzado',
    intermediate: 'Intermedio',
    beginner: 'Principiante',
    sortByName: 'Ordenar por Nombre',
    sortByLevel: 'Ordenar por Nivel',
    sortByYears: 'Ordenar por Años',
    sortByCategory: 'Ordenar por Categoría',
    ascending: 'Ascendente',
    descending: 'Descendente',
    showFilters: 'Mostrar Filtros',
    hideFilters: 'Ocultar Filtros',
    resetFilters: 'Restablecer Filtros',
    verified: 'Verificado',
    years: 'Años',
    level: 'Nivel',
    category: 'Categoría',
    projects: 'Proyectos',
    experience: 'Experiencia',
    certifications: 'Certificaciones',
    // Projects Page
    projectsPageTitle: 'Proyectos Destacados',
    projectsPageDescription: 'Muestra de mis proyectos de portafolio y casos de estudio',
    featuredProjects: 'Proyectos Destacados',
    showCodePreview: 'Mostrar Vista Previa del Código',
    showLiveDemo: 'Mostrar Demo en Vivo',
    viewCode: 'Ver Código',
    viewDemo: 'Ver Demo',
    technologies: 'Tecnologías',
    period: 'Período',
    sortByPeriod: 'Ordenar por Período',
    sortByTitle: 'Ordenar por Título',
    // Experience Page
    experiencePageTitle: 'Experiencia Laboral',
    experiencePageDescription: 'Experiencia profesional y línea de tiempo de carrera',
    workExperience: 'Experiencia Laboral',
    company: 'Empresa',
    achievements: 'Logros',
    sortByCompany: 'Ordenar por Empresa',
    // Social Media Page
    socialMediaPageTitle: 'Redes Sociales',
    socialMediaPageDescription: 'Conéctate conmigo a través de varias plataformas de redes sociales',
    connectWithMe: 'Conéctate Conmigo',
    socialPlatforms: 'Plataformas Sociales',
    githubProfile: 'Perfil de GitHub',
    recentRepositories: 'Repositorios Recientes',
    contactForm: 'Formulario de Contacto',
    yourName: 'Tu Nombre',
    yourEmail: 'Tu Correo Electrónico',
    emailSubject: 'Asunto del Correo',
    writeMessage: 'Escribe tu mensaje aquí... (mínimo 10 caracteres)',
    openingEmail: 'Abriendo Correo...',
    emailOpened: '¡Correo Abierto!',
    all: 'Todos',
    development: 'Desarrollo',
    professional: 'Profesional',
    communication: 'Comunicación',
    social: 'Social',
    followers: 'Seguidores',
    following: 'Siguiendo',
    repositories: 'Repositorios',
    searchPlatforms: 'Buscar plataformas...',
    // Recommendations Page
    recommendationsPageTitle: 'Recomendaciones',
    recommendationsPageDescription: 'Testimonios y recomendaciones de colegas, gerentes y colaboradores',
    testimonials: 'Testimonios',
    sortByDate: 'Ordenar por Fecha',
    sortByName: 'Ordenar por Nombre',
    position: 'Posición',
    // Settings Page
    display: 'Pantalla',
    content: 'Contenido',
    compactView: 'Vista Compacta',
    showAnimations: 'Mostrar Animaciones',
    chooseColorTheme: 'Elegir tema de color',
    adjustTextSize: 'Ajustar tamaño de texto',
    chooseFontStyle: 'Elegir estilo de fuente',
    displayStatsOnWelcomePage: 'Mostrar estadísticas en la página de bienvenida',
    displaySocialMediaLinks: 'Mostrar enlaces de redes sociales',
    displayGitHubProfileData: 'Mostrar datos del perfil de GitHub',
    displayRecentlyViewedItems: 'Mostrar elementos vistos recientemente',
    notifyAboutUpdates: 'Notificar sobre actualizaciones',
    fastAccessToPages: 'Acceso rápido a páginas',
    displayRecentItemsInSidebar: 'Mostrar elementos recientes en la barra lateral',
    showThemeSelectorInHeader: 'Mostrar selector de tema en el encabezado',
    showLanguageSelectorInHeader: 'Mostrar selector de idioma en el encabezado',
    showDateAndTimeInStatusBar: 'Mostrar fecha y hora en la barra de estado',
    showWeatherInformation: 'Mostrar información del clima',
    showCurrentLocation: 'Mostrar ubicación actual',
    showNetworkLatency: 'Mostrar latencia de red',
    showCpuAndMemoryUsage: 'Mostrar uso de CPU y memoria',
    showSocialMediaLinks: 'Mostrar enlaces de redes sociales',
    showResumeDownloadButton: 'Mostrar botón de descarga de currículum',
    useCompactSpacing: 'Usar espaciado compacto',
    enableSmoothTransitions: 'Habilitar transiciones suaves',
    controlAnimationDuration: 'Controlar duración de animación',
    resetToDefaults: 'Restablecer a Predeterminados',
    settingsReset: 'Configuración Restablecida',
    allSettingsRestoredToDefaults: 'Todas las configuraciones restauradas a los valores predeterminados',
    settingChanged: 'Configuración Cambiada',
    updated: 'actualizado',
    // Common UI
    search: 'Buscar',
    noResultsFound: 'No se encontraron resultados',
    filterBy: 'Filtrar Por',
    sort: 'Ordenar',
    view: 'Vista',
    show: 'Mostrar',
    hide: 'Ocultar',
    expand: 'Expandir',
    collapse: 'Contraer',
    select: 'Seleccionar',
    clear: 'Limpiar',
    confirm: 'Confirmar',
    delete: 'Eliminar',
    edit: 'Editar',
    back: 'Atrás',
    next: 'Siguiente',
    previous: 'Anterior',
    more: 'Más',
    less: 'Menos',
    // File Explorer
    fileExplore: 'Explorar Archivos',
    explorer: 'Explorador',
    files: 'Archivos',
    folders: 'Carpetas',
    openFile: 'Abrir Archivo',
    closeFile: 'Cerrar Archivo',
    // Form Validation
    required: 'Requerido',
    invalidEmail: 'Por favor ingrese una dirección de correo electrónico válida',
    minLength: 'Longitud mínima',
    maxLength: 'Longitud máxima',
    characters: 'caracteres',
    minimumRequired: 'mínimo requerido',
    // Status Messages
    resumeDownloadStarted: 'Descarga de currículum iniciada',
    resumeDownloadComplete: 'Descarga de currículum completada exitosamente',
    languageChanged: 'Idioma Cambiado',
    themeChanged: 'Tema Cambiado',
    interfaceLanguageUpdated: 'Idioma de interfaz actualizado a',
    themeUpdated: 'Tema actualizado a',
    
    // Timeline Page
    timeline: 'Línea de Tiempo',
    timelineDescription: 'Línea de tiempo visual del viaje profesional, proyectos y logros',
    timelinePageTitle: 'Línea de Tiempo',
    horizontalView: 'Vista Horizontal',
    verticalView: 'Vista Vertical',
    searchTimeline: 'Buscar en línea de tiempo...',
    allEvents: 'Todos los Eventos',
    education: 'Educación',
    noEventsFound: 'No se encontraron eventos que coincidan con su búsqueda.',
    noEventsToDisplay: 'No hay eventos para mostrar.',
    ongoing: 'En Curso',
    keyAchievements: 'Logros Clave',
    event: 'evento',
    events: 'eventos',
    totalEvents: 'Total de Eventos',
    
    // Welcome Tab Additional
    newProject: 'Nuevo Proyecto...',
    openProject: 'Abrir Proyecto...',
    cloneFromGit: 'Clonar desde Git...',
    contactMe: 'Contáctame...',
    generateAgentInstructions: 'Generar Instrucciones del Agente...',
    openProjectsTab: 'Abrir la pestaña de Proyectos para ver los proyectos del portafolio',
    repositoryOpened: 'Repositorio Abierto',
    portfolioRepositoryOpened: 'Repositorio del portafolio abierto en nueva pestaña',
    openingAIChatbot: 'Abriendo Chatbot de IA',
    getStartedWithPortfolio: 'Comenzar con el Portafolio',
    exploreSkillsProjects: 'Explora mis habilidades, proyectos y experiencia. Conoce mi viaje como ingeniero de software.',
    learnTheFundamentals: 'Aprende los Fundamentos',
    discoverCoreTechnologies: 'Descubre mis tecnologías principales: Angular, React, TypeScript y desarrollo web moderno.',
    viewResume: 'Ver Currículum',
    downloadResumeLearn: 'Descarga mi currículum y conoce mi experiencia profesional y logros.',
    connectOnLinkedIn: 'Conectar en LinkedIn',
    viewProfessionalProfile: 'Ver mi perfil profesional, recomendaciones y conectar conmigo en LinkedIn.',
    openingLinkedInProfile: 'Abriendo perfil de LinkedIn',
    welcomeToPortfolio: 'Bienvenido a',
    start: 'Iniciar',
    contactMethods: 'MÉTODOS DE CONTACTO',
    aurexProject: 'Proyecto Aurex',
    noRecentItems: 'Aún no hay elementos recientes. ¡Comienza a explorar!',
    more: 'Más...',
    
    // Contact Form Additional
    whatsThisAbout: '¿De qué se trata?',
    tellMeAboutProject: 'Cuéntame sobre tu proyecto o simplemente di hola...',
    messageSentSuccessfully: '¡Mensaje enviado con éxito! Cliente de correo abierto.',
    emailClientOpened: 'Cliente de correo abierto',
    sendMessage: 'Enviar Mensaje',
    sortByNameAZ: 'Ordenar por Nombre (A-Z)',
    sortByNameZA: 'Ordenar por Nombre (Z-A)',
    noItemsFound: 'No se encontraron elementos que coincidan con su búsqueda.',
    clearSearch: 'Limpiar búsqueda',
    clearSearchFilters: 'Limpiar filtros de búsqueda',
    searchContactMethods: 'Buscar métodos de contacto y plataformas sociales',
    sortContactItems: 'Ordenar elementos de contacto',
    allFieldsRequired: 'Todos los campos son obligatorios',
    emailClientOpenedPleaseSend: 'Cliente de correo abierto. Por favor, envía tu mensaje.',
    failedToOpenEmailClient: 'Error al abrir el cliente de correo',
    contactAndSocialMedia: 'Contacto y Redes Sociales',
    socialPlatforms: 'PLATAFORMAS SOCIALES',
    professionalInfo: 'INFORMACIÓN PROFESIONAL',
    githubRepositories: 'REPOSITORIOS DE GITHUB',
    availability: 'Disponibilidad',
    company: 'Empresa',
    codeRepositories: 'Repositorios de código',
    professionalNetwork: 'Red profesional',
    secureMessaging: 'Mensajería segura',
    availableForFreelance: 'Disponible para Freelance • Lun-Vie: 9AM-6PM IST',
    searchSettings: 'Buscar configuración...',
    showStatistics: 'Mostrar Estadísticas',
    themeSwitcher: 'Selector de Tema',
    languageSwitcher: 'Selector de Idioma',
    dateTime: 'Fecha y Hora',
    weather: 'Clima',
    networkStatus: 'Estado de Red',
    systemInfo: 'Información del Sistema',
    useCompactSpacing: 'Usar espaciado compacto',
    enableSmoothTransitions: 'Habilitar transiciones suaves',
    controlAnimationDuration: 'Controlar duración de animación',
    chooseColorTheme: 'Elegir tema de color',
    selectInterfaceLanguage: 'Seleccionar idioma de interfaz',
    adjustTextSize: 'Ajustar tamaño de texto',
    chooseFontStyle: 'Elegir estilo de fuente',
    displayStatsOnWelcomePage: 'Mostrar estadísticas en la página de bienvenida',
    displayGitHubProfileData: 'Mostrar datos del perfil de GitHub',
    displayRecentlyViewedItems: 'Mostrar elementos vistos recientemente',
    fastAccessToPages: 'Acceso rápido a páginas',
    displayRecentItemsInSidebar: 'Mostrar elementos recientes en la barra lateral',
    showThemeSelectorInHeader: 'Mostrar selector de tema en el encabezado',
    showLanguageSelectorInHeader: 'Mostrar selector de idioma en el encabezado',
    showDateAndTimeInStatusBar: 'Mostrar fecha y hora en la barra de estado',
    showWeatherInformation: 'Mostrar información del clima',
    showCurrentLocation: 'Mostrar ubicación actual',
    showNetworkLatency: 'Mostrar latencia de red',
    showCpuAndMemoryUsage: 'Mostrar uso de CPU y memoria',
    showSocialMediaLinks: 'Mostrar enlaces de redes sociales',
    showResumeDownloadButton: 'Mostrar botón de descarga de currículum',
    notifyAboutUpdates: 'Notificar sobre actualizaciones',
    newest: 'Más Reciente',
    oldest: 'Más Antiguo',
    noProjectsFound: 'No se encontraron proyectos que coincidan con su búsqueda.',
    noProjectsAvailable: 'No hay proyectos disponibles.',
    noExperienceFound: 'No se encontró experiencia que coincida con su búsqueda.',
    noExperienceAvailable: 'No hay experiencia disponible.',
  },
  
  // Malayalam - merge with English for missing keys
  'ml': {
    ...enUSTranslations,
    searchPlaceholder: 'തിരയുക',
    changeLanguage: 'ഭാഷ മാറ്റുക',
    theme: 'തീം',
    settings: 'ക്രമീകരണങ്ങൾ',
    close: 'അടയ്ക്കുക',
    save: 'സംരക്ഷിക്കുക',
    cancel: 'റദ്ദാക്കുക',
    reset: 'പുനഃക്രമീകരിക്കുക',
    apply: 'പ്രയോഗിക്കുക',
    welcome: 'സ്വാഗതം',
    about: 'കുറിച്ച്',
    projects: 'പ്രോജക്റ്റുകൾ',
    skills: 'വൈദഗ്ദ്ധ്യങ്ങൾ',
    experience: 'അനുഭവം',
    contact: 'ബന്ധപ്പെടുക',
    achievements: 'സാധനകൾ',
    certifications: 'സർട്ടിഫിക്കേഷനുകൾ',
    blogs: 'ബ്ലോഗുകൾ',
    recommendations: 'ശുപാർശകൾ',
    socialMedias: 'സോഷ്യൽ മീഡിയ',
    welcomeTitle: 'സ്വാഗതം, ഞാൻ അജയ് കെ ജെ ആണ്',
    welcomeSubtitle: '3+ വർഷത്തേക്കാളുള്ള അനുഭവമുള്ള ഫ്രണ്ട്-എൻഡ് ഡെവലപ്പർ. ആംഗുലാർ പ്രോഗ്രാമിംഗ്, വെബ് ഡെവലപ്മെന്റ്, റെസ്പോൺസീവ് UI ഡിസൈൻ എന്നിവയിൽ പ്രാവീണ്യം. അവബോധപൂർവ്വമായ, പ്രകടനപരമായ, ആക്സസ് ചെയ്യാവുന്ന ഉപയോക്തൃ അനുഭവങ്ങൾ സൃഷ്ടിക്കുന്നതിൽ താൽപ്പര്യമുള്ളവൻ.',
    quickStart: 'ദ്രുത ആരംഭം',
    recent: 'സമീപകാല',
    activity: 'പ്രവർത്തനം',
    insights: 'ഉൾക്കാഴ്ചകൾ',
    shortcuts: 'ഷോർട്ട്കട്ടുകൾ',
    overview: 'അവലോകനം',
    contactInformation: 'ബന്ധപ്പെടൽ വിവരങ്ങൾ',
    features: 'സവിശേഷതകൾ',
    quickLinks: 'ദ്രുത ലിങ്കുകൾ',
    resume: 'റെസ്യൂമ്',
    downloadResume: 'റെസ്യൂമ് ഡൗൺലോഡ് ചെയ്യുക',
    getInTouch: 'ബന്ധപ്പെടുക',
    viewProjects: 'പ്രോജക്റ്റുകൾ കാണുക',
    yearsExperience: 'വർഷങ്ങളുടെ അനുഭവം',
    projectsCompleted: 'പൂർത്തിയാക്കിയ പ്രോജക്റ്റുകൾ',
    skillsMastered: 'കൈവരിച്ച കഴിവുകൾ',
    certificationsCount: 'സർട്ടിഫിക്കേഷനുകൾ',
    appearance: 'രൂപം',
    notifications: 'അറിയിപ്പുകൾ',
    navigation: 'നാവിഗേഷൻ',
    header: 'ഹെഡർ',
    statusBar: 'സ്റ്റാറ്റസ് ബാർ',
    language: 'ഭാഷ',
    selectLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    fontSize: 'ഫോണ്ട് വലിപ്പം',
    fontFamily: 'ഫോണ്ട് കുടുംബം',
    animationSpeed: 'ആനിമേഷൻ വേഗത',
    showStats: 'സ്ഥിതിവിവരക്കണക്കുകൾ കാണിക്കുക',
    showSocialLinks: 'സോഷ്യൽ ലിങ്കുകൾ കാണിക്കുക',
    showRecentItems: 'സമീപകാല ഇനങ്ങൾ കാണിക്കുക',
    showResumeDownload: 'റെസ്യൂമ് ഡൗൺലോഡ് കാണിക്കുക',
    viewAll: 'എല്ലാം കാണുക',
    download: 'ഡൗൺലോഡ്',
    copy: 'കോപ്പി',
    copied: 'കോപ്പി ചെയ്തു',
    open: 'തുറക്കുക',
    name: 'പേര്',
    email: 'ഇമെയിൽ',
    phone: 'ഫോൺ',
    location: 'സ്ഥാനം',
    available: 'ലഭ്യമാണ്',
    openToOpportunities: 'അവസരങ്ങൾക്കായി തുറന്നിരിക്കുന്നു',
    sendEmail: 'ഇമെയിൽ അയയ്ക്കുക',
    message: 'സന്ദേശം',
    subject: 'വിഷയം',
    success: 'വിജയം',
    error: 'പിശക്',
    warning: 'എച്ചർച്ച്',
    info: 'വിവരം',
    loading: 'ലോഡ് ചെയ്യുന്നു',
    
    // Skills Page
    skillsPageTitle: 'വൈദഗ്ദ്ധ്യങ്ങളും പ്രാവീണ്യവും',
    skillsPageDescription: 'സാങ്കേതിക കഴിവുകളുടെയും പ്രാവീണ്യങ്ങളുടെയും സമഗ്ര അവലോകനം',
    frontendLanguages: 'ഫ്രണ്ട്-എൻഡ് ഭാഷകൾ',
    programmingLanguages: 'പ്രോഗ്രാമിംഗ് ഭാഷകൾ',
    frameworksAndLibraries: 'ഫ്രെയിംവർക്കുകളും ലൈബ്രറികളും',
    versionControl: 'വേർഷൻ കൺട്രോൾ',
    tools: 'ഉപകരണങ്ങൾ',
    areasOfExpertise: 'പ്രാവീണ്യ മേഖലകൾ',
    searchSkills: 'കഴിവുകൾ തിരയുക...',
    filter: 'ഫിൽട്ടർ',
    sortBy: 'ക്രമീകരിക്കുക',
    viewMode: 'കാഴ്ച മോഡ്',
    gridView: 'ഗ്രിഡ് കാഴ്ച',
    listView: 'ലിസ്റ്റ് കാഴ്ച',
    networkView: 'നെറ്റ്വർക്ക് കാഴ്ച',
    allCategories: 'എല്ലാ വിഭാഗങ്ങളും',
    allLevels: 'എല്ലാ തലങ്ങളും',
    expert: 'വിദഗ്ദ്ധൻ',
    advanced: 'മുകളിലത്തെ',
    intermediate: 'ഇടത്തരം',
    beginner: 'ആരംഭകൻ',
    sortByName: 'പേരനുസരിച്ച് ക്രമീകരിക്കുക',
    sortByLevel: 'തലം അനുസരിച്ച് ക്രമീകരിക്കുക',
    sortByYears: 'വർഷങ്ങൾ അനുസരിച്ച് ക്രമീകരിക്കുക',
    sortByCategory: 'വിഭാഗം അനുസരിച്ച് ക്രമീകരിക്കുക',
    ascending: 'ആരോഹണം',
    descending: 'അവരോഹണം',
    showFilters: 'ഫിൽട്ടറുകൾ കാണിക്കുക',
    hideFilters: 'ഫിൽട്ടറുകൾ മറയ്ക്കുക',
    resetFilters: 'ഫിൽട്ടറുകൾ പുനഃക്രമീകരിക്കുക',
    verified: 'സ്ഥിരീകരിച്ചു',
    years: 'വർഷങ്ങൾ',
    level: 'തലം',
    category: 'വിഭാഗം',
    technologies: 'സാങ്കേതികതകൾ',
    
    // Timeline Page
    timeline: 'ടൈംലൈൻ',
    timelineDescription: 'കരിയർ യാത്ര, പ്രോജക്റ്റുകൾ, സാധനകൾ എന്നിവയുടെ വിഷ്വൽ ടൈംലൈൻ',
    timelinePageTitle: 'ടൈംലൈൻ',
    horizontalView: 'തിരശ്ചീന കാഴ്ച',
    verticalView: 'ലംബ കാഴ്ച',
    searchTimeline: 'ടൈംലൈൻ തിരയുക...',
    allEvents: 'എല്ലാ ഇവന്റുകളും',
    education: 'വിദ്യാഭ്യാസം',
    noEventsFound: 'നിങ്ങളുടെ തിരയലുമായി പൊരുത്തപ്പെടുന്ന ഇവന്റുകൾ കണ്ടെത്തിയില്ല.',
    noEventsToDisplay: 'പ്രദർശിപ്പിക്കാൻ ഇവന്റുകൾ ഇല്ല.',
    ongoing: 'നടന്നുകൊണ്ടിരിക്കുന്നു',
    keyAchievements: 'പ്രധാന സാധനകൾ',
    event: 'ഇവന്റ്',
    events: 'ഇവന്റുകൾ',
    totalEvents: 'മൊത്തം ഇവന്റുകൾ',
    
    // Welcome Tab Additional
    newProject: 'പുതിയ പ്രോജക്റ്റ്...',
    openProject: 'പ്രോജക്റ്റ് തുറക്കുക...',
    cloneFromGit: 'Git-ൽ നിന്ന് ക്ലോൺ ചെയ്യുക...',
    contactMe: 'എന്നെ ബന്ധപ്പെടുക...',
    generateAgentInstructions: 'ഏജന്റ് നിർദ്ദേശങ്ങൾ സൃഷ്ടിക്കുക...',
    openProjectsTab: 'പോർട്ട്ഫോളിയോ പ്രോജക്റ്റുകൾ കാണാൻ പ്രോജക്റ്റുകൾ ടാബ് തുറക്കുക',
    repositoryOpened: 'റെപ്പോസിറ്ററി തുറന്നു',
    portfolioRepositoryOpened: 'പോർട്ട്ഫോളിയോ റെപ്പോസിറ്ററി പുതിയ ടാബിൽ തുറന്നു',
    openingAIChatbot: 'AI ചാറ്റ്ബോട്ട് തുറക്കുന്നു',
    getStartedWithPortfolio: 'പോർട്ട്ഫോളിയോയിൽ ആരംഭിക്കുക',
    exploreSkillsProjects: 'എന്റെ കഴിവുകൾ, പ്രോജക്റ്റുകൾ, അനുഭവം എന്നിവ പര്യവേക്ഷണം ചെയ്യുക. സോഫ്റ്റ്വെയർ എഞ്ചിനീയറായി എന്റെ യാത്രയെക്കുറിച്ച് അറിയുക.',
    learnTheFundamentals: 'അടിസ്ഥാനങ്ങൾ പഠിക്കുക',
    discoverCoreTechnologies: 'എന്റെ പ്രധാന സാങ്കേതികതകൾ കണ്ടെത്തുക: Angular, React, TypeScript, ആധുനിക വെബ് ഡെവലപ്മെന്റ്.',
    viewResume: 'റെസ്യൂമ് കാണുക',
    downloadResumeLearn: 'എന്റെ റെസ്യൂമ് ഡൗൺലോഡ് ചെയ്ത് എന്റെ പ്രൊഫഷണൽ പശ്ചാത്തലവും സാധനകളും അറിയുക.',
    connectOnLinkedIn: 'LinkedIn-ൽ ബന്ധപ്പെടുക',
    viewProfessionalProfile: 'എന്റെ പ്രൊഫഷണൽ പ്രൊഫൈൽ, ശുപാർശകൾ കാണുക, LinkedIn-ൽ എന്നോട് ബന്ധപ്പെടുക.',
    openingLinkedInProfile: 'LinkedIn പ്രൊഫൈൽ തുറക്കുന്നു',
    welcomeToPortfolio: 'സ്വാഗതം',
    start: 'ആരംഭിക്കുക',
    contactMethods: 'ബന്ധപ്പെടൽ രീതികൾ',
    aurexProject: 'ഓറെക്സ് പ്രോജക്റ്റ്',
    noRecentItems: 'ഇതുവരെ സമീപകാല ഇനങ്ങൾ ഇല്ല. പര്യവേക്ഷണം ആരംഭിക്കുക!',
    more: 'കൂടുതൽ...',
    
    // Contact Form Additional
    whatsThisAbout: 'ഇത് എന്തിനെക്കുറിച്ചാണ്?',
    tellMeAboutProject: 'നിങ്ങളുടെ പ്രോജക്റ്റിനെക്കുറിച്ച് പറയുക അല്ലെങ്കിൽ ഹലോ പറയുക...',
    messageSentSuccessfully: 'സന്ദേശം വിജയകരമായി അയച്ചു! ഇമെയിൽ ക്ലയന്റ് തുറന്നു.',
    emailClientOpened: 'ഇമെയിൽ ക്ലയന്റ് തുറന്നു',
    sendMessage: 'സന്ദേശം അയയ്ക്കുക',
    sortByNameAZ: 'പേരനുസരിച്ച് ക്രമീകരിക്കുക (A-Z)',
    sortByNameZA: 'പേരനുസരിച്ച് ക്രമീകരിക്കുക (Z-A)',
    noItemsFound: 'നിങ്ങളുടെ തിരയലുമായി പൊരുത്തപ്പെടുന്ന ഇനങ്ങൾ കണ്ടെത്തിയില്ല.',
    clearSearch: 'തിരയൽ മായ്ക്കുക',
    clearSearchFilters: 'തിരയൽ ഫിൽട്ടറുകൾ മായ്ക്കുക',
    searchContactMethods: 'ബന്ധപ്പെടൽ രീതികളും സോഷ്യൽ പ്ലാറ്റ്ഫോമുകളും തിരയുക',
    sortContactItems: 'ബന്ധപ്പെടൽ ഇനങ്ങൾ ക്രമീകരിക്കുക',
    allFieldsRequired: 'എല്ലാ ഫീൽഡുകളും ആവശ്യമാണ്',
    emailClientOpenedPleaseSend: 'ഇമെയിൽ ക്ലയന്റ് തുറന്നു. ദയവായി നിങ്ങളുടെ സന്ദേശം അയയ്ക്കുക.',
    failedToOpenEmailClient: 'ഇമെയിൽ ക്ലയന്റ് തുറക്കാൻ പരാജയപ്പെട്ടു',
    contactAndSocialMedia: 'ബന്ധപ്പെടൽ & സോഷ്യൽ മീഡിയ',
    socialPlatforms: 'സോഷ്യൽ പ്ലാറ്റ്ഫോമുകൾ',
    professionalInfo: 'പ്രൊഫഷണൽ വിവരങ്ങൾ',
    githubRepositories: 'ഗിറ്റ്ഹബ് റെപ്പോസിറ്ററികൾ',
    availability: 'ലഭ്യത',
    company: 'കമ്പനി',
    codeRepositories: 'കോഡ് റെപ്പോസിറ്ററികൾ',
    professionalNetwork: 'പ്രൊഫഷണൽ നെറ്റ്വർക്ക്',
    secureMessaging: 'സുരക്ഷിത മെസേജിംഗ്',
    availableForFreelance: 'ഫ്രീലാൻസിനായി ലഭ്യം • തിങ്കൾ-വെള്ളി: 9AM-6PM IST',
    searchSettings: 'ക്രമീകരണങ്ങൾ തിരയുക...',
    showStatistics: 'സ്ഥിതിവിവരക്കണക്കുകൾ കാണിക്കുക',
    themeSwitcher: 'തീം സ്വിച്ചർ',
    languageSwitcher: 'ഭാഷാ സ്വിച്ചർ',
    dateTime: 'തീയതി & സമയം',
    weather: 'കാലാവസ്ഥ',
    networkStatus: 'നെറ്റ്വർക്ക് സ്റ്റാറ്റസ്',
    systemInfo: 'സിസ്റ്റം വിവരങ്ങൾ',
    useCompactSpacing: 'കോംപാക്റ്റ് സ്പേസിംഗ് ഉപയോഗിക്കുക',
    enableSmoothTransitions: 'മിനുസമുള്ള പരിവർത്തനങ്ങൾ പ്രവർത്തനക്ഷമമാക്കുക',
    controlAnimationDuration: 'ആനിമേഷൻ ദൈർഘ്യം നിയന്ത്രിക്കുക',
    chooseColorTheme: 'നിറ തീം തിരഞ്ഞെടുക്കുക',
    selectInterfaceLanguage: 'ഇന്റർഫേസ് ഭാഷ തിരഞ്ഞെടുക്കുക',
    adjustTextSize: 'ടെക്സ്റ്റ് വലുപ്പം ക്രമീകരിക്കുക',
    chooseFontStyle: 'ഫോണ്ട് ശൈലി തിരഞ്ഞെടുക്കുക',
    displayStatsOnWelcomePage: 'സ്വാഗത പേജിൽ സ്ഥിതിവിവരക്കണക്കുകൾ പ്രദർശിപ്പിക്കുക',
    displayGitHubProfileData: 'GitHub പ്രൊഫൈൽ ഡാറ്റ പ്രദർശിപ്പിക്കുക',
    displayRecentlyViewedItems: 'ഇന്നിവയ്ക്ക് കാണാനുള്ള ഇനങ്ങൾ പ്രദർശിപ്പിക്കുക',
    fastAccessToPages: 'പേജുകളിലേക്ക് വേഗത്തിലുള്ള പ്രവേശനം',
    displayRecentItemsInSidebar: 'സൈഡ്ബാറിൽ സമീപകാല ഇനങ്ങൾ പ്രദർശിപ്പിക്കുക',
    showThemeSelectorInHeader: 'ഹെഡറിൽ തീം സെലക്ടർ കാണിക്കുക',
    showLanguageSelectorInHeader: 'ഹെഡറിൽ ഭാഷാ സെലക്ടർ കാണിക്കുക',
    showDateAndTimeInStatusBar: 'സ്റ്റാറ്റസ് ബാറിൽ തീയതിയും സമയവും കാണിക്കുക',
    showWeatherInformation: 'കാലാവസ്ഥ വിവരങ്ങൾ കാണിക്കുക',
    showCurrentLocation: 'നിലവിലെ സ്ഥാനം കാണിക്കുക',
    showNetworkLatency: 'നെറ്റ്വർക്ക് ലാറ്റൻസി കാണിക്കുക',
    showCpuAndMemoryUsage: 'CPU, മെമ്മറി ഉപയോഗം കാണിക്കുക',
    showSocialMediaLinks: 'സോഷ്യൽ മീഡിയ ലിങ്കുകൾ കാണിക്കുക',
    showResumeDownloadButton: 'റെസ്യൂമെ ഡൗൺലോഡ് ബട്ടൺ കാണിക്കുക',
    notifyAboutUpdates: 'അപ്ഡേറ്റുകളെക്കുറിച്ച് അറിയിക്കുക',
    newest: 'ഏറ്റവും പുതിയത്',
    oldest: 'ഏറ്റവും പഴയത്',
    noProjectsFound: 'നിങ്ങളുടെ തിരയലുമായി പൊരുത്തപ്പെടുന്ന പ്രോജക്റ്റുകൾ കണ്ടെത്തിയില്ല.',
    noProjectsAvailable: 'ലഭ്യമായ പ്രോജക്റ്റുകൾ ഇല്ല.',
    noExperienceFound: 'നിങ്ങളുടെ തിരയലുമായി പൊരുത്തപ്പെടുന്ന അനുഭവം കണ്ടെത്തിയില്ല.',
    noExperienceAvailable: 'ലഭ്യമായ അനുഭവം ഇല്ല.',
  },
  
  // Hindi - merge with English for missing keys
  'hi': {
    ...enUSTranslations,
    searchPlaceholder: 'खोजें',
    changeLanguage: 'भाषा बदलें',
    theme: 'थीम',
    settings: 'सेटिंग्स',
    close: 'बंद करें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    reset: 'रीसेट करें',
    apply: 'लागू करें',
    welcome: 'स्वागत है',
    about: 'के बारे में',
    projects: 'प्रोजेक्ट्स',
    skills: 'कौशल',
    experience: 'अनुभव',
    contact: 'संपर्क करें',
    achievements: 'उपलब्धियां',
    certifications: 'प्रमाणपत्र',
    blogs: 'ब्लॉग्स',
    recommendations: 'सिफारिशें',
    socialMedias: 'सोशल मीडिया',
    welcomeTitle: 'स्वागत है, मैं अजय के जे हूं',
    welcomeSubtitle: '3+ वर्षों के अनुभव के साथ फ्रंट-एंड डेवलपर। Angular प्रोग्रामिंग, वेब डेवलपमेंट, और रेस्पॉन्सिव UI डिज़ाइन में विशेषज्ञता। सहज, प्रदर्शनकारी, और सुलभ उपयोगकर्ता अनुभव बनाने के लिए उत्साही।',
    quickStart: 'त्वरित शुरुआत',
    recent: 'हाल ही में',
    activity: 'गतिविधि',
    insights: 'अंतर्दृष्टि',
    shortcuts: 'शॉर्टकट',
    overview: 'अवलोकन',
    contactInformation: 'संपर्क जानकारी',
    features: 'विशेषताएं',
    quickLinks: 'त्वरित लिंक',
    resume: 'रिज्यूमे',
    downloadResume: 'रिज्यूमे डाउनलोड करें',
    getInTouch: 'संपर्क करें',
    viewProjects: 'प्रोजेक्ट देखें',
    yearsExperience: 'वर्षों का अनुभव',
    projectsCompleted: 'पूर्ण प्रोजेक्ट',
    skillsMastered: 'महारत हासिल कौशल',
    certificationsCount: 'प्रमाणपत्र',
    appearance: 'दिखावट',
    notifications: 'सूचनाएं',
    navigation: 'नेविगेशन',
    header: 'हेडर',
    statusBar: 'स्थिति बार',
    language: 'भाषा',
    selectLanguage: 'भाषा चुनें',
    fontSize: 'फ़ॉन्ट आकार',
    fontFamily: 'फ़ॉन्ट परिवार',
    animationSpeed: 'एनिमेशन गति',
    showStats: 'आंकड़े दिखाएं',
    showSocialLinks: 'सोशल लिंक दिखाएं',
    showRecentItems: 'हाल के आइटम दिखाएं',
    showResumeDownload: 'रिज्यूमे डाउनलोड दिखाएं',
    viewAll: 'सभी देखें',
    download: 'डाउनलोड',
    copy: 'कॉपी',
    copied: 'कॉपी किया गया',
    open: 'खोलें',
    name: 'नाम',
    email: 'ईमेल',
    phone: 'फोन',
    location: 'स्थान',
    available: 'उपलब्ध',
    openToOpportunities: 'अवसरों के लिए खुला',
    sendEmail: 'ईमेल भेजें',
    message: 'संदेश',
    subject: 'विषय',
    success: 'सफल',
    error: 'त्रुटि',
    warning: 'चेतावनी',
    info: 'जानकारी',
    loading: 'लोड हो रहा है',
    
    // Skills Page
    skillsPageTitle: 'कौशल और विशेषज्ञता',
    skillsPageDescription: 'तकनीकी कौशल और दक्षताओं का व्यापक अवलोकन',
    frontendLanguages: 'फ्रंटएंड भाषाएं',
    programmingLanguages: 'प्रोग्रामिंग भाषाएं',
    frameworksAndLibraries: 'फ्रेमवर्क और लाइब्रेरी',
    versionControl: 'संस्करण नियंत्रण',
    tools: 'उपकरण',
    areasOfExpertise: 'विशेषज्ञता के क्षेत्र',
    searchSkills: 'कौशल खोजें...',
    filter: 'फ़िल्टर',
    sortBy: 'क्रमबद्ध करें',
    viewMode: 'दृश्य मोड',
    gridView: 'ग्रिड दृश्य',
    listView: 'सूची दृश्य',
    networkView: 'नेटवर्क दृश्य',
    allCategories: 'सभी श्रेणियां',
    allLevels: 'सभी स्तर',
    expert: 'विशेषज्ञ',
    advanced: 'उन्नत',
    intermediate: 'मध्यम',
    beginner: 'शुरुआती',
    sortByName: 'नाम से क्रमबद्ध करें',
    sortByLevel: 'स्तर से क्रमबद्ध करें',
    sortByYears: 'वर्षों से क्रमबद्ध करें',
    sortByCategory: 'श्रेणी से क्रमबद्ध करें',
    ascending: 'आरोही',
    descending: 'अवरोही',
    showFilters: 'फ़िल्टर दिखाएं',
    hideFilters: 'फ़िल्टर छुपाएं',
    resetFilters: 'फ़िल्टर रीसेट करें',
    verified: 'सत्यापित',
    years: 'वर्ष',
    level: 'स्तर',
    category: 'श्रेणी',
    technologies: 'तकनीकें',
    
    // Timeline Page
    timeline: 'समयरेखा',
    timelineDescription: 'करियर यात्रा, परियोजनाओं और उपलब्धियों की दृश्य समयरेखा',
    timelinePageTitle: 'समयरेखा',
    horizontalView: 'क्षैतिज दृश्य',
    verticalView: 'ऊर्ध्वाधर दृश्य',
    searchTimeline: 'समयरेखा खोजें...',
    allEvents: 'सभी घटनाएं',
    education: 'शिक्षा',
    noEventsFound: 'आपकी खोज से मेल खाने वाली कोई घटनाएं नहीं मिलीं।',
    noEventsToDisplay: 'दिखाने के लिए कोई घटनाएं नहीं हैं।',
    ongoing: 'चल रहा है',
    keyAchievements: 'मुख्य उपलब्धियां',
    event: 'घटना',
    events: 'घटनाएं',
    totalEvents: 'कुल घटनाएं',
    
    // Welcome Tab Additional
    newProject: 'नई परियोजना...',
    openProject: 'परियोजना खोलें...',
    cloneFromGit: 'Git से क्लोन करें...',
    contactMe: 'मुझसे संपर्क करें...',
    generateAgentInstructions: 'एजेंट निर्देश उत्पन्न करें...',
    openProjectsTab: 'पोर्टफोलियो परियोजनाओं को देखने के लिए परियोजनाएं टैब खोलें',
    repositoryOpened: 'रिपॉजिटरी खोली गई',
    portfolioRepositoryOpened: 'पोर्टफोलियो रिपॉजिटरी नए टैब में खोली गई',
    openingAIChatbot: 'AI चैटबॉट खोल रहे हैं',
    getStartedWithPortfolio: 'पोर्टफोलियो के साथ शुरुआत करें',
    exploreSkillsProjects: 'मेरे कौशल, परियोजनाओं और अनुभव का अन्वेषण करें। सॉफ्टवेयर इंजीनियर के रूप में मेरी यात्रा के बारे में जानें।',
    learnTheFundamentals: 'मूल बातें सीखें',
    discoverCoreTechnologies: 'मेरी मुख्य तकनीकों की खोज करें: Angular, React, TypeScript, और आधुनिक वेब विकास।',
    viewResume: 'रिज्यूमे देखें',
    downloadResumeLearn: 'मेरा रिज्यूमे डाउनलोड करें और मेरे पेशेवर पृष्ठभूमि और उपलब्धियों के बारे में जानें।',
    connectOnLinkedIn: 'LinkedIn पर जुड़ें',
    viewProfessionalProfile: 'मेरा पेशेवर प्रोफ़ाइल, सिफारिशें देखें और LinkedIn पर मुझसे जुड़ें।',
    openingLinkedInProfile: 'LinkedIn प्रोफ़ाइल खोल रहे हैं',
    welcomeToPortfolio: 'स्वागत है',
    start: 'शुरू करें',
    contactMethods: 'संपर्क विधियां',
    aurexProject: 'ऑरेक्स परियोजना',
    noRecentItems: 'अभी तक कोई हाल की वस्तुएं नहीं हैं। अन्वेषण शुरू करें!',
    more: 'अधिक...',
    
    // Contact Form Additional
    whatsThisAbout: 'यह किस बारे में है?',
    tellMeAboutProject: 'मुझे अपने प्रोजेक्ट के बारे में बताएं या बस हैलो कहें...',
    messageSentSuccessfully: 'संदेश सफलतापूर्वक भेजा गया! ईमेल क्लाइंट खोला गया।',
    emailClientOpened: 'ईमेल क्लाइंट खोला गया',
    sendMessage: 'संदेश भेजें',
    sortByNameAZ: 'नाम से क्रमबद्ध करें (A-Z)',
    sortByNameZA: 'नाम से क्रमबद्ध करें (Z-A)',
    noItemsFound: 'आपकी खोज से मेल खाने वाली कोई वस्तुएं नहीं मिलीं।',
    clearSearch: 'खोज साफ करें',
    clearSearchFilters: 'खोज फ़िल्टर साफ करें',
    searchContactMethods: 'संपर्क विधियों और सोशल प्लेटफॉर्म खोजें',
    sortContactItems: 'संपर्क वस्तुओं को क्रमबद्ध करें',
    allFieldsRequired: 'सभी फ़ील्ड आवश्यक हैं',
    emailClientOpenedPleaseSend: 'ईमेल क्लाइंट खोला गया। कृपया अपना संदेश भेजें।',
    failedToOpenEmailClient: 'ईमेल क्लाइंट खोलने में विफल',
    contactAndSocialMedia: 'संपर्क और सोशल मीडिया',
    socialPlatforms: 'सोशल प्लेटफॉर्म',
    professionalInfo: 'पेशेवर जानकारी',
    githubRepositories: 'गिटहब रिपॉजिटरी',
    availability: 'उपलब्धता',
    company: 'कंपनी',
    codeRepositories: 'कोड रिपॉजिटरी',
    professionalNetwork: 'पेशेवर नेटवर्क',
    secureMessaging: 'सुरक्षित मैसेजिंग',
    availableForFreelance: 'फ्रीलांस के लिए उपलब्ध • सोम-शुक्र: 9AM-6PM IST',
    searchSettings: 'सेटिंग्स खोजें...',
    showStatistics: 'आंकड़े दिखाएं',
    themeSwitcher: 'थीम स्विचर',
    languageSwitcher: 'भाषा स्विचर',
    dateTime: 'दिनांक और समय',
    weather: 'मौसम',
    networkStatus: 'नेटवर्क स्थिति',
    systemInfo: 'सिस्टम जानकारी',
    useCompactSpacing: 'कॉम्पैक्ट स्पेसिंग का उपयोग करें',
    enableSmoothTransitions: 'स्मूथ ट्रांजिशन सक्षम करें',
    controlAnimationDuration: 'एनिमेशन अवधि नियंत्रित करें',
    chooseColorTheme: 'रंग थीम चुनें',
    selectInterfaceLanguage: 'इंटरफेस भाषा चुनें',
    adjustTextSize: 'टेक्स्ट आकार समायोजित करें',
    chooseFontStyle: 'फ़ॉन्ट शैली चुनें',
    displayStatsOnWelcomePage: 'स्वागत पृष्ठ पर आंकड़े प्रदर्शित करें',
    displayGitHubProfileData: 'GitHub प्रोफ़ाइल डेटा प्रदर्शित करें',
    displayRecentlyViewedItems: 'हाल ही में देखे गए आइटम प्रदर्शित करें',
    fastAccessToPages: 'पृष्ठों तक त्वरित पहुंच',
    displayRecentItemsInSidebar: 'साइडबार में हाल के आइटम प्रदर्शित करें',
    showThemeSelectorInHeader: 'हेडर में थीम सेलेक्टर दिखाएं',
    showLanguageSelectorInHeader: 'हेडर में भाषा सेलेक्टर दिखाएं',
    showDateAndTimeInStatusBar: 'स्टेटस बार में दिनांक और समय दिखाएं',
    showWeatherInformation: 'मौसम की जानकारी दिखाएं',
    showCurrentLocation: 'वर्तमान स्थान दिखाएं',
    showNetworkLatency: 'नेटवर्क विलंबता दिखाएं',
    showCpuAndMemoryUsage: 'CPU और मेमोरी उपयोग दिखाएं',
    showSocialMediaLinks: 'सोशल मीडिया लिंक दिखाएं',
    showResumeDownloadButton: 'रिज्यूमे डाउनलोड बटन दिखाएं',
    notifyAboutUpdates: 'अपडेट के बारे में सूचित करें',
    newest: 'नवीनतम',
    oldest: 'सबसे पुराना',
    noProjectsFound: 'आपकी खोज से मेल खाने वाली कोई परियोजनाएं नहीं मिलीं।',
    noProjectsAvailable: 'कोई परियोजनाएं उपलब्ध नहीं हैं।',
    noExperienceFound: 'आपकी खोज से मेल खाने वाला कोई अनुभव नहीं मिला।',
    noExperienceAvailable: 'कोई अनुभव उपलब्ध नहीं है।',
  },
}

// Helper function to get translation
export const getTranslation = (code: LanguageCode, key: keyof Translations): string => {
  // Get base language code (e.g., 'en-US' -> 'en', 'es' -> 'es')
  const baseCode = code.split('-')[0]
  
  // Try exact code match first
  if (translations[code] && translations[code][key]) {
    return translations[code][key]
  }
  
  // Try base language code (e.g., 'es' for 'es-ES')
  if (translations[baseCode as LanguageCode] && translations[baseCode as LanguageCode][key]) {
    return translations[baseCode as LanguageCode][key]
  }
  
  // Fallback to English
  if (translations['en-US'] && translations['en-US'][key]) {
    return translations['en-US'][key]
  }
  
  // Last resort: return the key itself
  return key as string
}

