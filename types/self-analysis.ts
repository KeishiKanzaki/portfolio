// types/self-analysis.ts
export interface SelfAnalysis {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: 'general' | 'strength' | 'weakness' | 'values' | 'goals' | 'skills' | 'personality';
  tags: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSelfAnalysisRequest {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
}

export interface UpdateSelfAnalysisRequest {
  id: string;
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  is_public?: boolean;
}
