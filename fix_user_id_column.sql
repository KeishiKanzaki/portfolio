-- 既存のテーブルのuser_idカラムの型を変更
ALTER TABLE self_analysis 
  ALTER COLUMN user_id TYPE UUID 
  USING user_id::UUID;
