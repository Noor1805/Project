export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  accessToken?: string;
}

export interface BlueprintInput {
  ideaTitle: string;
  ideaDescription: string;
  targetAudience: string;
  platformType: string;
  budgetRange: string;
  technicalSkillLevel: string;
  criticModeEnabled: boolean;
}

export interface CoreFeature {
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface TechStack {
  frontend: string;
  backend: string;
  database: string;
  infrastructure: string;
}

export interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  authentication: boolean;
}

export interface DatabaseSchema {
  collection: string;
  fields: Array<{
    name: string;
    type: string;
    required: boolean;
  }>;
}

export interface DevelopmentRoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  tasks: string[];
}

export interface CriticAnalysis {
  market_risks: string[];
  execution_risks: string[];
  competitive_threats: string[];
  difficulty_score: string;
}

export interface BlueprintOutput {
  summary: string;
  problem_statement: string;
  target_users: string;
  core_features: CoreFeature[];
  tech_stack: TechStack;
  system_architecture: string;
  database_schema: DatabaseSchema[];
  api_endpoints: ApiEndpoint[];
  development_roadmap: DevelopmentRoadmapPhase[];
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
  structuredOutput: BlueprintOutput;
  criticModeEnabled: boolean;
  createdAt: Date;
}

export interface TokenPayload {
  userId: string;
  email: string;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
  status: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  status: number;
}