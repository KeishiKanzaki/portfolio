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

export interface Task {
  id: string
  user_id: string
  title: string
  description: string
  due_date: string
  due_time: string | null
  completed: boolean
  priority: "low" | "medium" | "high"
  created_at: string
  updated_at: string
}

export interface CreateTaskData {
  title: string
  description: string
  due_date: string
  due_time: string
  priority: "low" | "medium" | "high"
}

export interface UpdateTaskData {
  title?: string
  description?: string
  due_date?: string
  due_time?: string
  priority?: "low" | "medium" | "high"
  completed?: boolean
}

// タスクデータのCRUD操作関数
export const taskService = {
  // ユーザーのすべてのタスクを取得
  async getAll(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
    
    return data || [];
  },

  // 特定のタスクを取得
  async getById(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // データが見つからない場合
      }
      console.error('Error fetching task:', error);
      throw error;
    }
    
    return data;
  },

  // 新しいタスクを作成
  async create(data: CreateTaskData, userId: string): Promise<Task> {
    const { data: result, error } = await supabase
      .from('tasks')
      .insert([{
        title: data.title,
        description: data.description,
        due_date: data.due_date,
        due_time: data.due_time,
        priority: data.priority,
        user_id: userId
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }
    
    return result;
  },

  // タスクを更新
  async update(id: string, data: UpdateTaskData): Promise<Task> {
    const { data: result, error } = await supabase
      .from('tasks')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }
    
    return result;
  },

  // タスクを削除
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // タスクの完了状態を切り替え
  async toggleComplete(id: string, completed: boolean): Promise<Task> {
    const { data: result, error } = await supabase
      .from('tasks')
      .update({ completed })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
    
    return result;
  }
};

// Research関連の型定義
export interface Research {
  id: string
  user_id: string
  title: string
  description: string
  type: "graduation" | "master" | "doctoral" | "other"
  year: string
  pdf_file_path?: string
  pdf_file_name?: string
  created_at: string
  updated_at: string
}

export interface CreateResearchData {
  title: string
  description: string
  type: "graduation" | "master" | "doctoral" | "other"
  year: string
  pdfFile?: File
}

export interface UpdateResearchData {
  title?: string
  description?: string
  type?: "graduation" | "master" | "doctoral" | "other"
  year?: string
  pdfFile?: File
}

// 研究データのCRUD操作関数
export const researchService = {
  // ユーザーのすべての研究を取得
  async getAll(userId: string): Promise<Research[]> {
    const { data, error } = await supabase
      .from('researches')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching researches:', error);
      throw error;
    }
    
    return data || [];
  },

  // 特定の研究を取得
  async getById(id: string): Promise<Research | null> {
    const { data, error } = await supabase
      .from('researches')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // データが見つからない場合
      }
      console.error('Error fetching research:', error);
      throw error;
    }
    
    return data;
  },

  // 新しい研究を作成
  async create(data: CreateResearchData, userId: string): Promise<Research> {
    let pdfFilePath = null;
    let pdfFileName = null;

    // PDFファイルがある場合はStorageにアップロード
    if (data.pdfFile) {
      const fileExt = data.pdfFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('research-pdfs')
        .upload(filePath, data.pdfFile);

      if (uploadError) {
        console.error('Error uploading PDF:', uploadError);
        throw uploadError;
      }

      pdfFilePath = filePath;
      pdfFileName = data.pdfFile.name;
    }

    const { data: result, error } = await supabase
      .from('researches')
      .insert([{
        title: data.title,
        description: data.description,
        type: data.type,
        year: data.year,
        pdf_file_path: pdfFilePath,
        pdf_file_name: pdfFileName,
        user_id: userId
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating research:', error);
      throw error;
    }
    
    return result;
  },

  // 研究を更新
  async update(id: string, data: UpdateResearchData, userId?: string): Promise<Research> {
    let updateData: any = {
      title: data.title,
      description: data.description,
      type: data.type,
      year: data.year,
    }

    // PDFファイルがある場合はStorageにアップロードして既存ファイルを置き換え
    if (data.pdfFile && userId) {
      // 既存のファイルパスを取得
      const existingResearch = await this.getById(id);
      
      // 既存ファイルがあれば削除
      if (existingResearch?.pdf_file_path) {
        const { error: deleteFileError } = await supabase.storage
          .from('research-pdfs')
          .remove([existingResearch.pdf_file_path]);
        
        if (deleteFileError) {
          console.error('Error deleting old PDF file:', deleteFileError);
        }
      }

      // 新しいファイルをアップロード
      const fileExt = data.pdfFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('research-pdfs')
        .upload(filePath, data.pdfFile);

      if (uploadError) {
        console.error('Error uploading new PDF:', uploadError);
        throw uploadError;
      }

      updateData.pdf_file_path = filePath;
      updateData.pdf_file_name = data.pdfFile.name;
    }

    const { data: result, error } = await supabase
      .from('researches')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating research:', error);
      throw error;
    }
    
    return result;
  },

  // 研究を削除
  async delete(id: string): Promise<void> {
    // まず研究データを取得してPDFファイルパスを確認
    const research = await this.getById(id);
    
    if (research?.pdf_file_path) {
      // Storageからファイルを削除
      const { error: deleteFileError } = await supabase.storage
        .from('research-pdfs')
        .remove([research.pdf_file_path]);
      
      if (deleteFileError) {
        console.error('Error deleting PDF file:', deleteFileError);
        // ファイル削除エラーでも研究データは削除を続行
      }
    }

    const { error } = await supabase
      .from('researches')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting research:', error);
      throw error;
    }
  },

  // PDFファイルのダウンロードURL取得
  async getPdfDownloadUrl(filePath: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('research-pdfs')
      .createSignedUrl(filePath, 3600); // 1時間有効
    
    if (error) {
      console.error('Error creating signed URL:', error);
      throw error;
    }
    
    return data.signedUrl;
  }
};
