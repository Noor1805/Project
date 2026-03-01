import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// NextAuth handles session/token persistence via cookies automatically.
// legacy interceptors removed.

export async function generateBlueprint(data: {
  ideaTitle: string;
  ideaDescription: string;
  targetAudience: string;
  platformType: string;
  budgetRange: string;
  technicalSkillLevel: string;
  criticModeEnabled: boolean;
}) {
  return await apiClient.post("/api/blueprints/generate", data);
}

export async function getBlueprints() {
  return await apiClient.get("/api/blueprints");
}

export async function getBlueprint(id: string) {
  return await apiClient.get(`/api/blueprints/${id}`);
}

export async function deleteBlueprint(id: string) {
  return await apiClient.delete(`/api/blueprints/${id}`);
}
