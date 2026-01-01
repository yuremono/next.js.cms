import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Page } from "@/types";
import { checkAuth } from "@/lib/auth";

const DEFAULT_PAGE_DATA: Page = {
  header: {
    html: `<div class="bg-white shadow-sm">
  <div class="container mx-auto px-4 py-4 flex justify-between items-center">
    <div class="logo">
      <a href="/" class="text-xl font-bold">サイト名</a>
    </div>
    <nav>
      <ul class="flex space-x-6">
        <li><a href="#" class="hover:text-primary">ホーム</a></li>
        <li><a href="#" class="hover:text-primary">会社概要</a></li>
        <li><a href="#" class="hover:text-primary">サービス</a></li>
        <li><a href="#" class="hover:text-primary">お問い合わせ</a></li>
      </ul>
    </nav>
  </div>
</div>`,
  },
  footer: {
    html: `<div class="bg-gray-800 text-white">
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 class="text-lg font-semibold mb-4">会社名</h3>
        <p>〒123-4567<br />東京都○○区△△ 1-2-3</p>
        <p>TEL: 03-1234-5678</p>
      </div>
      <div>
        <h3 class="text-lg font-semibold mb-4">リンク</h3>
        <ul class="space-y-2">
          <li><a href="#" class="hover:underline">ホーム</a></li>
          <li><a href="#" class="hover:underline">会社概要</a></li>
          <li><a href="#" class="hover:underline">サービス</a></li>
          <li><a href="#" class="hover:underline">お問い合わせ</a></li>
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-semibold mb-4">SNS</h3>
        <div class="flex space-x-4">
          <a href="#" class="hover:text-primary">Twitter</a>
          <a href="#" class="hover:text-primary">Facebook</a>
          <a href="#" class="hover:text-primary">Instagram</a>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-700 mt-8 pt-4 text-center">
      <p>© 2024 会社名. All rights reserved.</p>
    </div>
  </div>
</div>`,
  },
  sections: [
    {
      id: "section-default-1",
      layout: "mainVisual",
      class: "MainVisual bg-gray-50",
      html: '<h1 class="text-4xl font-bold mb-4">簡易CMSシステム</h1><p class="text-xl">AIによるテキスト生成機能を備えた、テンプレートベースのWebサイト構築システムです。<br>ドラッグ＆ドロップでセクションを追加・入れ替えでき、簡単にWebサイトを編集できます。</p>',
      image: "",
    },
    {
      id: "section-default-2",
      layout: "imgText",
      class: "ImgText",
      html: '<h2 class="text-2xl font-semibold mb-4">セクションタイトル</h2><p>ここにテキストを入力します。このページは管理画面から自由に編集することができます。画像やテキストの配置、セクションの追加・並べ替えなど、さまざまなカスタマイズが可能です。</p><p class="mt-4">AIテキスト生成機能を使えば、プロフェッショナルな文章を簡単に作成できます。</p>',
      image: "",
    },
    {
      id: "section-default-3",
      layout: "cards",
      class: "Cards bg-gray-50",
      cards: [
        {
          html: '<h3 class="text-xl font-semibold mb-2">簡単操作</h3><p>直感的なインターフェースで、専門知識がなくても簡単にWebサイトを編集できます。</p>',
          image: "",
        },
        {
          html: '<h3 class="text-xl font-semibold mb-2">AI機能</h3><p>OpenAI連携でプロフェッショナルなテキストを自動生成できます。</p>',
          image: "",
        },
        {
          html: '<h3 class="text-xl font-semibold mb-2">レスポンシブ</h3><p>PC・タブレット・スマートフォンなど、あらゆる画面サイズに対応しています。</p>',
          image: "",
        },
      ],
    },
    {
      id: "section-default-4",
      layout: "form",
      class: "Form",
      html: '<h2 class="text-2xl font-semibold text-center mb-6">お問い合わせ</h2><p class="text-center mb-8">製品に関するご質問やご要望がございましたら、下記フォームよりお気軽にお問い合わせください。</p>',
      endpoint: "/api/contact",
    },
  ],
  customCSS: `/* カスタムCSSの例 */
/* ヘッダーのスタイルをカスタマイズ */
/*
header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

header a {
  color: #343a40;
}

header a:hover {
  color: #007bff;
  text-decoration: none;
}
*/`,
};

