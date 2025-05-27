import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GETリクエスト - 特定のIDの自己分析を取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: selfAnalysis, error } = await supabase
      .from("self_analysis")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!selfAnalysis) {
      return NextResponse.json(
        { error: "Self analysis not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(selfAnalysis);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUTリクエスト - 特定のIDの自己分析を更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  try {
    // ユーザーが所有するデータかどうかを確認
    const { data: existingAnalysis } = await supabase
      .from("self_analysis")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single();

    if (!existingAnalysis) {
      return NextResponse.json(
        { error: "Not found or unauthorized" },
        { status: 404 }
      );
    }

    const { data: selfAnalysis, error } = await supabase
      .from("self_analysis")
      .update(body)
      .eq("id", params.id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(selfAnalysis);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETEリクエスト - 特定のIDの自己分析を削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ユーザーが所有するデータかどうかを確認
    const { data: existingAnalysis } = await supabase
      .from("self_analysis")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single();

    if (!existingAnalysis) {
      return NextResponse.json(
        { error: "Not found or unauthorized" },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from("self_analysis")
      .delete()
      .eq("id", params.id)
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Successfully deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
