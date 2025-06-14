-- テーブルが存在する場合は削除
DROP TABLE IF EXISTS self_analysis;

-- テーブルの作成
CREATE TABLE self_analysis (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    content TEXT NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLSポリシーの設定
ALTER TABLE self_analysis ENABLE ROW LEVEL SECURITY;

-- ユーザーが自分のデータのみを参照・更新・削除できるポリシーを作成
CREATE POLICY "Users can view their own entries" ON self_analysis
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entries" ON self_analysis
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries" ON self_analysis
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries" ON self_analysis
    FOR DELETE USING (auth.uid() = user_id);
