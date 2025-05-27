import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function HomePage() {
  const user = await currentUser();

  return (
    <main className="p-6">
      {user ? (
        <div>
          <p>こんにちは、{user.firstName} さん</p>
          <UserButton afterSignOutUrl="/login" />
        </div>
      ) : (
        <p>ログインしてください</p>
      )}
    </main>
  );
}
