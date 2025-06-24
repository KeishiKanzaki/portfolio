import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// デバッグページを作成して認証状態を確認
export default async function AuthDebugPage() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
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

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">認証状態デバッグ</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">セッション情報</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(session, null, 2)}
          </pre>
          {sessionError && (
            <p className="text-red-600">Session Error: {sessionError.message}</p>
          )}
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">ユーザー情報</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(user, null, 2)}
          </pre>
          {userError && (
            <p className="text-red-600">User Error: {userError.message}</p>
          )}
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">Cookie情報</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(Object.fromEntries(cookieStore.getAll().map(c => [c.name, c.value])), null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
