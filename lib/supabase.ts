import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 基本的なSupabaseクライアント
export const supabase = createClient(supabaseUrl, supabaseKey);

// ブラウザ環境用のSSRクライアント
export const createBrowserSupabaseClient = () => 
  createBrowserClient(supabaseUrl, supabaseKey);

export interface SelfAnalysis {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export interface CreateSelfAnalysisData {
  title: string
  content: string
}

export interface UpdateSelfAnalysisData {
  title?: string
  content?: string
}

// 自己分析データのCRUD操作関数
export const selfAnalysisService = {
  // 全ての自己分析を取得
  async getAll(): Promise<SelfAnalysis[]> {
    const { data, error } = await supabase
      .from('self_analyses')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching self analyses:', error);
      throw error;
    }
    
    return data || [];
  },

  // 特定の自己分析を取得
  async getById(id: string): Promise<SelfAnalysis | null> {
    const { data, error } = await supabase
      .from('self_analyses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // データが見つからない場合
      }
      console.error('Error fetching self analysis:', error);
      throw error;
    }
    
    return data;
  },

  // 新しい自己分析を作成
  async create(data: CreateSelfAnalysisData, userId: string): Promise<SelfAnalysis> {
    const { data: result, error } = await supabase
      .from('self_analyses')
      .insert([{
        title: data.title,
        content: data.content,
        user_id: userId
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating self analysis:', error);
      throw error;
    }
    
    return result;
  },

  // 自己分析を更新
  async update(id: string, data: UpdateSelfAnalysisData): Promise<SelfAnalysis> {
    const { data: result, error } = await supabase
      .from('self_analyses')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating self analysis:', error);
      throw error;
    }
    
    return result;
  },

  // 自己分析を削除
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('self_analyses')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting self analysis:', error);
      throw error;
    }
  }
};
