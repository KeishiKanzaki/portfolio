'use server';

import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { PostgrestError } from "@supabase/supabase-js";//supabaseSDKより、エラーの型インポート

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface DashboardData {
  user: UserProfile;
  stats: {
    completedAnalyses: number;
    portfolioProjects: number;
    submittedES: number;
    communityPosts: number;
    weeklyGoalProgress: number;
  };
  recentActivities: Array<{
    id: string;
    type: string;
    title: string;
    created_at: string;
    description?: string;
  }>;
  weeklyTasks: Array<{
    id: string;
    task: string;
    completed: boolean;
    due_date?: string;
  }>;
  upcomingDeadlines: Array<{
    id: string;
    company: string;
    position: string;
    deadline: string;
    urgent: boolean;
  }>;
}

/**
 * Supabaseサーバークライアントを作成する
 */
async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

/**
 * ログインユーザーのダッシュボードデータを取得する
 */
export async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const supabase = await createSupabaseServerClient();
    
    // 現在のユーザーを取得
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user?.email) {
      throw new Error('ユーザーが認証されていません');
    }

    // Supabaseからユーザー情報を取得
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (profileError || !userProfile) {
      throw new Error('ユーザー情報の取得に失敗しました');
    }

    // 自己分析データの統計を取得
    const { data: selfAnalysisData, error: analysisError } = await supabase
      .from('self_analysis')
      .select('id, completed')
      .eq('user_id', userProfile.id);

    if (analysisError) {
      console.error('自己分析データの取得エラー:', analysisError);
    }

    const completedAnalyses = selfAnalysisData?.filter((item: any) => item.completed).length || 0;

    // 最近のアクティビティを取得（仮想データ - 実際のテーブルに合わせて修正してください）
    const recentActivities = [
      {
        id: '1',
        type: 'analysis',
        title: 'MBTI性格診断を完了しました',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2時間前
        description: '性格タイプが判明しました'
      },
      {
        id: '2',
        type: 'portfolio',
        title: '新しいプロジェクト「ECサイト開発」を追加',
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5時間前
        description: 'ポートフォリオが更新されました'
      }
    ];

    // 今週のタスク（仮想データ - 実際のテーブルに合わせて修正してください）
    const weeklyTasks = [
      {
        id: '1',
        task: '自己分析を完了する',
        completed: true,
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        task: 'ポートフォリオを更新',
        completed: false,
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // 近日締め切り（仮想データ - 実際のテーブルに合わせて修正してください）
    const upcomingDeadlines = [
      {
        id: '1',
        company: 'A社',
        position: 'ソフトウェアエンジニア',
        deadline: '2024-06-15',
        urgent: true
      },
      {
        id: '2',
        company: 'B社',
        position: 'フロントエンドエンジニア',
        deadline: '2024-06-20',
        urgent: false
      }
    ];

    const dashboardData: DashboardData = {
      user: userProfile,
      stats: {
        completedAnalyses,
        portfolioProjects: 5, // 仮の値 - 実際のデータに合わせて修正
        submittedES: 12, // 仮の値 - 実際のデータに合わせて修正
        communityPosts: 8, // 仮の値 - 実際のデータに合わせて修正
        weeklyGoalProgress: 75 // 仮の値 - 実際のデータに合わせて修正
      },
      recentActivities,
      weeklyTasks,
      upcomingDeadlines
    };

    console.log('ダッシュボードデータ構築完了');
    return dashboardData;

  } catch (error) {
    console.error('ダッシュボードデータの取得エラー:', error);
    return null;
  }
}

/**
 * タスクの完了状態を更新する
 */
export async function updateTaskStatus(taskId: string, completed: boolean) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // 現在のユーザーを取得
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user?.email) {
      throw new Error('ユーザーが認証されていません');
    }

    // 実際のタスクテーブルがある場合はここで更新処理を行う
    // const { error } = await supabase
    //   .from('tasks')
    //   .update({ completed })
    //   .eq('id', taskId)
    //   .eq('user_id', user.id);

    // if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('タスク更新エラー:', error);
    return { success: false, error: error instanceof Error ? error.message : '更新に失敗しました' };
  }
}

/**
 * ログアウトする
 */
export async function signOut() {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error('ログアウトに失敗しました');
    }

    return { success: true };
  } catch (error) {
    console.error('ログアウトエラー:', error);
    return { success: false, error: error instanceof Error ? error.message : 'ログアウトに失敗しました' };
  }
}
