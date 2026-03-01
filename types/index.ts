export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPublic {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface CriticAnalysis {
  market_risks: string[];
  execution_risks: string[];
  competitive_threats: string[];
  difficulty_score: string;
}

export interface TechStack {
  frontend: string;
  backend: string;
  database: string;
  infrastructure: string;
}

export interface DatabaseSchema {
  table_name: string;
  fields: Array<{
    name: string;
    type: string;
    description: string;
  }>;
}

export interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  parameters?: string[];
  response?: string;
}

export interface DevelopmentPhase {
  phase: string;
  duration: string;
  tasks: string[];
  deliverables: string[];
}

export interface BlueprintData {
  summary: string;
  problem_statement: string;
  target_users: string;
  core_features: string[];
  tech_stack: TechStack;
  system_architecture: string;
  database_schema: DatabaseSchema[];
  api_endpoints: APIEndpoint[];
  development_roadmap: DevelopmentPhase[];
  monetization_strategy: string;
  estimated_timeline: string;
  scaling_strategy: string;
  critic_analysis?: CriticAnalysis;
}

export interface Blueprint {
  _id: string;
  userId: string;
  ideaTitle: string;
  ideaDescription: string;
  targetAudience: string;
  platformType: string;
  budgetRange: string;
  technicalSkillLevel: string;
  criticModeEnabled: boolean;
  structuredOutput: BlueprintData;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlueprintRequest {
  ideaTitle: string;
  ideaDescription: string;
  targetAudience: string;
  platformType: string;
  budgetRange: string;
  technicalSkillLevel: string;
  criticModeEnabled: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserPublic;
  accessToken?: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}