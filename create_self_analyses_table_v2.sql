-- 新しい自己分析テーブル（Supabase Auth用）
-- 既存のテーブルがある場合は削除
DROP TABLE IF EXISTS self_analyses;

-- 自己分析テーブルの作成
CREATE TABLE self_analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'general', -- 'strength', 'weakness', 'values', 'goals', etc.
    tags TEXT[], -- 自己分析のタグ（例：['キャリア', 'スキル', '価値観']）
    is_public BOOLEAN DEFAULT FALSE, -- 公開設定
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- インデックスの作成
CREATE INDEX idx_self_analyses_user_id ON self_analyses(user_id);
CREATE INDEX idx_self_analyses_category ON self_analyses(category);
CREATE INDEX idx_self_analyses_created_at ON self_analyses(created_at DESC);

-- RLSポリシーの設定
ALTER TABLE self_analyses ENABLE ROW LEVEL SECURITY;

-- ユーザーが自分のデータのみを操作できるポリシー
CREATE POLICY "Users can view their own self analyses" ON self_analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own self analyses" ON self_analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own self analyses" ON self_analyses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own self analyses" ON self_analyses
    FOR DELETE USING (auth.uid() = user_id);

-- 公開された自己分析を他のユーザーが閲覧できるポリシー（オプション）
CREATE POLICY "Users can view public self analyses" ON self_analyses
    FOR SELECT USING (is_public = TRUE);

-- updated_atの自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_self_analyses_updated_at
    BEFORE UPDATE ON self_analyses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
