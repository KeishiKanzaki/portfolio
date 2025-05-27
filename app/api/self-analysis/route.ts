import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createSupabaseClientWithToken } from "@/lib/supabase";

// GET（取得）
export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { getToken } = await auth();
  const token = await getToken({ template: "supabase" });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseClientWithToken(token);

  try {
    const { data, error } = await supabase
      .from("self_analysis")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("データ取得エラー:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("予期せぬエラー:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST（新規作成)
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { getToken } = await auth();
  const token = await getToken({ template: "supabase" });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseClientWithToken(token);

  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("self_analysis")
      .insert([
        {
          content,
          user_id: user.id,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("DB挿入エラー:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("予期せぬエラー:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH（更新）
export async function PATCH(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { getToken } = await auth();
  const token = await getToken({ template: "supabase" });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseClientWithToken(token);

  try {
    const { id, content } = await req.json();

    if (!id || !content) {
      return NextResponse.json(
        { error: "ID and content are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("self_analysis")
      .update({ content })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE（削除）
export async function DELETE(req: Request) {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const { getToken } = await auth();
  const token = await getToken({ template: "supabase" });
  if (!token) return new Response("Unauthorized", { status: 401 });
  const supabase = createSupabaseClientWithToken(token);

  const { id } = await req.json();

  const { error } = await supabase
    .from("self_analysis")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    return new Response("DB Delete Error", { status: 500 });
  }

  return new Response("Deleted", { status: 200 });
}
