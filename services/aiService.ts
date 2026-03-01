import axios from 'axios';
import { BlueprintData } from '@/types';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-3.5-turbo';

export async function generateBlueprint(
  ideaTitle: string,
  ideaDescription: string,
  targetAudience: string,
  platformType: string,
  budgetRange: string,
  technicalSkillLevel: string,
  criticModeEnabled: boolean
): Promise<BlueprintData> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const systemPrompt = `You are an expert startup architect and execution strategist. 
Generate a comprehensive execution plan for a startup idea in valid JSON format.
Return ONLY valid JSON, no markdown, no explanations.
Ensure all fields are strings or arrays of strings.
The difficulty_score should be a string like "High", "Medium", or "Low".`;

  const userPrompt = `Generate a complete execution blueprint for this startup idea:

Title: ${ideaTitle}
Description: ${ideaDescription}
Target Audience: ${targetAudience}
Platform Type: ${platformType}
Budget Range: ${budgetRange}
Technical Skill Level: ${technicalSkillLevel}
Include Brutal Critic Analysis: ${criticModeEnabled ? 'YES - Include market risks, execution risks, competitive threats' : 'NO'}

Provide response in this exact JSON structure:
{
  "summary": "2-3 sentence executive summary",
  "problem_statement": "Clear problem statement",
  "target_users": "Detailed description of target users",
  "core_features": ["feature1", "feature2", "feature3"],
  "tech_stack": {
    "frontend": "Recommended frontend stack",
    "backend": "Recommended backend stack",
    "database": "Database recommendations",
    "infrastructure": "Infrastructure recommendations"
  },
  "system_architecture": "Detailed system architecture explanation",
  "database_schema": [
    {
      "table_name": "table_name",
      "fields": [
        {"name": "field_name", "type": "data_type", "description": "description"}
      ]
    }
  ],
  "api_endpoints": [
    {
      "method": "GET",
      "path": "/api/endpoint",
      "description": "Description",
      "parameters": ["param1", "param2"],
      "response": "Response structure"
    }
  ],
  "development_roadmap": [
    {
      "phase": "Phase name",
      "duration": "Duration",
      "tasks": ["task1", "task2"],
      "deliverables": ["deliverable1", "deliverable2"]
    }
  ],
  "monetization_strategy": "Detailed monetization approach",
  "estimated_timeline": "Overall timeline estimate",
  "scaling_strategy": "How to scale the product",
  ${criticModeEnabled ? `"critic_analysis": {
    "market_risks": ["risk1", "risk2"],
    "execution_risks": ["risk1", "risk2"],
    "competitive_threats": ["threat1", "threat2"],
    "difficulty_score": "High/Medium/Low with explanation"
  }` : '"critic_analysis": null'}
}`;

  try {
    const response = await axios.post(
      API_URL,
      {
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
          'X-Title': 'ExecutionBlueprint',
        },
        timeout: 60000,
      }
    );

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse and validate JSON
    let blueprint: BlueprintData;
    try {
      blueprint = JSON.parse(content);
    } catch (e) {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        blueprint = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    // Validate required fields
    validateBlueprintData(blueprint);

    // If critic analysis was requested but not provided, add empty one
    if (criticModeEnabled && !blueprint.critic_analysis) {
      blueprint.critic_analysis = {
        market_risks: [],
        execution_risks: [],
        competitive_threats: [],
        difficulty_score: 'Medium',
      };
    }

    return blueprint;
  } catch (error) {
    console.error('AI Service Error:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        `AI generation failed: ${error.response?.data?.error?.message || error.message}`
      );
    }
    throw error;
  }
}

function validateBlueprintData(data: unknown): asserts data is BlueprintData {
  if (!data || typeof data !== 'object') {
    throw new Error('Blueprint data must be an object');
  }

  const required = [
    'summary',
    'problem_statement',
    'target_users',
    'core_features',
    'tech_stack',
    'system_architecture',
    'database_schema',
    'api_endpoints',
    'development_roadmap',
    'monetization_strategy',
    'estimated_timeline',
    'scaling_strategy',
  ];

  for (const field of required) {
    if (!(field in data)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}