import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

// GitHub APIの初期化
const setupOctokit = () => {
	const token = process.env.GITHUB_ACCESS_TOKEN;
	if (!token) {
		throw new Error("GitHub access token is not configured");
	}
	return new Octokit({ auth: token });
};

// リポジトリ情報
const getRepoInfo = () => {
	const owner = process.env.GITHUB_REPO_OWNER;
	const repo = process.env.GITHUB_REPO_NAME;
	const branch = process.env.GITHUB_BRANCH || "main";

	if (!owner || !repo) {
		throw new Error("GitHub repository information is not configured");
	}

	return { owner, repo, branch };
};

/**
 * コンテンツをコミットする関数
 */
async function commitFiles(
	files: Array<{ path: string; content: string }>,
	message: string,
	branch?: string
) {
	try {
		const octokit = setupOctokit();
		const { owner, repo } = getRepoInfo();
		const targetBranch = branch || process.env.GITHUB_BRANCH || "main";

		// 各ファイルを処理
		for (const file of files) {
			// 既存ファイルの情報を取得（SHA用）
			let sha: string | undefined;
			try {
				const { data: fileData } = await octokit.repos.getContent({
					owner,
					repo,
					path: file.path,
					ref: targetBranch,
				});

				if (!Array.isArray(fileData)) {
					sha = fileData.sha;
				}
			} catch {
				// ファイルが存在しない場合はエラーが発生するが、無視して新規作成する
				console.log(`Creating new file: ${file.path}`);
			}

			// ファイルをコミット
			await octokit.repos.createOrUpdateFileContents({
				owner,
				repo,
				path: file.path,
				message: message,
				content: Buffer.from(file.content).toString("base64"),
				branch: targetBranch,
				sha,
			});
		}

		return { success: true };
	} catch (error) {
		console.error("GitHub commit error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * イシューを作成する関数
 */
async function createIssue(title: string, body: string, labels: string[] = []) {
	try {
		const octokit = setupOctokit();
		const { owner, repo } = getRepoInfo();

		const { data } = await octokit.issues.create({
			owner,
			repo,
			title,
			body,
			labels,
		});

		return {
			success: true,
			issueUrl: data.html_url,
			issueNumber: data.number,
		};
	} catch (error) {
		console.error("GitHub issue creation error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * プルリクエストを作成する関数
 */
async function createPullRequest(
	title: string,
	body: string,
	head: string,
	base: string = "main"
) {
	try {
		const octokit = setupOctokit();
		const { owner, repo } = getRepoInfo();

		const { data } = await octokit.pulls.create({
			owner,
			repo,
			title,
			body,
			head,
			base,
		});

		return { success: true, prUrl: data.html_url, prNumber: data.number };
	} catch (error) {
		console.error("GitHub PR creation error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * ブランチを作成する関数
 */
async function createBranch(branchName: string, fromBranch: string = "main") {
	try {
		// ブランチ名の検証
		if (
			!branchName ||
			branchName.includes(" ") ||
			/[^a-zA-Z0-9\-_\/.]/.test(branchName)
		) {
			return {
				success: false,
				error: "無効なブランチ名です。英数字、ハイフン、アンダースコア、スラッシュのみ使用できます。",
			};
		}

		const octokit = setupOctokit();
		const { owner, repo } = getRepoInfo();

		// 設定値のログ出力（デバッグ用）
		console.log("GitHub API設定:", { owner, repo, fromBranch, branchName });

		// 同名のブランチが存在しないか確認
		try {
			await octokit.git.getRef({
				owner,
				repo,
				ref: `heads/${branchName}`,
			});

			// ここに到達した場合、ブランチが既に存在する
			return {
				success: false,
				error: `ブランチ '${branchName}' は既に存在します`,
			};
		} catch (refError) {
			// 詳細エラーログ
			console.log("ブランチ存在チェックエラー:", refError);
			// 404エラーは想定内（ブランチが存在しない）
			if (
				!(
					refError instanceof Error &&
					"status" in refError &&
					refError.status === 404
				)
			) {
				throw refError; // その他のエラーは上位へ伝播
			}
		}

		// fromBranchの最新コミットSHAを取得
		try {
			console.log(`ベースブランチ '${fromBranch}' のSHAを取得中...`);
			const { data: refData } = await octokit.git.getRef({
				owner,
				repo,
				ref: `heads/${fromBranch}`,
			});

			console.log(`SHA取得成功: ${refData.object.sha}`);

			// 新しいブランチを作成
			console.log(`ブランチ '${branchName}' を作成中...`);
			await octokit.git.createRef({
				owner,
				repo,
				ref: `refs/heads/${branchName}`,
				sha: refData.object.sha,
			});

			return { success: true, branchName };
		} catch (branchError) {
			// 詳細エラーログ
			console.error(
				"ブランチ作成詳細エラー:",
				JSON.stringify(branchError, null, 2)
			);

			if (branchError instanceof Error) {
				// APIエラーからよりわかりやすいメッセージを抽出
				if (branchError.message.includes("Reference already exists")) {
					return {
						success: false,
						error: `ブランチ '${branchName}' は既に存在します`,
					};
				} else if (branchError.message.includes("Not Found")) {
					return {
						success: false,
						error: `ベースブランチ '${fromBranch}' が見つかりません`,
					};
				} else if (
					branchError.message.includes("Invalid reference name")
				) {
					return {
						success: false,
						error: `無効なブランチ名 '${branchName}' です`,
					};
				}
			}

			// 未定義のエラーは再スロー
			throw branchError;
		}
	} catch (error) {
		console.error("GitHub branch creation error:", error);
		// エラーオブジェクトの完全な内容をログに出力
		try {
			console.error("詳細エラー情報:", JSON.stringify(error, null, 2));
		} catch (e) {
			console.error("エラーオブジェクトのシリアライズに失敗:", e);
			console.error("エラータイプ:", typeof error);
			console.error("エラープロパティ:", Object.keys(error as object));
		}

		// より詳細なエラーメッセージを提供
		let errorMessage = "ブランチ作成中に問題が発生しました";
		if (error instanceof Error) {
			errorMessage = error.message;
			// Octokitエラーオブジェクトからさらに詳細情報を抽出
			if ("status" in error) {
				if (error.status === 401 || error.status === 403) {
					errorMessage =
						"GitHub認証エラー。アクセストークンを確認してください。";
				} else if (error.status === 404) {
					errorMessage =
						"リポジトリが見つかりません。リポジトリ設定を確認してください。";
				} else if (error.status === 422) {
					errorMessage = "ブランチ名が無効か、既に存在します。";
				}
			}
		}

		return {
			success: false,
			error: errorMessage,
		};
	}
}

/**
 * ブランチ一覧を取得する関数
 */
async function listBranches(prefix?: string) {
	try {
		const octokit = setupOctokit();
		const { owner, repo } = getRepoInfo();

		console.log(
			`Fetching branches from ${owner}/${repo} with prefix: ${
				prefix || "all"
			}`
		);

		// ブランチ一覧を取得
		const { data: branches } = await octokit.repos.listBranches({
			owner,
			repo,
			per_page: 100, // 最大100件取得
		});

		// フィルタリング（オプション）
		const filteredBranches = prefix
			? branches.filter((branch) => branch.name.startsWith(prefix))
			: branches;

		console.log(`Found ${filteredBranches.length} branches`);

		// 詳細情報の取得
		const branchesWithDetails = await Promise.all(
			filteredBranches.map(async (branch) => {
				try {
					// ブランチの最新コミット情報を取得
					const { data: commit } = await octokit.repos.getBranch({
						owner,
						repo,
						branch: branch.name,
					});

					return {
						name: branch.name,
						commit: {
							sha: commit.commit.sha,
							message: commit.commit.commit.message,
							date: commit.commit.commit.author?.date || null,
						},
					};
				} catch (err) {
					console.error(
						`Error fetching details for branch ${branch.name}:`,
						err
					);
					return {
						name: branch.name,
						commit: {
							sha: branch.commit.sha,
							message: "情報取得エラー",
							date: null,
						},
					};
				}
			})
		);

		return { success: true, branches: branchesWithDetails };
	} catch (error) {
		console.error("GitHub list branches error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * ファイル内容を取得する関数
 */
async function getFileContent(path: string, branch: string = "main") {
	try {
		const octokit = setupOctokit();
		const { owner, repo } = getRepoInfo();

		console.log(`Fetching file content: ${path} from branch: ${branch}`);

		// ファイル内容を取得
		const { data } = await octokit.repos.getContent({
			owner,
			repo,
			path,
			ref: branch,
		});

		// データが配列の場合（ディレクトリ）はエラー
		if (Array.isArray(data)) {
			return {
				success: false,
				error: "指定されたパスはディレクトリです",
			};
		}

		// コンテンツはBase64エンコードされているのでデコード
		if (!("content" in data)) {
			return {
				success: false,
				error: "ファイル内容が取得できませんでした",
			};
		}

		const content = Buffer.from(data.content, "base64").toString("utf-8");

		return {
			success: true,
			content,
			sha: data.sha,
			size: data.size,
		};
	} catch (error) {
		console.error("GitHub get file content error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

// POST リクエストハンドラ
export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { action, ...params } = body;

		let result;

		switch (action) {
			case "commit":
				result = await commitFiles(
					params.files,
					params.message,
					params.branch
				);
				break;
			case "createIssue":
				result = await createIssue(
					params.title,
					params.body,
					params.labels
				);
				break;
			case "createPullRequest":
				result = await createPullRequest(
					params.title,
					params.body,
					params.head,
					params.base
				);
				break;
			case "createBranch":
				result = await createBranch(
					params.branchName,
					params.fromBranch
				);
				break;
			case "listBranches":
				result = await listBranches(params.prefix);
				break;
			case "getFileContent":
				result = await getFileContent(params.path, params.branch);
				break;
			default:
				return NextResponse.json(
					{ error: "Invalid action" },
					{ status: 400 }
				);
		}

		return NextResponse.json(result);
	} catch (error) {
		console.error("API error:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 }
		);
	}
}

// GET リクエストハンドラ - GitHubの接続状態確認用
export async function GET() {
	try {
		const octokit = setupOctokit();
		const { owner, repo } = getRepoInfo();

		// まずトークンの有効性をテスト
		try {
			console.log("GitHubトークン検証中...");
			const { data: userData } = await octokit.users.getAuthenticated();
			console.log(`認証済みユーザー: ${userData.login}`);
		} catch (authError) {
			console.error("GitHub認証エラー:", authError);
			return NextResponse.json(
				{
					connected: false,
					error: "GitHub認証に失敗しました。アクセストークンが無効または期限切れの可能性があります。",
					details:
						authError instanceof Error
							? authError.message
							: "Unknown auth error",
				},
				{ status: 401 }
			);
		}

		// リポジトリ情報を取得
		try {
			const { data } = await octokit.repos.get({
				owner,
				repo,
			});

			return NextResponse.json({
				connected: true,
				repo: data.full_name,
				description: data.description,
				url: data.html_url,
			});
		} catch (repoError) {
			console.error("GitHub repository error:", repoError);
			return NextResponse.json(
				{
					connected: false,
					error: "GitHubトークンは有効ですが、リポジトリにアクセスできません。リポジトリ名と権限を確認してください。",
					details:
						repoError instanceof Error
							? repoError.message
							: "Unknown repo error",
				},
				{ status: 404 }
			);
		}
	} catch (error) {
		console.error("GitHub connection check error:", error);
		return NextResponse.json(
			{
				connected: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{
				status:
					error instanceof Error &&
					error.message.includes("not configured")
						? 400
						: 500,
			}
		);
	}
}