// ページデータ取得
export async function GET() {
  // レスポンスヘッダーを設定
  const headers = {
    "Cache-Control": "no-store, max-age=0",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // 環境変数設定状態確認済み

  try {
    // Supabaseが設定されていない場合はデフォルトデータを返す
    if (!isSupabaseConfigured) {
      return NextResponse.json(DEFAULT_PAGE_DATA, { headers });
    }

    // 1. ページ本体
    const { data: page, error: pageError } = await supabase
      .from("pages")
      .select("*")
      .eq("id", 1)
      .single();

    if (pageError || !page) {
      return NextResponse.json(DEFAULT_PAGE_DATA, { headers });
    }

    // 2. セクション一覧
    const { data: sections, error: secError } = await supabase
      .from("sections")
      .select("*")
      .eq("page_id", page.id)
      .order("position", { ascending: true });

    if (secError) {
      return NextResponse.json(DEFAULT_PAGE_DATA, { headers });
    }

    // 3. 各セクションの詳細をタイプごとに一括取得（N+1問題の解決）
    const typeGroups: Record<string, number[]> = {};
    sections.forEach((s) => {
      if (!typeGroups[s.type]) typeGroups[s.type] = [];
      typeGroups[s.type].push(s.id);
    });

    const detailPromises: Promise<any>[] = [];
    const types = Object.keys(typeGroups);

    // 各テーブルから一括取得するクエリを準備
    types.forEach((type) => {
      const ids = typeGroups[type];
      if (type === "mainVisual") {
        detailPromises.push(
          supabase.from("main_visual_sections").select("*").in("section_id", ids)
        );
      } else if (type === "imgText") {
        detailPromises.push(
          supabase.from("img_text_sections").select("*").in("section_id", ids)
        );
      } else if (type === "cards") {
        detailPromises.push(
          supabase
            .from("cards_sections")
            .select("*, cards(*)")
            .in("section_id", ids)
        );
      } else if (type === "form") {
        detailPromises.push(
          supabase.from("form_sections").select("*").in("section_id", ids)
        );
      } else if (type === "descList") {
        detailPromises.push(
          supabase.from("desc_list_sections").select("*").in("section_id", ids)
        );
      } else if (type === "group-start") {
        detailPromises.push(
          supabase.from("group_start_sections").select("*").in("section_id", ids)
        );
      } else if (type === "group-end") {
        detailPromises.push(
          supabase.from("group_end_sections").select("*").in("section_id", ids)
        );
      } else if (type === "htmlContent") {
        detailPromises.push(
          supabase.from("html_content_sections").select("*").in("section_id", ids)
        );
      }
    });

    // 全ての詳細を一括で取得
    const detailResults = await Promise.all(detailPromises);
    const detailMap = new Map();

    detailResults.forEach((res, idx) => {
      if (res.data) {
        res.data.forEach((item: any) => {
          detailMap.set(`${types[idx]}-${item.section_id}`, item);
        });
      }
    });

    // 4. 元の順番通りに組み立て
    const sectionResults = sections.map((section) => {
      const detail = detailMap.get(`${section.type}-${section.id}`);

      if (section.type === "mainVisual") {
        return {
          id: `section-${section.id}`,
          layout: "mainVisual",
          class: detail?.class ?? "",
          bgImage: detail?.bg_image ?? "",
          name: detail?.name ?? "",
          image: detail?.image ?? "",
          imageClass: detail?.image_class ?? "",
          textClass: detail?.text_class ?? "",
          html: detail?.html ?? "",
          imageAspectRatio: detail?.image_aspect_ratio ?? "auto",
          sectionWidth: detail?.section_width ?? "",
        };
      } else if (section.type === "imgText") {
        return {
          id: `section-${section.id}`,
          layout: "imgText",
          class: detail?.class ?? "",
          bgImage: detail?.bg_image ?? "",
          name: detail?.name ?? "",
          image: detail?.image ?? "",
          imageClass: detail?.image_class ?? "",
          textClass: detail?.text_class ?? "",
          html: detail?.html ?? "",
          imageAspectRatio: detail?.image_aspect_ratio ?? "auto",
          sectionWidth: detail?.section_width ?? "",
        };
      } else if (section.type === "cards") {
        return {
          id: `section-${section.id}`,
          layout: "cards",
          class: detail?.class ?? "",
          bgImage: detail?.bg_image ?? "",
          name: detail?.name ?? "",
          sectionWidth: detail?.section_width ?? "",
          cards: (detail?.cards ?? [])
            .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
            .map((c: any) => ({
              id: String(c.id),
              cardClass: c.card_class ?? "",
              image: c.image ?? "",
              imageClass: c.image_class ?? "",
              textClass: c.text_class ?? "",
              html: c.html ?? "",
              imageAspectRatio: c.image_aspect_ratio ?? "auto",
            })),
        };
      } else if (section.type === "form") {
        return {
          id: `section-${section.id}`,
          layout: "form",
          class: detail?.class ?? "",
          bgImage: detail?.bg_image ?? "",
          name: detail?.name ?? "",
          html: detail?.html ?? "",
          endpoint: detail?.endpoint ?? "",
          sectionWidth: detail?.section_width ?? "",
        };
      } else if (section.type === "descList") {
        return {
          id: `section-${section.id}`,
          layout: "descList",
          class: detail?.class ?? "",
          bgImage: detail?.bg_image ?? "",
          name: detail?.name ?? "",
          title: detail?.title ?? "",
          html: detail?.html ?? "",
          dtWidth: detail?.dt_width ?? "20%",
          sectionWidth: detail?.section_width ?? "",
        };
      } else if (section.type === "group-start") {
        return {
          id: `section-${section.id}`,
          layout: "group-start",
          class: detail?.class ?? "",
          bgImage: detail?.bg_image ?? "",
          name: detail?.name ?? "グループ",
          scopeStyles: detail?.scope_styles ?? "",
        };
      } else if (section.type === "group-end") {
        return {
          id: `section-${section.id}`,
          layout: "group-end",
          class: detail?.class ?? "",
          bgImage: detail?.bg_image ?? "",
        };
      } else if (section.type === "htmlContent") {
        return {
          id: `section-${section.id}`,
          layout: "htmlContent",
          class: detail?.class ?? "",
          bgImage: detail?.bg_image ?? "",
          name: detail?.name ?? "",
          html: detail?.html ?? "",
          sectionWidth: detail?.section_width ?? "",
          scopeStyles: detail?.scope_styles ?? "",
        };
      }
      return { id: `section-${section.id}`, layout: "unknown" };
    });

    // 5. 組み立てて返す
    return NextResponse.json(
      {
        header: { html: page.header_html },
        footer: { html: page.footer_html },
        customCSS: page.custom_css,
        tailwindTrigger: page.tailwind_trigger,
        sections: sectionResults,
        sectionsOrder: page.sections_order || null,
      },
      { headers }
    );
  } catch (error) {
    console.error("ページ取得エラー:", error);
    return NextResponse.json(
      { error: "ページデータの取得に失敗しました" },
      { status: 500, headers }
    );
  }
}

// ページデータ保存
export async function POST(req: NextRequest) {
  // 認証チェック
  if (!checkAuth()) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const startTime = Date.now(); // パフォーマンス測定開始

  try {
    const pageData = await req.json();

    // ページデータの検証
    if (
      !pageData ||
      !pageData.header ||
      !pageData.footer ||
      !Array.isArray(pageData.sections)
    ) {
      return NextResponse.json(
        { error: "無効なページデータです" },
        { status: 400 }
      );
    }

    // Supabaseがセットアップされていない場合はデータを保存せずに成功を返す
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return NextResponse.json({
        success: true,
        message: "Supabase未設定のため、データは保存されていません",
      });
    }

    // sectionsOrderを現在のセクション順序から再生成
    const currentSectionsOrder = pageData.sections.map((s) => s.id).join(",");

    // 1. ページ本体の保存（並列処理の準備）
    const { data: currentPage } = await supabase
      .from("pages")
      .select("tailwind_trigger")
      .eq("id", 1)
      .single();

    const pagePromise = supabase
      .from("pages")
      .upsert({
        id: 1,
        header_html: pageData.header.html,
        footer_html: pageData.footer.html,
        custom_css: pageData.customCSS,
        tailwind_trigger: pageData.tailwindTrigger,
        sections_order: currentSectionsOrder, // 再生成した順序を使用
      })
      .select()
      .single();

    // 2. 既存セクション取得（並列実行）
    const existingSectionsPromise = supabase
      .from("sections")
      .select("id, type, position")
      .eq("page_id", 1)
      .order("position");

    // 並列実行
    const [{ data: page, error: pageError }, { data: existingSections }] =
      await Promise.all([pagePromise, existingSectionsPromise]);

    if (pageError) {
      return NextResponse.json({ error: "ページ保存失敗" }, { status: 500 });
    }

    // Rare Classesの変更を検知してVercelデプロイフックを叩く
    if (currentPage && currentPage.tailwind_trigger !== pageData.tailwindTrigger) {
      // --- ローカル開発環境向け：ファイルを直接書き換えて即時反映させる ---
      try {
        const fs = require("fs");
        const path = require("path");
        const filePath = path.join(process.cwd(), "lib/tailwind-trigger.tsx");
        const content = `/**
 * Tailwind CSS Trigger (Generated)
 * 
 * このファイルは保存時またはビルド時に自動生成されます。
 */
const rareClasses = ${JSON.stringify(pageData.tailwindTrigger)};
export const tailwindTrigger = rareClasses;
`;
        fs.writeFileSync(filePath, content);
        console.log("✅ Local tailwind-trigger.tsx updated for instant refresh.");
      } catch (err) {
        // Vercel（読み取り専用）ではエラーになるが、ビルド時に反映されるため無視してOK
        console.log("Note: File system write skipped (expected on production).");
      }

      const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
      if (deployHookUrl) {
        console.log("🚀 Rare Classes changed. Triggering Vercel rebuild...");
        // 待機せずに実行（バックグラウンド的な扱い）
        fetch(deployHookUrl, { method: "POST" }).catch((err) => {
          console.error("Vercel Deploy Hook Error:", err);
        });
      }
    }

    // 3. 差分更新の実装 - IDベースで処理
    const existingMap = new Map(existingSections?.map((s) => [s.id, s]) || []);

    // 既存IDのセットを作成（競合チェック用）
    const existingIds = new Set(existingSections?.map((s) => s.id) || []);

    const newSections = pageData.sections.map((section, i) => {
      // セクションIDの処理
      let sectionId;
      try {
        if (section.id.startsWith("section-")) {
          const idPart = section.id.replace("section-", "");

          // 数値のみの場合は数値として、そうでなければハッシュ値を生成
          if (/^\d+$/.test(idPart)) {
            sectionId = parseInt(idPart, 10);
          } else {
            // 非数値IDの場合、ハッシュ値を生成（簡易版）
            let hashId = Math.abs(
              idPart.split("").reduce((a, b) => {
                a = (a << 5) - a + b.charCodeAt(0);
                return a & a;
              }, 0)
            );

            // ID競合を避けるため、既存IDと重複しない値を探す
            while (existingIds.has(hashId)) {
              hashId = hashId + 1;
            }
            sectionId = hashId;
            existingIds.add(hashId); // 新しいIDを追加
          }
        } else {
          sectionId = parseInt(section.id, 10);
        }
      } catch (error) {
        console.error("セクションID処理エラー:", error, section.id);
        throw error;
      }

      const result = {
        ...section,
        id: sectionId,
        originalId: section.id, // 元のIDも保持
        position: i,
        page_id: page.id,
      };

      return result;
    });

    // 削除対象、更新対象、新規追加対象を分類
    const toDelete = [];
    const toUpdate = [];
    const toInsert = [];

    // 新しいセクションIDのセット
    const newSectionIds = new Set(newSections.map((s) => s.id));

    // 既存セクションの処理 - 新しいセクションに含まれていないものは削除
    for (const [id] of existingMap) {
      if (!newSectionIds.has(id)) {
        toDelete.push(id);
      }
    }

    // 新しいセクションの処理 - IDベースで更新/挿入を判定
    for (const newSection of newSections) {
      if (existingMap.has(newSection.id)) {
        // 既存セクション - 更新対象（タイプが変わった場合は削除→挿入）
        if (existingMap.get(newSection.id)?.type !== newSection.layout) {
          toDelete.push(existingMap.get(newSection.id)!.id);
          toInsert.push(newSection);
        } else {
          toUpdate.push(newSection);
        }
      } else {
        // 新規セクション - 挿入対象
        toInsert.push(newSection);
      }
    }

    // 4. バルク削除処理（最適化）
    if (toDelete.length > 0) {
      const deletePromises = [];

      // 既存セクションの詳細データを取得してタイプ別に削除
      const { data: sectionsToDelete } = await supabase
        .from("sections")
        .select("id, type")
        .in("id", toDelete);

      if (sectionsToDelete) {
        const sectionsByType = sectionsToDelete.reduce(
          (acc, section) => {
            if (!acc[section.type]) acc[section.type] = [];
            acc[section.type].push(section.id);
            return acc;
          },
          {} as Record<string, number[]>
        );

        // タイプ別バルク削除
        for (const [type, ids] of Object.entries(sectionsByType)) {
          if (type === "mainVisual") {
            deletePromises.push(
              supabase
                .from("main_visual_sections")
                .delete()
                .in("section_id", ids)
            );
          } else if (type === "imgText") {
            deletePromises.push(
              supabase.from("img_text_sections").delete().in("section_id", ids)
            );
          } else if (type === "cards") {
            deletePromises.push(
              supabase.from("cards").delete().in("cards_section_id", ids),
              supabase.from("cards_sections").delete().in("section_id", ids)
            );
          } else if (type === "form") {
            deletePromises.push(
              supabase.from("form_sections").delete().in("section_id", ids)
            );
          } else if (type === "group-start") {
            deletePromises.push(
              supabase
                .from("group_start_sections")
                .delete()
                .in("section_id", ids)
            );
          } else if (type === "group-end") {
            deletePromises.push(
              supabase.from("group_end_sections").delete().in("section_id", ids)
            );
          }
        }

        // セクション本体の削除
        deletePromises.push(
          supabase.from("sections").delete().in("id", toDelete)
        );

        // 全削除を並列実行
        await Promise.all(deletePromises);
      }
    }

    // 5. バルク更新処理（UPSERT使用）
    if (toUpdate.length > 0) {
      // sectionsテーブルに存在するフィールドのみを指定
      const sectionsToUpdate = toUpdate.map((section) => ({
        id: section.id,
        page_id: page.id,
        type: section.layout,
        position: section.position,
        // nameフィールドは含めない（sectionsテーブルには存在しない）
      }));

      const { error: updateError } = await supabase
        .from("sections")
        .upsert(sectionsToUpdate);
      if (updateError) {
        console.error("セクション更新エラー:", updateError);
        console.error("更新データ:", sectionsToUpdate);
        return NextResponse.json(
          { error: `セクション更新失敗: ${updateError.message}` },
          { status: 500 }
        );
      }

      // 3. セクション詳細の更新をタイプごとに一括処理（N+1問題の解決）
      const updateGroups: Record<string, any[]> = {};
      toUpdate.forEach((s) => {
        if (!updateGroups[s.layout]) updateGroups[s.layout] = [];
        updateGroups[s.layout].push(s);
      });

      const updatePromises: Promise<any>[] = [];
      const detailErrors: any[] = [];

      for (const [layout, sections] of Object.entries(updateGroups)) {
        if (layout === "mainVisual") {
          updatePromises.push(
            supabase.from("main_visual_sections").upsert(
              sections.map((s) => ({
                section_id: s.id,
                class: s.class,
                bg_image: s.bgImage || null,
                name: s.name,
                html: s.html,
                image: s.image ?? null,
                image_class: s.imageClass ?? null,
                text_class: s.textClass ?? null,
                image_aspect_ratio: s.imageAspectRatio ?? "auto",
                section_width: s.sectionWidth ?? null,
              })),
              { onConflict: "section_id" }
            )
          );
        } else if (layout === "imgText") {
          updatePromises.push(
            supabase.from("img_text_sections").upsert(
              sections.map((s) => ({
                section_id: s.id,
                class: s.class,
                bg_image: s.bgImage || null,
                name: s.name,
                html: s.html,
                image: s.image ?? null,
                image_class: s.imageClass ?? null,
                text_class: s.textClass ?? null,
                image_aspect_ratio: s.imageAspectRatio ?? "auto",
                section_width: s.sectionWidth ?? null,
              })),
              { onConflict: "section_id" }
            )
          );
        } else if (layout === "cards") {
          // カードセクション本体の更新
          updatePromises.push(
            supabase.from("cards_sections").upsert(
              sections.map((s) => ({
                section_id: s.id,
                class: s.class,
                bg_image: s.bgImage || null,
                name: s.name,
                section_width: s.sectionWidth ?? null,
              })),
              { onConflict: "section_id" }
            )
          );

          // カード子要素の更新（既存を削除して再挿入）
          for (const s of sections) {
            updatePromises.push(
              supabase.from("cards").delete().eq("cards_section_id", s.id).then(async () => {
                if (s.cards && s.cards.length > 0) {
                  return supabase.from("cards").insert(
                    s.cards.map((card: any, j: number) => ({
                      cards_section_id: s.id,
                      card_class: card.cardClass ?? null,
                      image: card.image ?? null,
                      image_class: card.imageClass ?? null,
                      text_class: card.textClass ?? null,
                      html: card.html,
                      position: j,
                      image_aspect_ratio: card.imageAspectRatio ?? "auto",
                    }))
                  );
                }
              })
            );
          }
        } else if (layout === "form") {
          updatePromises.push(
            supabase.from("form_sections").upsert(
              sections.map((s) => ({
                section_id: s.id,
                class: s.class,
                bg_image: s.bgImage || null,
                name: s.name,
                html: s.html,
                endpoint: s.endpoint,
                section_width: s.sectionWidth ?? null,
              })),
              { onConflict: "section_id" }
            )
          );
        } else if (layout === "descList") {
          updatePromises.push(
            supabase.from("desc_list_sections").upsert(
              sections.map((s) => ({
                section_id: s.id,
                class: s.class,
                bg_image: s.bgImage || null,
                name: s.name,
                title: s.title,
                html: s.html,
                dt_width: s.dtWidth ?? "20%",
                section_width: s.sectionWidth ?? null,
              })),
              { onConflict: "section_id" }
            )
          );
        } else if (layout === "group-start") {
          updatePromises.push(
            supabase.from("group_start_sections").upsert(
              sections.map((s) => ({
                section_id: s.id,
                class: s.class,
                bg_image: s.bgImage || null,
                name: s.name,
                scope_styles: s.scopeStyles,
                section_width: s.sectionWidth ?? null,
              })),
              { onConflict: "section_id" }
            )
          );
        } else if (layout === "group-end") {
          updatePromises.push(
            supabase.from("group_end_sections").upsert(
              sections.map((s) => ({
                section_id: s.id,
                class: s.class,
                bg_image: s.bgImage || null,
                section_width: s.sectionWidth ?? null,
              })),
              { onConflict: "section_id" }
            )
          );
        } else if (layout === "htmlContent") {
          updatePromises.push(
            supabase.from("html_content_sections").upsert(
              sections.map((s) => ({
                section_id: s.id,
                class: s.class,
                bg_image: s.bgImage || null,
                name: s.name,
                html: s.html,
                section_width: s.sectionWidth ?? null,
                scope_styles: s.scopeStyles ?? null,
              })),
              { onConflict: "section_id" }
            )
          );
        }
      }

      const updateResults = await Promise.all(updatePromises);
      updateResults.forEach((r, idx) => {
        if (r?.error) detailErrors.push(r.error);
      });

      if (detailErrors.length > 0) {
        console.error("セクション詳細更新エラー:", detailErrors);
      }
    }

    // 6. バルク挿入処理（最適化）
    if (toInsert.length > 0) {
      // セクション本体を一括挿入（IDを明示的に指定）
      const sectionsToInsert = toInsert.map((section) => ({
        id: section.id, // フロントエンドから送信されたIDを使用
        page_id: page.id,
        type: section.layout, // layoutをtypeとして保存
        position: section.position,
      }));

      const { error: secError } = await supabase
        .from("sections")
        .insert(sectionsToInsert)
        .select();

      if (secError) {
        console.error("セクション挿入エラー:", secError);
        return NextResponse.json(
          { error: `セクション保存失敗: ${secError.message}` },
          { status: 500 }
        );
      }

      // セクション詳細の並列挿入をタイプごとに一括処理（N+1問題の解決）
      const insertGroups: Record<string, any[]> = {};
      toInsert.forEach((s) => {
        if (!insertGroups[s.layout]) insertGroups[s.layout] = [];
        insertGroups[s.layout].push(s);
      });

      const insertDetailPromises = [];
      const cardsBulkInsert = [];

      for (const [layout, sections] of Object.entries(insertGroups)) {
        if (layout === "mainVisual") {
          insertDetailPromises.push(
            supabase.from("main_visual_sections").insert(
              sections.map((s) => ({
                section_id: s.id,
                class: s.class,
                bg_image: s.bgImage || null,
                name: s.name,
                html: s.html,
                image: s.image ?? null,
                image_class: s.imageClass ?? null,
                text_class: s.textClass ?? null,
                image_aspect_ratio: s.imageAspectRatio ?? "auto",
                section_width: s.sectionWidth ?? null,
              }))
            )
          );
        } else if (layout === "imgText") {
          insertDetailPromises.push(
            supabase.from("img_text_sections").insert(
              sections.map((s) => ({
                section_id: s.id,
                class: s.class,
                bg_image: s.bgImage || null,
                name: s.name,
                html: s.html,
                image: s.image ?? null,
                image_class: s.imageClass ?? null,
                text_class: s.textClass ?? null,
                image_aspect_ratio: s.imageAspectRatio ?? "auto",
                section_width: s.sectionWidth ?? null,
              }))
            )
          );
        } else if (layout === "cards") {
          insertDetailPromises.push(
            supabase.from("cards_sections").insert(
              sections.map((s) => ({
                section_id: s.id,
                class: s.class,
                bg_image: s.bgImage || null,
                name: s.name,
                section_width: s.sectionWidth ?? null,
              }))
            )
          );

          for (const s of sections) {
            if (s.cards && s.cards.length > 0) {
              const cardsToInsert = s.cards.map((card: any, j: number) => ({
                cards_section_id: s.id,
                card_class: card.cardClass ?? null,
                image: card.image ?? null,
                image_class: card.imageClass ?? null,
                text_class: card.textClass ?? null,
                html: card.html,
                position: j,
                image_aspect_ratio: card.imageAspectRatio ?? "auto",
              }));
              cardsBulkInsert.push(...cardsToInsert);
            }
          }
        } else if (layout === "form") {
          insertDetailPromises.push(
            supabase.from("form_sections").insert(
              sections.map((s) => ({
                section_id: s.id,
                class: s.class,
                bg_image: s.bgImage || null,
                name: s.name,
                html: s.html,
                endpoint: s.endpoint,
                section_width: s.sectionWidth ?? null,
              }))
            )
          );
        } else if (layout === "descList") {
          insertDetailPromises.push(
            supabase.from("desc_list_sections").insert(
              sections.map((s) => ({
                section_id: s.id,
                class: s.class,
                bg_image: s.bgImage || null,
                name: s.name,
                title: s.title,
                html: s.html,
                dt_width: s.dtWidth ?? "20%",
                section_width: s.sectionWidth ?? null,
              }))
            )
          );
        } else if (layout === "group-start") {
          insertDetailPromises.push(
            supabase.from("group_start_sections").insert(
              sections.map((s) => ({
                section_id: s.id,
                class: s.class,
                bg_image: s.bgImage || null,
                name: s.name,
                scope_styles: s.scopeStyles,
                section_width: s.sectionWidth ?? null,
              }))
            )
          );
        } else if (layout === "group-end") {
          insertDetailPromises.push(
            supabase.from("group_end_sections").insert(
              sections.map((s) => ({
                section_id: s.id,
                class: s.class,
                bg_image: s.bgImage || null,
                section_width: s.sectionWidth ?? null,
              }))
            )
          );
        } else if (layout === "htmlContent") {
          insertDetailPromises.push(
            supabase.from("html_content_sections").insert(
              sections.map((s) => ({
                section_id: s.id,
                class: s.class,
                bg_image: s.bgImage || null,
                name: s.name,
                html: s.html,
                section_width: s.sectionWidth ?? null,
                scope_styles: s.scopeStyles ?? null,
              }))
            )
          );
        }
      }

      // 1. まず各セクションの詳細（cards以外）を一括挿入
      const insertResults = await Promise.all(insertDetailPromises);
      const insertErrors = insertResults.filter((r) => r.error);
      if (insertErrors.length > 0) {
        console.error("セクション詳細挿入エラー:", insertErrors);
      }

      // 2. 次にカード本体を挿入（cards_sectionsへの外部キー制約がある場合を考慮）
      if (cardsBulkInsert.length > 0) {
        const { error: cardsError } = await supabase
          .from("cards")
          .insert(cardsBulkInsert);
        if (cardsError) {
          console.error("カード挿入エラー:", cardsError);
        }
      }
    }

    // 7. 全セクションの位置を強制更新（順番を確実に保存）
    if (newSections.length > 0) {
      console.log(
        "🔍 POSITION UPDATE:",
        newSections.map((s) => ({
          id: s.id,
          layout: s.layout,
          position: s.position,
          originalId: s.originalId,
        }))
      );

      // 各セクションの位置を個別に更新（UPSERTではなくUPDATE使用）
      const positionUpdatePromises = newSections.map((section) =>
        supabase
          .from("sections")
          .update({ position: section.position })
          .eq("id", section.id)
      );

      const positionResults = await Promise.all(positionUpdatePromises);

      // エラーチェック
      const positionErrors = positionResults.filter((result) => result.error);
      if (positionErrors.length > 0) {
        console.error("位置更新エラー:", positionErrors);
      } else {
        console.log(
          "✅ POSITION UPDATE SUCCESS:",
          positionResults.length,
          "sections"
        );
      }
    }

    // 最終セクション順序をDBの数値IDベースで再保存（クライアントIDとの不整合防止）
    if (newSections.length > 0) {
      const finalOrder = newSections.map((s) => `section-${s.id}`).join(",");
      await supabase
        .from("pages")
        .update({ sections_order: finalOrder })
        .eq("id", 1);
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(
      `保存処理完了: ${duration}ms (削除: ${toDelete.length}, 更新: ${toUpdate.length}, 挿入: ${toInsert.length})`
    );

    return NextResponse.json({
      success: true,
      performance: {
        duration: `${duration}ms`,
        sections: pageData.sections.length,
        operations: {
          deleted: toDelete.length,
          updated: toUpdate.length,
          inserted: toInsert.length,
        },
      },
    });
  } catch (error) {
    console.error("保存エラー:", error);
    return NextResponse.json(
      { error: "保存処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
 
 