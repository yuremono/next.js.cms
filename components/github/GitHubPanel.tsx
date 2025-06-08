"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Circle, AlertCircle, History, RotateCcw } from "lucide-react";
import { Page } from "@/types";

type GitHubConnectionStatus = {
	connected: boolean;
	repo?: string;
	error?: string;
	details?: string;
	url?: string;
};

type BackupInfo = {
	name: string;
	date: Date;
	sha: string;
};

type ModalType =
	| "issue"
	| "pr"
	| "commit"
	| "branch"
	| "backup"
	| "backupList"
	| null;

type Branch = {
	name: string;
	commit: {
		sha: string;
	};
};

export function GitHubPanel({ page }: { page: Page }) {
	const [connectionStatus, setConnectionStatus] =
		useState<GitHubConnectionStatus | null>(null);
	const [loading, setLoading] = useState(false);
	const [modalOpen, setModalOpen] = useState<ModalType>(null);
	const [backups, setBackups] = useState<BackupInfo[]>([]);
	const [loadingBackups, setLoadingBackups] = useState(false);
	const [selectedBackup, setSelectedBackup] = useState<string | null>(null);

	// フォーム状態
	const [issueTitle, setIssueTitle] = useState("");
	const [issueBody, setIssueBody] = useState("");
	const [prTitle, setPrTitle] = useState("");
	const [prBody, setPrBody] = useState("");
	const [prBranch, setPrBranch] = useState("");
	const [prBaseBranch, setPrBaseBranch] = useState("main");
	const [commitMessage, setCommitMessage] = useState("");
	const [branchName, setBranchName] = useState("");
	const [baseBranch, setBaseBranch] = useState("main");

	// 接続状態を確認
	useEffect(() => {
		checkConnection();
	}, []);

	// バックアップ一覧を取得
	const fetchBackups = useCallback(async () => {
		if (!connectionStatus?.connected) return;

		setLoadingBackups(true);
		try {
			const response = await fetch("/api/github", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "listBranches",
					prefix: "backup-",
				}),
			});

			const data = await response.json();
			if (data.success) {
				// バックアップブランチを日付でソート（新しい順）
				const backupList = data.branches
					.filter((branch: Branch) =>
						branch.name.startsWith("backup-")
					)
					.map((branch: Branch) => {
						// ブランチ名からDateオブジェクトを作成（例: backup-2023-05-17-15-30）
						const dateParts = branch.name
							.replace("backup-", "")
							.split("-");
						// YYYYMMDDHHMMの形式で取得できたと仮定
						const year = parseInt(dateParts[0]);
						const month = parseInt(dateParts[1]) - 1; // Javascriptの月は0-11
						const day = parseInt(dateParts[2]);
						const hour =
							dateParts.length > 3 ? parseInt(dateParts[3]) : 0;
						const minute =
							dateParts.length > 4 ? parseInt(dateParts[4]) : 0;

						return {
							name: branch.name,
							date: new Date(year, month, day, hour, minute),
							sha: branch.commit.sha,
						};
					})
					.sort(
						(a: BackupInfo, b: BackupInfo) =>
							b.date.getTime() - a.date.getTime()
					);

				setBackups(backupList);
			} else {
				toast.error(`バックアップ一覧取得エラー: ${data.error}`);
			}
		} catch (error) {
			console.error("バックアップ一覧取得エラー:", error);
			toast.error("バックアップ一覧の取得中にエラーが発生しました");
		} finally {
			setLoadingBackups(false);
		}
	}, [connectionStatus?.connected]);

	// バックアップ一覧をモーダルが開かれたときに取得
	useEffect(() => {
		if (modalOpen === "backupList" && connectionStatus?.connected) {
			fetchBackups();
		}
	}, [modalOpen, connectionStatus?.connected, fetchBackups]);

	const checkConnection = async () => {
		try {
			const response = await fetch("/api/github");
			const data = await response.json();
			setConnectionStatus(data);
		} catch (error) {
			console.error("GitHub接続チェックエラー:", error);
			setConnectionStatus({ connected: false, error: "接続エラー" });
		}
	};

	// バックアップを作成
	const handleCreateBackup = async () => {
		if (!connectionStatus?.connected) {
			toast.error("GitHub接続が必要です");
			return;
		}

		setLoading(true);
		try {
			// 現在の日時からブランチ名を生成
			const now = new Date();
			const branchName = `backup-${now.getFullYear()}-${String(
				now.getMonth() + 1
			).padStart(2, "0")}-${String(now.getDate()).padStart(
				2,
				"0"
			)}-${String(now.getHours()).padStart(2, "0")}-${String(
				now.getMinutes()
			).padStart(2, "0")}`;

			// ページデータをJSONファイルとして保存
			const pageJson = JSON.stringify(page, null, 2);
			const commitMessage = `バックアップ: ${now.toLocaleString(
				"ja-JP"
			)}`;

			// まずブランチを作成
			const branchResponse = await fetch("/api/github", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "createBranch",
					branchName,
					fromBranch: "main",
				}),
			});

			const branchData = await branchResponse.json();
			if (!branchData.success) {
				throw new Error(`ブランチ作成エラー: ${branchData.error}`);
			}

			// 次にコミット
			const commitResponse = await fetch("/api/github", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "commit",
					files: [
						{
							path: "data/page.json",
							content: pageJson,
						},
					],
					message: commitMessage,
					branch: branchName,
				}),
			});

			const commitData = await commitResponse.json();
			if (commitData.success) {
				toast.success(`バックアップが作成されました: ${branchName}`);
				setModalOpen(null);
			} else {
				throw new Error(`コミットエラー: ${commitData.error}`);
			}
		} catch (error) {
			console.error("バックアップ作成エラー:", error);
			toast.error(
				`バックアップ作成中にエラーが発生しました: ${
					error instanceof Error ? error.message : "不明なエラー"
				}`
			);
		} finally {
			setLoading(false);
		}
	};

	// バックアップから復元
	const handleRestoreBackup = async () => {
		if (!selectedBackup) {
			toast.error("復元するバックアップを選択してください");
			return;
		}

		setLoading(true);
		try {
			// バックアップブランチからページデータを取得
			const response = await fetch("/api/github", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "getFileContent",
					path: "data/page.json",
					branch: selectedBackup,
				}),
			});

			const data = await response.json();
			if (data.success) {
				// ページデータをローカルストレージに保存（または他の方法でページに適用）
				localStorage.setItem("restoredPageData", data.content);
				toast.success(
					`バックアップから復元されました: ${selectedBackup}`
				);
				toast.info("ページをリロードして変更を適用してください");
				setModalOpen(null);
				// リロードを促すか、自動でリロードする
				if (confirm("ページをリロードして変更を適用しますか？")) {
					window.location.reload();
				}
			} else {
				toast.error(`バックアップ復元エラー: ${data.error}`);
			}
		} catch (error) {
			console.error("バックアップ復元エラー:", error);
			toast.error("バックアップの復元中にエラーが発生しました");
		} finally {
			setLoading(false);
		}
	};

	// イシュー作成
	const handleCreateIssue = async () => {
		if (!issueTitle) {
			toast.error("タイトルを入力してください");
			return;
		}

		setLoading(true);
		try {
			const response = await fetch("/api/github", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "createIssue",
					title: issueTitle,
					body: issueBody,
					labels: ["cms"],
				}),
			});

			const data = await response.json();
			if (data.success) {
				toast.success(`イシューが作成されました: #${data.issueNumber}`);
				setModalOpen(null);
				setIssueTitle("");
				setIssueBody("");
			} else {
				toast.error(`イシュー作成エラー: ${data.error}`);
			}
		} catch {
			toast.error("イシュー作成中にエラーが発生しました");
		} finally {
			setLoading(false);
		}
	};

	// プルリクエスト作成
	const handleCreatePR = async () => {
		if (!prTitle || !prBranch) {
			toast.error("タイトルとブランチ名を入力してください");
			return;
		}

		setLoading(true);
		try {
			const response = await fetch("/api/github", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "createPullRequest",
					title: prTitle,
					body: prBody,
					head: prBranch,
					base: prBaseBranch,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			if (data.success) {
				toast.success(
					`プルリクエストが作成されました: #${data.prNumber}`
				);
				setModalOpen(null);
				setPrTitle("");
				setPrBody("");
				setPrBranch("");
			} else {
				// 具体的なエラーメッセージを表示
				toast.error(
					`プルリクエスト作成エラー: ${
						data.error || "不明なエラーが発生しました"
					}`
				);
			}
		} catch (error) {
			console.error("PR creation error:", error);
			toast.error("プルリクエスト作成中にエラーが発生しました");
		} finally {
			setLoading(false);
		}
	};

	// コミット作成
	const handleCommit = async () => {
		if (!commitMessage) {
			toast.error("コミットメッセージを入力してください");
			return;
		}

		setLoading(true);
		try {
			// ページデータをJSONファイルとして保存
			const pageJson = JSON.stringify(page, null, 2);

			const response = await fetch("/api/github", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "commit",
					files: [
						{
							path: "data/page.json",
							content: pageJson,
						},
					],
					message: commitMessage,
				}),
			});

			const data = await response.json();
			if (data.success) {
				toast.success("変更がコミットされました");
				setModalOpen(null);
				setCommitMessage("");
			} else {
				toast.error(`コミットエラー: ${data.error}`);
			}
		} catch {
			toast.error("コミット中にエラーが発生しました");
		} finally {
			setLoading(false);
		}
	};

	// ブランチ作成
	const handleCreateBranch = async () => {
		if (!branchName) {
			toast.error("ブランチ名を入力してください");
			return;
		}

		// ブランチ名のフロントエンド側バリデーション
		if (branchName.includes(" ") || /[^a-zA-Z0-9\-_\/.]/.test(branchName)) {
			toast.error(
				"無効なブランチ名です。英数字、ハイフン、アンダースコア、スラッシュのみ使用できます。"
			);
			return;
		}

		setLoading(true);
		try {
			const response = await fetch("/api/github", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "createBranch",
					branchName,
					fromBranch: baseBranch,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			if (data.success) {
				toast.success(`ブランチが作成されました: ${branchName}`);
				setModalOpen(null);
				setBranchName("");
			} else {
				// 具体的なエラーメッセージを表示
				toast.error(
					`ブランチ作成エラー: ${
						data.error || "不明なエラーが発生しました"
					}`
				);
			}
		} catch (error) {
			console.error("Branch creation error:", error);
			toast.error(
				"ブランチ作成中にエラーが発生しました。ネットワーク接続を確認してください。"
			);
		} finally {
			setLoading(false);
		}
	};

	// 日付のフォーマット関数
	const formatDate = (date: Date) => {
		return date.toLocaleString("ja-JP", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
    <div className="flex h-full flex-col space-y-6">
      <Card className="flex flex-1 flex-col rounded-sm p-4">
        <h3 className="mb-4 text-lg font-medium">バックアップ</h3>

        {/* 接続状態表示 */}
        <div className="mb-4">
          {connectionStatus === null ? (
            <div className="flex items-center text-gray-500">
              <Circle className="mr-2 h-4 w-4 animate-pulse" />
              接続を確認中...
            </div>
          ) : connectionStatus.connected ? (
            <div className="flex items-center text-green-600">
              <Circle className="mr-2 h-4 w-4 fill-green-600" />
              <span className="mr-2">接続済み:</span>
              <a
                href={connectionStatus.url}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                {connectionStatus.repo}
              </a>
            </div>
          ) : (
            <div className="flex flex-col text-red-500">
              <div className="flex items-center">
                <AlertCircle className="mr-2 h-4 w-4" />
                未接続: {connectionStatus.error}
              </div>
              {connectionStatus.details && (
                <div className="ml-6 mt-1 text-xs text-red-400">
                  詳細: {connectionStatus.details}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 操作ボタン群 */}
        <div className="grid grid-cols-2 gap-3">
          {/* バックアップ機能 */}
          <Button
            variant="outline"
            className="flex items-center"
            onClick={() => handleCreateBackup()}
            disabled={!connectionStatus?.connected || loading}
          >
            <History className="mr-2 h-4 w-4" />
            {loading ? "処理中..." : "バックアップを作成"}
          </Button>

          <Button
            variant="outline"
            className="flex items-center"
            onClick={() => setModalOpen("backupList")}
            disabled={!connectionStatus?.connected}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            バックアップから復元
          </Button>

          {/* // 以下は不要な機能としてコメントアウト */}

          {/* <Button
					variant="outline"
					className="flex items-center"
					onClick={() => setModalOpen("issue")}
					disabled={!connectionStatus?.connected}
				>
					<Plus className="h-4 w-4 mr-2" />
					イシュー作成
				</Button> */}

          {/* <Button
					variant="outline"
					className="flex items-center"
					onClick={() => setModalOpen("pr")}
					disabled={!connectionStatus?.connected}
				>
					<GitPullRequest className="h-4 w-4 mr-2" />
					PR作成
				</Button> */}

          {/* <Button
					variant="outline"
					className="flex items-center"
					onClick={() => setModalOpen("branch")}
					disabled={!connectionStatus?.connected}
				>
					<GitBranch className="h-4 w-4 mr-2" />
					ブランチ作成
				</Button> */}

          {/* <Button
					variant="outline"
					className="flex items-center"
					onClick={() => setModalOpen("commit")}
					disabled={!connectionStatus?.connected}
				>
					<Save className="h-4 w-4 mr-2" />
					変更をコミット
				</Button> */}
        </div>

        {/* バックアップ一覧モーダル */}
        <Dialog
          open={modalOpen === "backupList"}
          onOpenChange={(open) => !open && setModalOpen(null)}
        >
          <DialogContent className="max-w-3xl">
            <DialogTitle>バックアップから復元</DialogTitle>
            <div className="max-h-[60vh] space-y-4 overflow-y-auto py-4">
              {loadingBackups ? (
                <div className="p-4 text-center">
                  <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-gray-500 border-t-transparent"></div>
                  バックアップ一覧を読み込み中...
                </div>
              ) : backups.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  バックアップが見つかりませんでした
                </div>
              ) : (
                <div className="space-y-2">
                  {backups.map((backup) => (
                    <div
                      key={backup.name}
                      className={`flex items-center justify-between rounded-md border p-3 ${
                        selectedBackup === backup.name
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      onClick={() => setSelectedBackup(backup.name)}
                    >
                      <div>
                        <div className="font-medium">
                          {formatDate(backup.date)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {backup.name}
                        </div>
                      </div>
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBackup(backup.name);
                          }}
                          className={
                            selectedBackup === backup.name ? "hidden" : ""
                          }
                        >
                          選択
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(null)}>
                キャンセル
              </Button>
              <Button
                onClick={handleRestoreBackup}
                disabled={loading || !selectedBackup}
              >
                {loading ? "復元中..." : "選択したバックアップを復元"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 
			// 以下は不要なモーダルとしてコメントアウト

			{/* イシュー作成モーダル */}
        <Dialog
          open={modalOpen === "issue"}
          onOpenChange={(open) => !open && setModalOpen(null)}
        >
          <DialogContent>
            <DialogTitle>新しいイシューを作成</DialogTitle>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="issue-title">タイトル</Label>
                <Input
                  id="issue-title"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  placeholder="イシューのタイトル"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue-body">説明</Label>
                <Textarea
                  id="issue-body"
                  value={issueBody}
                  onChange={(e) => setIssueBody(e.target.value)}
                  placeholder="イシューの詳細"
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(null)}>
                キャンセル
              </Button>
              <Button onClick={handleCreateIssue} disabled={loading}>
                {loading ? "作成中..." : "作成"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* PR作成モーダル */}
        <Dialog
          open={modalOpen === "pr"}
          onOpenChange={(open) => !open && setModalOpen(null)}
        >
          <DialogContent>
            <DialogTitle>新しいプルリクエストを作成</DialogTitle>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="pr-title">タイトル</Label>
                <Input
                  id="pr-title"
                  value={prTitle}
                  onChange={(e) => setPrTitle(e.target.value)}
                  placeholder="PRのタイトル"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pr-branch">ブランチ名</Label>
                <Input
                  id="pr-branch"
                  value={prBranch}
                  onChange={(e) => setPrBranch(e.target.value)}
                  placeholder="変更を含むブランチ (例: feature/new-design)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pr-base">ベースブランチ</Label>
                <Input
                  id="pr-base"
                  value={prBaseBranch}
                  onChange={(e) => setPrBaseBranch(e.target.value)}
                  placeholder="マージ先のブランチ (通常はmain)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pr-body">説明</Label>
                <Textarea
                  id="pr-body"
                  value={prBody}
                  onChange={(e) => setPrBody(e.target.value)}
                  placeholder="PRの説明"
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(null)}>
                キャンセル
              </Button>
              <Button onClick={handleCreatePR} disabled={loading}>
                {loading ? "作成中..." : "作成"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* コミットモーダル */}
        <Dialog
          open={modalOpen === "commit"}
          onOpenChange={(open) => !open && setModalOpen(null)}
        >
          <DialogContent>
            <DialogTitle>変更をコミット</DialogTitle>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="commit-message">コミットメッセージ</Label>
                <Input
                  id="commit-message"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="コミットメッセージ"
                />
              </div>
              <p className="text-sm text-gray-500">
                現在のページデータが data/page.json にコミットされます。
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(null)}>
                キャンセル
              </Button>
              <Button onClick={handleCommit} disabled={loading}>
                {loading ? "コミット中..." : "コミット"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ブランチ作成モーダル */}
        <Dialog
          open={modalOpen === "branch"}
          onOpenChange={(open) => !open && setModalOpen(null)}
        >
          <DialogContent>
            <DialogTitle>新しいブランチを作成</DialogTitle>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="branch-name">ブランチ名</Label>
                <Input
                  id="branch-name"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="例: feature/new-section"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="base-branch">ベースブランチ</Label>
                <Input
                  id="base-branch"
                  value={baseBranch}
                  onChange={(e) => setBaseBranch(e.target.value)}
                  placeholder="派生元のブランチ (通常はmain)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(null)}>
                キャンセル
              </Button>
              <Button onClick={handleCreateBranch} disabled={loading}>
                {loading ? "作成中..." : "作成"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}
