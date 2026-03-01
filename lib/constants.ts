export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  GENERATE: '/generate',
  BLUEPRINT: '/blueprint',
  SETTINGS: '/settings',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
};

export const BUDGET_RANGES = [
  { value: '0-5k', label: '$0 - $5K' },
  { value: '5-25k', label: '$5K - $25K' },
  { value: '25-50k', label: '$25K - $50K' },
  { value: '50-100k', label: '$50K - $100K' },
  { value: '100k+', label: '$100K+' },
];

export const TECH_SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

export const PLATFORM_TYPES = [
  { value: 'web', label: 'Web Application' },
  { value: 'mobile', label: 'Mobile App' },
  { value: 'desktop', label: 'Desktop Application' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'ai-saas', label: 'AI/SaaS' },
];

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me',
    PASSWORD_RESET_REQUEST: '/api/auth/password-reset-request',
    PASSWORD_RESET: '/api/auth/password-reset',
  },
  BLUEPRINTS: {
    CREATE: '/api/blueprints',
    LIST: '/api/blueprints',
    GET: '/api/blueprints/:id',
    DELETE: '/api/blueprints/:id',
  },
};

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Please log in to continue',
  FORBIDDEN: 'You do not have permission',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'An error occurred. Please try again',
  NETWORK_ERROR: 'Network error. Please check your connection',
  INVALID_INPUT: 'Invalid input provided',
  DUPLICATE_EMAIL: 'Email already in use',
};

export const SUCCESS_MESSAGES = {
  BLUEPRINT_CREATED: 'Blueprint created successfully',
  BLUEPRINT_DELETED: 'Blueprint deleted successfully',
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  REGISTER_SUCCESS: 'Account created successfully',
  PASSWORD_RESET_SENT: 'Password reset link sent to your email',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully',
};

export const BLUEPRINT_STATUS = {
  DRAFT: 'draft',
  GENERATING: 'generating',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;