// Comprehensive translation system for all languages

export type LanguageCode = 
  | 'en-US' | 'en-GB' | 'en-CA' | 'en-AU' | 'en-IN' | 'en-IE' | 'en-ZA' | 'en-NZ' | 'en-CB' | 'en-NG' | 'en-SG'
  | 'es' | 'pt' | 'fr' | 'it' | 'de' | 'ru' | 'hi' | 'zh' | 'ja' | 'ko' | 'ml'

export interface Language {
  code: LanguageCode
  name: string
  nativeName: string
  flag: string
}

export const languages: Language[] = [
  // English variants
  { code: 'en-US', name: 'English', nativeName: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English', nativeName: 'English (UK)', flag: '🇬🇧' },
  { code: 'en-CA', name: 'English', nativeName: 'English (CA)', flag: '🇨🇦' },
  { code: 'en-AU', name: 'English', nativeName: 'English (AU)', flag: '🇦🇺' },
  { code: 'en-IN', name: 'English', nativeName: 'English (IN)', flag: '🇮🇳' },
  { code: 'en-IE', name: 'English', nativeName: 'English (IE)', flag: '🇮🇪' },
  { code: 'en-ZA', name: 'English', nativeName: 'English (ZA)', flag: '🇿🇦' },
  { code: 'en-NZ', name: 'English', nativeName: 'English (NZ)', flag: '🇳🇿' },
  { code: 'en-CB', name: 'English', nativeName: 'English (Caribbean)', flag: '🇯🇲' },
  { code: 'en-NG', name: 'English', nativeName: 'English (Nigeria)', flag: '🇳🇬' },
  { code: 'en-SG', name: 'English', nativeName: 'English (Singapore)', flag: '🇸🇬' },
  
  // Major languages
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
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
}

// Get base language code (e.g., 'en-US' -> 'en')
const getBaseLanguage = (code: LanguageCode): string => {
  return code.split('-')[0]
}

// Translation mapping - using English as base for most variants
export const translations: Record<LanguageCode, Translations> = {
  // English variants - all use US English for now
  'en-US': enUSTranslations,
  'en-GB': enUSTranslations,
  'en-CA': enUSTranslations,
  'en-AU': enUSTranslations,
  'en-IN': enUSTranslations,
  'en-IE': enUSTranslations,
  'en-ZA': enUSTranslations,
  'en-NZ': enUSTranslations,
  'en-CB': enUSTranslations,
  'en-NG': enUSTranslations,
  'en-SG': enUSTranslations,
  
  // Spanish
  'es': {
    searchPlaceholder: 'Buscar',
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
  },
  
  // Malayalam
  'ml': {
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
  },
  
  // Hindi
  'hi': {
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
  },
  
  // For other languages, use English as fallback for now
  // In a production app, you would add full translations for each
  'pt': enUSTranslations,
  'fr': enUSTranslations,
  'it': enUSTranslations,
  'de': enUSTranslations,
  'ru': enUSTranslations,
  'zh': enUSTranslations,
  'ja': enUSTranslations,
  'ko': enUSTranslations,
}

// Helper function to get translation
export const getTranslation = (code: LanguageCode, key: keyof Translations): string => {
  return translations[code]?.[key] || translations['en-US'][key] || key
}

