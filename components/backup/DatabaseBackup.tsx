"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Download,
  Upload,
  Image as ImageIcon,
  Shield,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export function DatabaseBackup() {
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);

  // 完全バックアップの作成
  const createFullBackup = async () => {
    setLoading(true);
    try {
      // 1. 全てのテーブルデータを取得
      const [
        { data: pages },
        { data: sections },
        { data: mainVisualSections },
        { data: imgTextSections },
        { data: cardsSections },
      ] = await Promise.all([
        supabase.from("pages").select("*"),
        supabase.from("sections").select("*"),
        supabase.from("main_visual_sections").select("*"),
        supabase.from("img_text_sections").select("*"),
        supabase.from("cards").select("*"),
      ]);

      // 2. 画像ファイル一覧を取得
      const { data: images } = await supabase.storage
        .from("cms-images")
        .list("images", { limit: 1000 });

      // 3. バックアップデータを作成
      const backupData = {
        timestamp: new Date().toISOString(),
        version: "1.0",
        description: "CMSデータベース完全バックアップ",
        database: {
          pages,
          sections,
          main_visual_sections: mainVisualSections,
          img_text_sections: imgTextSections,
          cards: cardsSections,
        },
        images:
          images?.map((img) => ({
            name: img.name,
            size: img.metadata?.size,
            lastModified: img.updated_at,
          })) || [],
        stats: {
          totalPages: pages?.length || 0,
          totalSections: sections?.length || 0,
          totalImages: images?.length || 0,
        },
      };

      // 4. JSONファイルとしてダウンロード
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cms-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(
        `バックアップ完了！ページ: ${backupData.stats.totalPages}、セクション: ${backupData.stats.totalSections}、画像: ${backupData.stats.totalImages}`
      );
    } catch (error) {
      console.error("バックアップエラー:", error);
      toast.error("バックアップ作成中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // バックアップからの復元
  const restoreFromBackup = async (file: File) => {
    setRestoring(true);
    try {
      // 1. ファイルを読み込み
      const text = await file.text();
      const backupData = JSON.parse(text);

      if (!backupData.database || !backupData.version) {
        throw new Error("無効なバックアップファイルです");
      }

      // 2. 復元前に確認
      const backupDate = new Date(backupData.timestamp).toLocaleString("ja-JP");
      const confirmed = confirm(
        `⚠️ 重要な確認 ⚠️\n\n` +
          `現在のサイトデータは全て削除され、以下のバックアップで置き換えられます：\n\n` +
          `📅 バックアップ日時: ${backupDate}\n` +
          `📄 ページ数: ${backupData.stats?.totalPages || 0}\n` +
          `📝 セクション数: ${backupData.stats?.totalSections || 0}\n` +
          `🖼️ 画像数: ${backupData.stats?.totalImages || 0}\n\n` +
          `この操作は取り消せません。復元を実行しますか？`
      );

      if (!confirmed) {
        setRestoring(false);
        return;
      }

      // 3. 既存データの削除（逆順で削除して外部キー制約を回避）
      await Promise.all([
        supabase.from("cards").delete().neq("id", 0),
        supabase.from("main_visual_sections").delete().neq("id", 0),
        supabase.from("img_text_sections").delete().neq("id", 0),
      ]);

      await supabase.from("sections").delete().neq("id", 0);
      await supabase.from("pages").delete().neq("id", 0);

      // 4. バックアップデータの復元
      const { database } = backupData;

      // pages テーブルから復元
      if (database.pages?.length > 0) {
        const { error: pagesError } = await supabase
          .from("pages")
          .insert(database.pages);
        if (pagesError) throw pagesError;
      }

      // sections テーブルから復元
      if (database.sections?.length > 0) {
        const { error: sectionsError } = await supabase
          .from("sections")
          .insert(database.sections);
        if (sectionsError) throw sectionsError;
      }

      // セクション詳細テーブルから復元
      const restorePromises = [];

      if (database.main_visual_sections?.length > 0) {
        restorePromises.push(
          supabase
            .from("main_visual_sections")
            .insert(database.main_visual_sections)
        );
      }

      if (database.img_text_sections?.length > 0) {
        restorePromises.push(
          supabase.from("img_text_sections").insert(database.img_text_sections)
        );
      }

      if (database.cards?.length > 0) {
        restorePromises.push(supabase.from("cards").insert(database.cards));
      }

      await Promise.all(restorePromises);

      toast.success("✅ バックアップからの復元が完了しました！");

      // ページをリロードして変更を反映
      if (confirm("ページをリロードして復元されたデータを確認しますか？")) {
        window.location.reload();
      }
    } catch (error) {
      console.error("復元エラー:", error);
      toast.error(
        `復元中にエラーが発生しました: ${error instanceof Error ? error.message : "不明なエラー"}`
      );
    } finally {
      setRestoring(false);
    }
  };

  // ファイル選択ハンドラー
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/json") {
        toast.error("JSONファイルを選択してください");
        return;
      }
      restoreFromBackup(file);
    }
    // ファイル選択をリセット
    event.target.value = "";
  };

  return (
    <div className="flex h-full flex-col space-y-6">
      <Card className="flex flex-1 flex-col rounded-sm p-6">
        <h3 className="mb-4">データベースバックアップ</h3>

        <div className="space-y-6">
          <div className="rounded-lg border p-4">
            <div className="flex items-start">
              <Shield className="mr-2 mt-0.5 h-5 w-5" />
              <div className=" ">
                <p className="mb-1 font-medium">完全なサイトデータ保護</p>
                <p>
                  全てのページ、セクション、コンテンツをワンクリックでバックアップ・復元できます。
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* バックアップ作成 */}
            <div className="space-y-4">
              <h4 className="flex items-center font-medium">
                <Download className="mr-2 h-4 w-4" />
                バックアップ作成
              </h4>
              <Button
                onClick={createFullBackup}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    作成中...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    今すぐバックアップ
                  </>
                )}
              </Button>
              <div className="space-y-1 text-xs text-gray-600">
                <p>• 全てのページとコンテンツを保存</p>
                <p>• 日付付きファイル名で自動保存</p>
                <p>• PCに安全にダウンロード</p>
              </div>
            </div>

            {/* バックアップ復元 */}
            <div className="space-y-4">
              <h4 className="flex items-center font-medium">
                <Upload className="mr-2 h-4 w-4" />
                バックアップ復元
              </h4>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  disabled={restoring}
                />
                <Button
                  variant="outline"
                  disabled={restoring}
                  className="w-full"
                  size="lg"
                >
                  {restoring ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent" />
                      復元中...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      ファイルを選択して復元
                    </>
                  )}
                </Button>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <p>• 以前のバックアップから復元</p>
                <p>• 完全に元の状態に戻ります</p>
                <p>• 復元前に確認ダイアログ表示</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-start">
              <ImageIcon className="mr-2 mt-0.5 h-5 w-5" />
              <div className=" ">
                <p className="mb-1 font-medium">画像ファイルについて</p>
                <p>
                  画像ファイルはデータベースバックアップに含まれません。
                  重要な画像は「画像ギャラリー」から手動で保存することをお勧めします。
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-start">
              <AlertCircle className="mr-2 mt-0.5 h-5 w-5" />
              <div className=" ">
                <p className="mb-1 font-medium">重要な注意事項</p>
                <p>
                  復元操作は現在のデータを完全に上書きします。
                  重要な変更を行った後は、必ず新しいバックアップを作成してください。
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
