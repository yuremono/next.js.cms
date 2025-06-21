"use client";

import { useState, useEffect } from "react";
import "../top.scss";
import { Button } from "@/components/ui/button";
import "../top.scss";
import "../top.scss";
// import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Footer, Header, Page, Section } from "@/types";
import { HeaderEditor } from "@/components/sections/HeaderEditor";
import { FooterEditor } from "@/components/sections/FooterEditor";
import SortableSections from "@/components/SortableSections";
import IDEStyleSectionList from "@/components/IDEStyleSectionList";
import { SectionSelector } from "@/components/SectionSelector";
import { SectionEditorRenderer } from "@/components/editor/SectionEditorRenderer";
import { PageRenderer } from "@/components/PageRenderer";
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
  Code,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { TextGenerator } from "@/components/sections/TextGenerator";
import { ImageGallery } from "@/components/images/ImageGallery";
import { CSSEditor } from "@/components/editor/CSSEditor";
import { DatabaseBackup } from "@/components/backup/DatabaseBackup";
import { PasswordAuth } from "@/components/auth/PasswordAuth";
import { AccessibilityPanel } from "@/components/AccessibilityPanel";
import "../top.scss";
import "../top.scss";

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
          <li><a href="#" class="hover:text-primary">お問い合わせ</a></li>
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

  // グループ展開状態の管理
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // プレビューモードの状態
  const [previewMode, setPreviewMode] = useState(false);

  // ロード中の状態
  const [isLoading, setIsLoading] = useState(true);

  // データの保存中状態
  const [isSaving, setIsSaving] = useState(false);

  // 追加: レスポンシブ用state
  const [sectionListOpen, setSectionListOpen] = useState(false);

  // IDE風UI切り替え状態
  const [useIDEStyleUI, setUseIDEStyleUI] = useState(true);

  // プレビューにデータを送信する関数
  const sendDataToPreview = () => {
    if (iframeRef && iframeRef.contentWindow) {
      iframeRef.contentWindow.postMessage(
        {
          type: "UPDATE_PAGE_DATA",
          data: page,
        },
        window.location.origin
      );
    }
  };

  // pageが変更されたときにプレビューを更新（通常プレビュー・分割プレビュー共通）
  useEffect(() => {
    if ((splitScreenMode || previewMode) && iframeRef) {
      const timer = setTimeout(sendDataToPreview, 100);
      return () => clearTimeout(timer);
    }
  }, [page, splitScreenMode, previewMode, iframeRef]);

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
          const { authenticated } = await response.json();
          console.log("✅ 認証チェック完了:", authenticated);
          setIsAuthenticated(authenticated);
        } else {
          console.warn("⚠️ 認証API応答エラー:", response.status);
          setIsAuthenticated(false);
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

  // グループの展開・折りたたみ
  const handleGroupToggle = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

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

  // セクション配列を直接更新する関数（ドラッグ&ドロップグループ化用）
  const updateSections = (newSections: Section[]) => {
    setPage((prevPage) => {
      // 新しい順序文字列を生成
      const newOrder = sectionsToOrderString(newSections);

      return {
        ...prevPage,
        sections: newSections,
        sectionsOrder: newOrder,
      };
    });
    // 選択インデックスを調整（削除された場合に備えて）
    if (
      activeSectionIndex !== null &&
      activeSectionIndex >= newSections.length
    ) {
      setActiveSectionIndex(
        newSections.length > 0 ? newSections.length - 1 : null
      );
    }
  };

  // ページデータの保存
  const savePage = async () => {
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
      toast.error("保存に失敗しました", {
        id: toastId,
        description:
          error instanceof Error ? error.message : "不明なエラーが発生しました",
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
            <p className="mb-4 text-muted-foreground">
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
        onAuthenticated={() => setIsAuthenticated(true)}
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
            <h1 className="font-jost text-3xl font-light">/editor</h1>
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
              <div className="flex w-full items-center gap-2">
                <h2 className="text-sm font-medium">
                  セクション ({page.sections.length})
                </h2>

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
                <Button
                  size="sm"
                  onClick={() => setIsSelectorOpen(true)}
                  className="ml-auto"
                >
                  <Plus className="h-3 w-3" />
                  追加
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
                {useIDEStyleUI ? (
                  <IDEStyleSectionList
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
                  />
                ) : (
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
                )}
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
                    <h3 className="text-sm font-medium">プレビュー</h3>
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
