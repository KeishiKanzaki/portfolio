"use client";

import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";

export default function SelfAnalysisPage() {
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  //編集開始
  const startEdit = (id: number, content: string) => {
    setEditId(id);
    setEditContent(content);
  };

  // 編集送信
  const handleUpdate = async () => {
    const res = await fetch(`/api/self-analysis/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId, content: editContent }),
    });

    if (res.ok) {
      setMessage("更新しました！");
      setEditId(null);
      setEditContent("");
      fetchEntries(); // 再取得
    } else {
      setMessage("更新に失敗しました。");
    }
  };

  //削除
  const handleDelete = async (id: number) => {
    const confirmed = confirm("本当に削除しますか？");
    if (!confirmed) return;

    const res = await fetch(`/api/self-analysis/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setMessage("削除しました！");
      fetchEntries(); // 再取得
    } else {
      setMessage("削除に失敗しました。");
    }
  };

  // 保存
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/self-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        setMessage("保存しました！");
        setContent("");
        fetchEntries(); // 再取得
      } else {
        const errorData = await res.json();
        setMessage(`保存に失敗しました: ${errorData.error || "不明なエラー"}`);
      }
    } catch (error) {
      setMessage(
        "保存に失敗しました。ネットワークエラーが発生した可能性があります。"
      );
    }
  };

  // データ取得
  const fetchEntries = async () => {
    const res = await fetch("/api/self-analysis");
    if (res.ok) {
      const data = await res.json();
      setEntries(data);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10">
      {/* 右上にUserButtonを常時表示 */}
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 1000 }}>
        <UserButton afterSignOutUrl="/login" />
      </div>

      <h1 className="text-2xl font-bold mb-4">自己分析を投稿</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full p-2 border rounded"
          placeholder="私の強みは..."
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          保存
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-green-600">{message}</p>}

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">投稿一覧</h2>
      <ul className="space-y-3">
        {entries.map((entry) => (
          <li key={entry.id} className="p-3 border rounded bg-gray-50">
            {editId === entry.id ? (
              <>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <button
                  onClick={handleUpdate}
                  className="mr-2 px-3 py-1 bg-green-600 text-white rounded"
                >
                  更新
                </button>
                <button
                  onClick={() => setEditId(null)}
                  className="px-3 py-1 bg-gray-400 text-white rounded"
                >
                  キャンセル
                </button>
              </>
            ) : (
              <>
                <p>{entry.content}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => startEdit(entry.id, entry.content)}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    削除
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
