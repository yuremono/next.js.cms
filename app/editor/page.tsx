"use client";

import { useState, useEffect, useCallback } from "react";
import "../globals.css"; // Tailwind CSSを確実に読み込み
import "../top.scss";
import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Footer, Header, Page, Section, UserRole } from "@/types";
import { HeaderEditor } from "@/components/sections/HeaderEditor";
import { FooterEditor } from "@/components/sections/FooterEditor";
// import SortableSections from "@/components/SortableSections";
import IDEStyleSectionList from "@/components/IDEStyleSectionList";
import { SectionSelector } from "@/components/SectionSelector";
import { SectionEditorRenderer } from "@/components/editor/SectionEditorRenderer";

import {
  sectionsToOrderString,
  sortSectionsByOrderString,
  moveSectionInOrderString,
  addSectionToOrderString,
  removeSectionFromOrderString,
} from "@/lib/section-order-utils";
import {
  Save,
  Plus,
  Eye,
  ExternalLink,
  Hand,
  Sun,
  Moon,
  LogOut,
  SplitSquareHorizontal,
  Monitor,
  Tablet,
  Smartphone,
  GripVertical,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { TextGenerator } from "@/components/sections/TextGenerator";
import { ImageGallery } from "@/components/images/ImageGallery";
import { CSSEditor } from "@/components/editor/CSSEditor";
import { DatabaseBackup } from "@/components/backup/DatabaseBackup";
import { PasswordAuth } from "@/components/auth/PasswordAuth";
import { AccessibilityPanel } from "@/components/AccessibilityPanel";

// デフォルトのセクションを作成する関数
const createDefaultSection = (type: string): Section => {
  // 一意のIDを生成
  const id = `section-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  switch (type) {
    case "mainVisual":
      return {
        id,
        layout: "mainVisual",
        class: "MainVisual",
        html: "<h1>メインタイトル</h1><p>サブタイトル：ここにテキストを入力</p>",
        image: "",
        imageAspectRatio: "auto",
      };
    case "imgText":
      return {
        id,
        layout: "imgText",
        class: "ImgText",
        html: "<h2>セクションタイトル</h2><p>ここにテキストを入力します。</p>",
        image: "",
        imageAspectRatio: "auto",
      };
    case "cards":
      return {
        id,
        layout: "cards",
        class: "Cards",
        cards: [
          {
            id: `card-${Date.now()}-1`,
            html: "<h3>カード1</h3><p>カード1の内容</p>",
            image: "",
          },
        ],
      };
    case "form":
      return {
        id,
        layout: "form",
        class: "Form",
        html: "<h2>お問い合わせ</h2><p>以下のフォームよりお問い合わせください。</p>",
        endpoint: "/api/contact",
      };
    case "descList":
      return {
        id,
        layout: "descList",
        class: "DescList",
        name: "DLリスト",
        title: "リストタイトル",
        dtWidth: "20%",
        html: '<dl style="--dtWidth: 20%">\n<dt>項目1</dt>\n<dd>説明1</dd>\n<dt>項目2</dt>\n<dd>説明2</dd>\n<dt>項目3</dt>\n<dd>説明3</dd>\n</dl>',
      };
    case "htmlContent":
      return {
        id,
        layout: "htmlContent",
        class: "HtmlContent",
        name: "HTMLコンテンツ",
        html: "<h2>見出し</h2><p>ここにHTMLコンテンツを入力します。</p>",
        textClass: "",
        sectionWidth: "",
        scopeStyles: "",
      } as any;
    case "group-start":
      return {
        id,
        layout: "group-start",
        class: "GroupStart",
        name: "新しいグループ",
      };
    case "group-end":
      return {
        id,
        layout: "group-end",
        class: "GroupEnd",
      };
    default:
      throw new Error(`未対応のセクションタイプ: ${type}`);
  }
};

export default function EditorPage() {
  // 認証状態
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Split-screen モード状態
  const [splitScreenMode, setSplitScreenMode] = useState(false);

  // iframe参照とプレビュー更新
  const [iframeRef, setIframeRef] = useState<HTMLIFrameElement | null>(null);

  // リサイザー用の状態
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // パーセンテージ
  const [isResizing, setIsResizing] = useState(false);

  // プリセット用の状態
  const [previewWidthRatio, setPreviewWidthRatio] = useState<100 | 70 | 40>(
    100
  ); // パネル幅に対する割合
  const [rightPanelRef, setRightPanelRef] = useState<HTMLDivElement | null>(
    null
  );

  // プリセット設定
  const widthPresets = {
    100: { ratio: 100, label: "フル幅", icon: Monitor },
    70: { ratio: 70, label: "タブレット相当", icon: Tablet },
    40: { ratio: 40, label: "モバイル相当", icon: Smartphone },
  };

  // ページデータの状態
  const [page, setPage] = useState<Page>({
    header: {
      html: `<div class="bg-white shadow-sm">
  <div class=" mx-auto px-4 py-4 flex justify-between items-center">
    <div class="logo">
      <a href="/" class="text-lg font-bold">サイト名</a>
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
        <h3 class="text-base font-semibold mb-4">会社名</h3>
        <p>〒123-4567<br />東京都○○区△△ 1-2-3</p>
        <p>TEL: 03-1234-5678</p>
      </div>
      <div>
        <h3 class="text-base font-semibold mb-4">リンク</h3>
        <ul class="space-y-2">
          <li><a href="#" class="hover:underline">ホーム</a></li>
          <li><a href="#" class="hover:underline">会社概要</a></li>
          <li><a href="#" class="hover:underline">サービス</a></li>
          <li><a href="#" class="hover:text-primary">お問い合わせ</a></li>
        </ul>
      </div>
      <div>
        <h3 class="text-base font-semibold mb-4">SNS</h3>
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
    sections: [],
    customCSS: "",
    sectionsOrder: "",
  });

  // 選択中のセクションインデックス
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(
    null
  );
  const [theme, setTheme] = useState<"light" | "dark">(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // 選択中のメニュータブ
  const [activeMenuTab, setActiveMenuTab] = useState<string>("header");

  // セクション追加ダイアログの状態
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // プレビューモードの状態
  const [previewMode, setPreviewMode] = useState(false);

  // ロード中の状態
  const [isLoading, setIsLoading] = useState(true);

  // データの保存中状態
  const [isSaving, setIsSaving] = useState(false);

  // 追加: レスポンシブ用state
  const [sectionListOpen, setSectionListOpen] = useState(false);

  // IDE風UI切り替え状態（未使用）

  // プレビューにデータを送信する関数
  const sendDataToPreview = useCallback(() => {
    if (iframeRef && iframeRef.contentWindow) {
      iframeRef.contentWindow.postMessage(
        {
          type: "UPDATE_PAGE_DATA",
          data: page,
        },
        window.location.origin
      );
    }
  }, [iframeRef, page]);

  // pageが変更されたときにプレビューを更新（通常プレビュー・分割プレビュー共通）
  useEffect(() => {
    if ((splitScreenMode || previewMode) && iframeRef) {
      const timer = setTimeout(sendDataToPreview, 100);
      return () => clearTimeout(timer);
    }
  }, [page, splitScreenMode, previewMode, iframeRef, sendDataToPreview]);

  // プレビューからのメッセージを受信
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "PREVIEW_READY") {
        // プレビューが準備完了したら初期データを送信
        setTimeout(sendDataToPreview, 100);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [sendDataToPreview]);

  // リサイザー機能の改良版
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      e.preventDefault();
      e.stopPropagation();

      const containerWidth = window.innerWidth;
      const newLeftWidth = (e.clientX / containerWidth) * 100;

      // 最小25%、最大75%に制限（より安全な範囲）
      const clampedWidth = Math.max(25, Math.min(75, newLeftWidth));
      setLeftPanelWidth(clampedWidth);
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(false);
    };

    // キーボードでのエスケープ対応
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isResizing) {
        setIsResizing(false);
      }
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove, {
        passive: false,
      });
      document.addEventListener("mouseup", handleMouseUp, { passive: false });
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.body.style.pointerEvents = "none";

      // リサイザー自体だけイベントを受け取る
      const resizer = document.querySelector(
        '[data-resizer="true"]'
      ) as HTMLElement;
      if (resizer) {
        resizer.style.pointerEvents = "auto";
      }
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.body.style.pointerEvents = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.body.style.pointerEvents = "";
    };
  }, [isResizing]);

  // 認証チェック
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 開発時の認証スキップチェック
        if (
          process.env.NODE_ENV === "development" &&
          process.env.NEXT_PUBLIC_REQUIRE_AUTH !== "true"
        ) {
          console.log("🔓 認証をスキップしています (開発モード)");
          setIsAuthenticated(true);
          setAuthChecked(true);
          return;
        }

        // 明示的な認証スキップ設定
        if (
          process.env.NEXT_PUBLIC_SKIP_AUTH === "true" ||
          process.env.SKIP_AUTH === "true"
        ) {
          console.log("🔓 認証をスキップしています (環境変数設定)");
          setIsAuthenticated(true);
          setAuthChecked(true);
          return;
        }

        console.log("🔐 認証チェックを開始...");

        // タイムアウト付きのfetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒タイムアウト

        const response = await fetch("/api/auth/check", {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const { authenticated, role } = await response.json();
          console.log("✅ 認証チェック完了:", authenticated, "権限:", role);
          setIsAuthenticated(authenticated);
          setUserRole(role);
        } else {
          console.warn("⚠️ 認証API応答エラー:", response.status);
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error("❌ 認証チェックエラー:", error);

        // タイムアウトエラーの場合は認証をスキップ
        if (error.name === "AbortError") {
          console.warn(
            "⏰ 認証チェックがタイムアウトしました。認証をスキップします。"
          );
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } finally {
        console.log("🏁 認証チェック処理完了");
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  // 初期データの読み込み
  useEffect(() => {
    if (!isAuthenticated || !authChecked) return;

    const fetchData = async () => {
      try {
        // 復元されたデータがあるか確認
        const restoredData = localStorage.getItem("restoredPageData");

        if (restoredData) {
          // 復元データがある場合はそれを使用
          try {
            const parsedData = JSON.parse(restoredData);

            // 既存のセクションにIDがなければ追加
            if (parsedData.sections && Array.isArray(parsedData.sections)) {
              parsedData.sections = parsedData.sections.map(
                (section: Section) => {
                  if (!section.id) {
                    return {
                      ...section,
                      id: `section-${Date.now()}-${Math.random()
                        .toString(36)
                        .substring(2, 9)}`,
                    };
                  }
                  return section;
                }
              );
            }

            setPage(parsedData);
            // セクションが存在する場合は一番上を選択
            if (parsedData.sections && parsedData.sections.length > 0) {
              setActiveSectionIndex(0);
              setActiveMenuTab("edit");
            }
            localStorage.removeItem("restoredPageData"); // 使用後は削除
            toast.success("バックアップから復元されたデータを読み込みました");
          } catch (error) {
            console.error("復元データの解析に失敗しました", error);
            toast.error("復元データの読み込みに失敗しました");
            // APIからデータを取得する
            await fetchFromAPI();
          }
        } else {
          // 復元データがない場合はAPIからデータを取得
          await fetchFromAPI();
        }
      } catch (error) {
        console.error("ページデータの取得に失敗しました", error);
      } finally {
        setIsLoading(false);
      }
    };

    // APIからデータを取得する関数
    const fetchFromAPI = async () => {
      const response = await fetch("/api/page");
      if (response.ok) {
        const data = await response.json();

        // 既存のセクションにIDがなければ追加
        if (data.sections && Array.isArray(data.sections)) {
          data.sections = data.sections.map((section: Section) => {
            if (!section.id) {
              return {
                ...section,
                id: `section-${Date.now()}-${Math.random()
                  .toString(36)
                  .substring(2, 9)}`,
              };
            }
            return section;
          });
        }

        // sectionsOrderがある場合は、その順序でセクションをソート
        if (data.sectionsOrder && data.sections) {
          data.sections = sortSectionsByOrderString(
            data.sections,
            data.sectionsOrder
          );
        } else if (data.sections) {
          // sectionsOrderがない場合は現在の順序から生成
          data.sectionsOrder = sectionsToOrderString(data.sections);
        }

        setPage(data);
        // セクションが存在する場合は一番上を選択
        if (data.sections && data.sections.length > 0) {
          setActiveSectionIndex(0);
          setActiveMenuTab("edit");
        }
      } else {
        throw new Error("APIからのデータ取得に失敗しました");
      }
    };

    fetchData();
  }, [isAuthenticated, authChecked]);

  // ヘッダーの更新
  const updateHeader = (header: Header) => {
    setPage((prev) => ({ ...prev, header }));
  };

  // フッターの更新
  const updateFooter = (footer: Footer) => {
    setPage((prev) => ({ ...prev, footer }));
  };

  // カスタムCSSの更新
  const updateCustomCSS = (customCSS: string) => {
    setPage((prev) => ({ ...prev, customCSS }));
  };

  // セクションの更新
  const updateSection = (index: number, section: Section) => {
    setPage((prev) => {
      const newSections = [...prev.sections];
      newSections[index] = section;
      return { ...prev, sections: newSections };
    });
  };

  // セクションの選択
  const handleSectionClick = (index: number) => {
    setActiveSectionIndex(index);
    setActiveMenuTab("edit");
  };

  // グループの展開・折りたたみ（未使用）

  // セクションの並び替え
  const moveSection = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex < 0 ||
      fromIndex >= page.sections.length ||
      toIndex < 0 ||
      toIndex >= page.sections.length
    ) {
      return;
    }

    setPage((prev) => {
      const newSections = [...prev.sections];
      const [movedSection] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, movedSection);

      // sectionsOrder文字列も更新
      const currentOrder =
        prev.sectionsOrder || sectionsToOrderString(prev.sections);
      const newOrder = moveSectionInOrderString(
        currentOrder,
        fromIndex,
        toIndex
      );

      return {
        ...prev,
        sections: newSections,
        sectionsOrder: newOrder,
      };
    });

    if (activeSectionIndex === fromIndex) {
      setActiveSectionIndex(toIndex);
    } else if (
      activeSectionIndex !== null &&
      ((fromIndex < activeSectionIndex && toIndex >= activeSectionIndex) ||
        (fromIndex > activeSectionIndex && toIndex <= activeSectionIndex))
    ) {
      setActiveSectionIndex(
        fromIndex < activeSectionIndex
          ? activeSectionIndex - 1
          : activeSectionIndex + 1
      );
    }
  };

  // セクションの削除
  const deleteSection = (index: number) => {
    setPage((prev) => {
      const sectionToDelete = prev.sections[index];
      let newSections = [...prev.sections];
      const currentOrder =
        prev.sectionsOrder || sectionsToOrderString(prev.sections);
      let newOrder = currentOrder;

      // グループ開始タグの場合は、対応する終了タグも同時削除
      if (sectionToDelete.layout === "group-start") {
        // 対応する終了タグを探す
        let groupEndIndex = -1;
        for (let i = index + 1; i < newSections.length; i++) {
          if (newSections[i].layout === "group-end") {
            groupEndIndex = i;
            break;
          }
        }

        if (groupEndIndex !== -1) {
          // 終了タグのIDも順序文字列から削除
          newOrder = removeSectionFromOrderString(
            newOrder,
            newSections[groupEndIndex].id
          );
          // 終了タグから削除（インデックスがずれないように後ろから）
          newSections = newSections.filter((_, i) => i !== groupEndIndex);
        }
      }

      // 対象のセクションのIDを順序文字列から削除
      newOrder = removeSectionFromOrderString(newOrder, sectionToDelete.id);
      // 対象のセクションを削除
      newSections = newSections.filter((_, i) => i !== index);

      return {
        ...prev,
        sections: newSections,
        sectionsOrder: newOrder,
      };
    });

    if (activeSectionIndex === index) {
      setActiveSectionIndex(null);
    } else if (activeSectionIndex !== null && index < activeSectionIndex) {
      setActiveSectionIndex(activeSectionIndex - 1);
    }
  };

  // セクションの追加
  const addSection = (type: string) => {
    try {
      if (type === "group") {
        // グループの場合は開始タグと終了タグを連続で追加
        const groupStartSection = createDefaultSection("group-start");
        const groupEndSection = createDefaultSection("group-end");

        setPage((prev) => {
          const newSections = [...prev.sections];

          // 選択中のセクションがある場合はその下に、ない場合は最後に追加
          const insertIndex =
            activeSectionIndex !== null
              ? activeSectionIndex + 1
              : newSections.length;

          // 開始タグと終了タグを連続で挿入
          newSections.splice(
            insertIndex,
            0,
            groupStartSection,
            groupEndSection
          );

          // sectionsOrder文字列も更新
          const currentOrder =
            prev.sectionsOrder || sectionsToOrderString(prev.sections);
          let newOrder = addSectionToOrderString(
            currentOrder,
            groupStartSection.id,
            insertIndex - 1
          );
          newOrder = addSectionToOrderString(
            newOrder,
            groupEndSection.id,
            insertIndex
          );

          return {
            ...prev,
            sections: newSections,
            sectionsOrder: newOrder,
          };
        });

        // 開始タグを選択
        const newIndex =
          activeSectionIndex !== null
            ? activeSectionIndex + 1
            : page.sections.length;

        setActiveSectionIndex(newIndex);
        setActiveMenuTab("edit");
        setIsSelectorOpen(false);
      } else {
        // 通常のセクション追加
        const newSection = createDefaultSection(type);

        setPage((prev) => {
          const newSections = [...prev.sections];

          // 選択中のセクションがある場合はその下に、ない場合は最後に追加
          const insertIndex =
            activeSectionIndex !== null
              ? activeSectionIndex + 1
              : newSections.length;

          newSections.splice(insertIndex, 0, newSection);

          // sectionsOrder文字列も更新
          const currentOrder =
            prev.sectionsOrder || sectionsToOrderString(prev.sections);
          const newOrder = addSectionToOrderString(
            currentOrder,
            newSection.id,
            insertIndex - 1
          );

          return {
            ...prev,
            sections: newSections,
            sectionsOrder: newOrder,
          };
        });

        // 新しく追加したセクションを選択
        const newIndex =
          activeSectionIndex !== null
            ? activeSectionIndex + 1
            : page.sections.length;

        setActiveSectionIndex(newIndex);
        setActiveMenuTab("edit");
        setIsSelectorOpen(false);
      }
    } catch (error) {
      console.error("セクションの追加に失敗しました", error);
    }
  };

  // 選択中セクションを複製して直後に挿入
  const duplicateSelectedSection = () => {
    if (activeSectionIndex === null) {
      toast.warning("複製するセクションを選択してください");
      return;
    }
    const target = page.sections[activeSectionIndex];
    if (!target) {
      toast.warning("複製対象のセクションが見つかりません");
      return;
    }
    if (target.layout === "group-start" || target.layout === "group-end") {
      toast.warning("グループ開始/終了タグは複製できません");
      return;
    }

    const newSectionId = `section-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    // 深いコピーで新IDを付与
    const cloned = JSON.parse(JSON.stringify(target)) as Section;
    cloned.id = newSectionId;

    setPage((prev) => {
      const newSections = [...prev.sections];
      const insertIndex = activeSectionIndex + 1;
      newSections.splice(insertIndex, 0, cloned);

      const currentOrder =
        prev.sectionsOrder || sectionsToOrderString(prev.sections);
      const newOrder = addSectionToOrderString(
        currentOrder,
        cloned.id,
        insertIndex - 1
      );

      return { ...prev, sections: newSections, sectionsOrder: newOrder };
    });

    // 複製した要素を選択
    setActiveSectionIndex((idx) => (idx === null ? null : idx + 1));
    setActiveMenuTab("edit");
  };

  // ページデータの保存
  // グループの整合性をチェックする関数
  const validateGroups = (sections: Section[]): boolean => {
    let groupStack = 0;

    for (const section of sections) {
      if (section.layout === "group-start") {
        groupStack++;
      } else if (section.layout === "group-end") {
        groupStack--;
        if (groupStack < 0) {
          return false; // 閉じタグが開始タグより多い
        }
      }
    }

    return groupStack === 0; // 全てのグループが正しく閉じられている
  };

  const savePage = async () => {
    // 権限チェック
    if (userRole === "view") {
      toast.error("保存権限がありません", {
        description: "このアカウントは閲覧専用のため、入力内容を保存できません",
        duration: 5000,
      });
      return; // 保存をキャンセル
    }

    // グループの整合性をチェック
    if (!validateGroups(page.sections)) {
      toast.error("グループの閉じタグがありません。順番を見直してください", {
        style: {
          background: "#ef4444", // 赤色背景
          color: "#ffffff",
        },
        duration: 5000,
      });
      return; // 保存をキャンセル
    }

    setIsSaving(true);
    const startTime = Date.now();

    // プログレス付きトーストを表示
    const toastId = toast.loading("保存中...", {
      description: "データベースに保存しています",
      duration: Infinity, // 手動で閉じるまで表示
    });

    try {
      const response = await fetch("/api/page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(page),
      });

      if (!response.ok) {
        throw new Error("保存に失敗しました");
      }

      const result = await response.json();
      const clientDuration = Date.now() - startTime;

      // 成功トーストに更新
      toast.success("保存完了！", {
        id: toastId,
        description: result.performance
          ? `処理時間: ${clientDuration}ms (サーバー: ${result.performance.duration}) | 操作: 削除${result.performance.operations?.deleted || 0}件, 更新${result.performance.operations?.updated || 0}件, 追加${result.performance.operations?.inserted || 0}件`
          : `処理時間: ${clientDuration}ms`,
        duration: 4000,
      });
    } catch (error) {
      console.error("保存エラー:", error);

      // エラーレスポンスの詳細を確認
      let errorMessage = "保存に失敗しました";
      let errorDescription = "不明なエラーが発生しました";

      if (error instanceof Error && error.message.includes("403")) {
        errorMessage = "保存権限がありません";
        errorDescription =
          "このアカウントは閲覧専用のため、入力内容を保存できません";
      } else if (error instanceof Error) {
        errorDescription = error.message;
      }

      toast.error(errorMessage, {
        id: toastId,
        description: errorDescription,
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ログアウト
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      toast.success("ログアウトしました");
    } catch (error) {
      console.error("ログアウトエラー:", error);
      toast.error("ログアウトに失敗しました");
    }
  };

  // タイプに応じた編集コンポーネントを表示
  const renderEditor = () => {
    switch (activeMenuTab) {
      case "header":
        return <HeaderEditor header={page.header} onUpdate={updateHeader} />;
      case "footer":
        return <FooterEditor footer={page.footer} onUpdate={updateFooter} />;
      case "css-editor":
        return (
          <CSSEditor
            initialCSS={page.customCSS || ""}
            onUpdate={updateCustomCSS}
          />
        );
      case "backup":
        return <DatabaseBackup />;
      case "dev-notes":
        return (
          <div className="h-full space-y-6 ">
            <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm ">
              <h3 className="mb-4">開発メモ</h3>
              <div className="space-y-4">
                <h3>
                  DLリストコンテンツのモード切り替え
                  <span className="ml-2 inline-block rounded-full bg-muted px-2 py-1  font-medium">
                    検討中
                  </span>
                </h3>
                <p className="mt-1 ">
                  (dl → details(FAQ) / ol(Timeline) / table(比較表)
                  の切り替え機能)
                </p>
              </div>
              <div className="space-y-4">
                <h3>
                  テーブルコンテンツの実装について
                  <span className="ml-2 inline-block rounded-full bg-muted px-2 py-1  font-medium">
                    結論
                  </span>
                </h3>
                <p className="mt-1 ">
                  ユーザビリティの観点からCMS環境で制限のあるテーブル編集に慣れてもらうよりも外部サービス（Google
                  Sheets、Notion、Airtable等）を活用し、iframeで埋め込む方が建設的。既存の高機能で再利用可能なツールを選ぶことがより良いユーザー体験になる。
                  セキュリティの観点から、iframe埋め込み専用のUI導入は実装予定
                </p>

                <details className="mt-4">
                  <summary className="cursor-pointer  font-medium">
                    Perplexityの具体的な実装提案
                  </summary>
                  <div className="mt-2 space-y-4 pl-4">
                    <details>
                      <summary className="cursor-pointer  font-medium">
                        Notionを使用した価格表作成手順
                      </summary>
                      <div className="mt-2 space-y-2 pl-4">
                        <div>
                          <h4 className=" font-medium">テーブルビューの作成</h4>
                          <ul className="mt-1 list-inside list-disc space-y-1 ">
                            <li>
                              Databaseから「Table
                              view」を選択し、新規ビューを作成
                            </li>
                            <li>項目名、価格、説明などの列を設定</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className=" font-medium">Formula機能の活用</h4>
                          <ul className="mt-1 list-inside list-disc space-y-1 ">
                            <li>
                              価格計算が必要な場合、Formula機能を使用して自動計算を実装
                            </li>
                            <li>
                              チェックボックスと組み合わせることで、必要な項目のみの価格表示も可能
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className=" font-medium">デザインの最適化</h4>
                          <ul className="mt-1 list-inside list-disc space-y-1 ">
                            <li>不要な列（dummyなど）は非表示に設定</li>
                            <li>
                              テーブルの見栄えを整えるため、適切な列幅と行高を設定
                            </li>
                          </ul>
                        </div>
                      </div>
                    </details>

                    <details>
                      <summary className="cursor-pointer  font-medium">
                        iframe埋め込み時の注意点
                      </summary>
                      <div className="mt-2 space-y-2 pl-4">
                        <div>
                          <h4 className=" font-medium">セキュリティ対策</h4>
                          <p className="mt-1 ">
                            iframe埋め込みでは、sandbox属性の設定、X-Frame-Optionsヘッダーの適用、HTTPS通信の強制などのセキュリティ対策が必要です。
                          </p>
                        </div>

                        <div>
                          <h4 className=" font-medium">レスポンシブデザイン</h4>
                          <p className="mt-1 ">
                            widthやheightパラメータを調整し、ホームページのデザインに合わせたサイズ設定を行うことで、違和感のない埋め込みが実現できます。
                          </p>
                        </div>
                      </div>
                    </details>

                    <details>
                      <summary className="cursor-pointer  font-medium">
                        料金面での比較
                      </summary>
                      <div className="mt-2 space-y-2 pl-4">
                        <ul className="list-inside list-disc space-y-1 ">
                          <li>
                            <strong>Notion:</strong>{" "}
                            基本機能は無料、カスタムドメインや高度な機能は月額1,650円から
                          </li>
                          <li>
                            <strong>Google Sheets:</strong> 完全無料で利用可能
                          </li>
                          <li>
                            <strong>Airtable:</strong>{" "}
                            無料プランは1,200レコードまで、Plus
                            プランは月額10ドル
                          </li>
                        </ul>
                        <p className="mt-2 ">
                          5×5の価格表であれば、どのサービスも無料プランで十分対応可能ですが、デザイン性とiframe埋め込みの自然さを考慮すると、Notionが最も適した選択肢となります。
                        </p>
                      </div>
                    </details>
                  </div>
                </details>
              </div>
            </div>
          </div>
        );
      case "ai-generator":
        return (
          <TextGenerator
            onSelect={(text) => {
              // テキストを生成して、クリップボードにコピー
              if (!navigator.clipboard) {
                toast.error(
                  "このブラウザではクリップボード機能がサポートされていません"
                );
                return;
              }

              navigator.clipboard
                .writeText(text)
                .then(() => {
                  toast.success("テキストをクリップボードにコピーしました");
                })
                .catch((error) => {
                  console.warn("クリップボードコピーに失敗:", error);
                  toast.error("コピーに失敗しました");
                });
            }}
          />
        );
      case "image-gallery":
        return <ImageGallery />;
      case "edit":
        if (activeSectionIndex !== null && page.sections[activeSectionIndex]) {
          const currentSection = page.sections[activeSectionIndex];

          // 通常のセクションエディター
          return (
            <SectionEditorRenderer
              section={currentSection}
              onUpdate={(updatedSection) =>
                updateSection(activeSectionIndex, updatedSection)
              }
            />
          );
        }
        return (
          <div className="p-8 text-center">
            <p className="mb-4">
              編集するセクションを選択するか、新しいセクションを追加してください。
            </p>
            <Button onClick={() => setIsSelectorOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              セクションを追加
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  // ページデータが読み込まれた後、セクションが存在する場合は一番上を選択
  useEffect(() => {
    if (!isLoading && page.sections.length > 0 && activeSectionIndex === null) {
      setActiveSectionIndex(0);
      setActiveMenuTab("edit");
    }
  }, [isLoading, page.sections.length, activeSectionIndex]);

  // 追加: 画面幅監視

  // 認証チェック中
  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
          <p className="mt-4">認証確認中...</p>
        </div>
      </div>
    );
  }

  // 認証されていない場合
  if (!isAuthenticated) {
    return (
      <PasswordAuth
        onAuthenticated={(role) => {
          setIsAuthenticated(true);
          setUserRole(role || null);
        }}
        title="ポートフォリオCMS - 企業様向け"
        subtitle="編集機能をご利用いただくため、パスワードを入力してください"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
          <p className="mt-4">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* ヘッダー */}
      <header className="border-b  shadow-sm">
        <div
          className="flex flex-wrap items-center gap-2 px-4 py-2"
          style={{ minHeight: "var(--header-height)" }}
        >
          <div className="flex items-center  gap-4">
            <h1 className="fontJost text-3xl font-light">/editor</h1>
            <button
              aria-label="ダークモード切替"
              className="ml-2 border-none bg-transparent p-1 outline-none focus:outline-none"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-6 w-6 text-yellow-400" />
              ) : (
                <Moon className="h-6 w-6 text-zinc-700" />
              )}
            </button>
          </div>
          <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
            <Link href="/" target="_blank">
              <Button variant="outline">
                <ExternalLink className=" h-4 w-4" />
                ページを開く
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                // スプリットモード中にプレビューを開く場合、スプリットモードを自動解除
                if (!previewMode && splitScreenMode) {
                  setSplitScreenMode(false);
                }
                setPreviewMode(!previewMode);
              }}
            >
              <Eye className=" h-4 w-4" />
              {previewMode
                ? "編集に戻る"
                : splitScreenMode
                  ? "プレビュー(分割解除)"
                  : "プレビュー"}
            </Button>
            <Button
              variant={splitScreenMode ? "default" : "outline"}
              onClick={() => setSplitScreenMode(!splitScreenMode)}
            >
              <SplitSquareHorizontal className="h-4 w-4" />
              {splitScreenMode ? "分割終了" : "分割表示"}
            </Button>
            <Button onClick={savePage} disabled={isSaving}>
              <Save className="h-4 w-4" />
              {isSaving ? "保存中..." : "保存"}
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              ログアウト
            </Button>
          </div>
        </div>
      </header>

      {previewMode ? (
        // プレビューモード - iframe化
        <div className="relative flex-1 overflow-auto bg-gray-100 p-4">
          <div className="flex h-full justify-center overflow-auto">
            <iframe
              ref={(ref) => {
                if (ref && !splitScreenMode) {
                  // 通常プレビューモード用のiframe参照を設定
                  setIframeRef(ref);
                }
              }}
              src="/preview"
              title="Preview"
              style={{
                width: "100%",
                height: "calc(100vh - 120px)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                backgroundColor: "white",
              }}
            />
          </div>
        </div>
      ) : (
        // 編集モード（通常 + 分割対応）
        <div className="EditorWorkspace">
          <div className="WorkspaceLayout">
            {/* 左端: タブリスト */}
            <nav
              className={`TabsPanel ${splitScreenMode ? "split-mode" : ""}`}
              aria-label="エディタメニュー"
            >
              <Tabs
                value={activeMenuTab}
                onValueChange={setActiveMenuTab}
                className="w-max min-w-full lg:w-full"
              >
                <TabsList className="TabsList ">
                  <TabsTrigger
                    value="header"
                    className=" rounded-none border-none bg-transparent p-2 text-left  "
                  >
                    ヘッダー設定
                  </TabsTrigger>
                  <TabsTrigger
                    value="footer"
                    className=" rounded-none border-none bg-transparent p-2 text-left  "
                  >
                    フッター設定
                  </TabsTrigger>
                  <TabsTrigger
                    value="css-editor"
                    className=" rounded-none border-none bg-transparent p-2 text-left  "
                  >
                    カスタムCSS
                  </TabsTrigger>
                  <TabsTrigger
                    value="ai-generator"
                    className=" rounded-none border-none bg-transparent p-2 text-left  "
                  >
                    AIで生成
                  </TabsTrigger>
                  <TabsTrigger
                    value="image-gallery"
                    className=" rounded-none border-none bg-transparent p-2 text-left  "
                  >
                    画像一覧
                  </TabsTrigger>
                  <TabsTrigger
                    value="backup"
                    className=" rounded-none border-none bg-transparent p-2 text-left  "
                  >
                    バックアップ
                  </TabsTrigger>
                  <TabsTrigger
                    value="dev-notes"
                    className=" rounded-none border-none bg-transparent p-2 text-left  "
                  >
                    開発メモ
                  </TabsTrigger>
                </TabsList>
                {/* Handアイコン */}
                <div
                  className="pointer-events-none absolute right-2 top-2 flex h-full items-center lg:hidden"
                  style={{ zIndex: 10 }}
                >
                  <div
                    id="tab-flick-indicator"
                    className="transition-opacity duration-300"
                    style={{ opacity: 0 }}
                  >
                    <Hand className="h-5 w-5 animate-bounce text-gray-400" />
                  </div>
                </div>
              </Tabs>
            </nav>

            {/* セクションリスト */}
            <aside
              className={`SectionPanel ${splitScreenMode ? "split-mode" : ""}`}
              aria-label="セクション一覧"
            >
              <div className="flex w-full flex-wrap items-center gap-2">
                <h2 className=" font-medium md:w-full">
                  セクション ({page.sections.length})
                </h2>

                {/* 切り替えボタン（不要のためコメントアウト）
                <Button
                  size="sm"
                  variant={useIDEStyleUI ? "default" : "outline"}
                  onClick={() => setUseIDEStyleUI(!useIDEStyleUI)}
                  title={
                    useIDEStyleUI ? "通常UIに切り替え" : "IDE風UIに切り替え"
                  }
                >
                  <Code className="h-3 w-3" />
                </Button>
                */}
                <Button
                  size="sm"
                  onClick={() => setIsSelectorOpen(true)}
                  className="ml-auto "
                >
                  <Plus className="h-3 w-3" />
                  追加
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={duplicateSelectedSection}
                  className=" "
                >
                  <Plus className="h-3 w-3" />
                  複製
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="SectionSelect"
                  onClick={() => setSectionListOpen((v) => !v)}
                >
                  選択
                </Button>
              </div>
              {/* PC時は常時リスト表示、SP時は開閉 */}
              <div
                className={
                  "SortableSectionsOuter mt-4 w-full " +
                  (sectionListOpen ? "" : "hidden") +
                  " "
                }
              >
                <IDEStyleSectionList
                  sections={
                    sectionListOpen ||
                    typeof window === "undefined" ||
                    window.innerWidth >= 834
                      ? page.sections
                      : page.sections.filter((_, i) => i === activeSectionIndex)
                  }
                  activeSectionIndex={activeSectionIndex}
                  onSectionClick={handleSectionClick}
                  onSectionMove={moveSection}
                  onSectionDelete={deleteSection}
                />
                {/* 従来のSortableSections（不要のためコメントアウト）
                <SortableSections
                  sections={
                    sectionListOpen ||
                    typeof window === "undefined" ||
                    window.innerWidth >= 834
                      ? page.sections
                      : page.sections.filter(
                          (_, i) => i === activeSectionIndex
                        )
                  }
                  activeSectionIndex={activeSectionIndex}
                  onSectionClick={handleSectionClick}
                  onSectionMove={moveSection}
                  onSectionDelete={deleteSection}
                  onSectionsChange={updateSections}
                  onGroupToggle={handleGroupToggle}
                  expandedGroups={expandedGroups}
                />
                */}
              </div>
            </aside>

            {/* 編集エリア */}
            <main
              className={`EditingPanel ${splitScreenMode ? "split-mode" : ""}`}
            >
              {renderEditor()}
            </main>
          </div>

          {/* 分割モード時のプレビューエリア */}
          {splitScreenMode && (
            <>
              {/* リサイザー */}
              <div
                data-resizer="true"
                className="Resizer group"
                onMouseDown={handleMouseDown}
              >
                {/* リサイズハンドル装飾 */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60 transition-opacity group-hover:opacity-100">
                  <GripVertical className="h-5  text-gray-600 group-hover:text-slate-600" />
                </div>
              </div>

              {/* プレビューパネル */}
              <div
                ref={setRightPanelRef}
                className="PreviewPanel"
                style={{ width: `${100 - leftPanelWidth}%` }}
              >
                <div className="border-b p-2">
                  <div className="flex items-center justify-between">
                    <h3 className=" font-medium">プレビュー</h3>
                    <div className="flex items-center gap-2">
                      {/* ビューポート選択 */}
                      <div className="flex items-center gap-1">
                        {Object.entries(widthPresets).map(([key, preset]) => {
                          const IconComponent = preset.icon;
                          return (
                            <Button
                              key={key}
                              size="sm"
                              variant={
                                previewWidthRatio === parseInt(key)
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() =>
                                setPreviewWidthRatio(
                                  parseInt(key) as 100 | 70 | 40
                                )
                              }
                              className="h-7 px-2"
                              title={preset.label}
                              aria-label={`プレビュー幅を${preset.label}に設定`}
                            >
                              <IconComponent className="h-3 w-3" />
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden bg-gray-100 p-4">
                  <div className="flex h-full justify-center overflow-auto">
                    <iframe
                      ref={setIframeRef}
                      src="/preview"
                      title="Preview"
                      style={{
                        width: rightPanelRef
                          ? `${(rightPanelRef.offsetWidth - 32) * (previewWidthRatio / 100)}px`
                          : "100%",
                        height: "calc(100vh - 120px)", // ヘッダー + プレビューヘッダーを考慮
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      }}
                    ></iframe>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* アクセシビリティテストパネル */}
      <AccessibilityPanel />

      {/* セクション追加ダイアログ */}
      <Dialog open={isSelectorOpen} onOpenChange={setIsSelectorOpen}>
        <DialogContent className="">
          <DialogTitle>セクションを追加</DialogTitle>
          <SectionSelector onSelect={addSection} />
        </DialogContent>
      </Dialog>
      {/* タブ横スクロール時のみHandアイコン表示スクリプト */}
      {/* <script
        dangerouslySetInnerHTML={{
          __html: `
				(function(){
					function updateFlickIcon() {
						var el = document.querySelector('[data-slot="tabs-list"]');
						var ind = document.getElementById('tab-flick-indicator');
						if (!el || !ind) return;
						var isOverflowing = el.scrollWidth > el.clientWidth + 8;
						ind.style.opacity = isOverflowing ? 1 : 0;
					}
					window.addEventListener('resize', updateFlickIcon);
					setTimeout(updateFlickIcon, 300);
				})();
				`,
        }}
      /> */}
    </div>
  );
}
