"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type * as Monaco from "monaco-editor";

// Monaco Editorを動的にインポート
const MonacoEditorComponent = dynamic(
	() => import("@monaco-editor/react").then((mod) => mod.Editor),
	{ ssr: false }
);

interface MonacoEditorProps {
	content: string;
	onChange: (content: string) => void;
	language?: string;
	height?: string;
	options?: Monaco.editor.IStandaloneEditorConstructionOptions;
}

export function MonacoEditor({
	content,
	onChange,
	language = "typescript",
	height = "400px",
	options = {},
}: MonacoEditorProps) {
	const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
	const monacoRef = useRef<typeof Monaco | null>(null);
	const [isEditorReady, setIsEditorReady] = useState(false);
	const contentRef = useRef(content);
	const isUserEditingRef = useRef(false);

	// contentが変更されたときの処理
	useEffect(() => {
		// エディタが準備完了しており、かつユーザーが編集中でない場合のみ更新
		if (
			editorRef.current &&
			!isUserEditingRef.current &&
			content !== contentRef.current
		) {
			const currentValue = editorRef.current.getValue();
			if (content !== currentValue) {
				// カーソル位置を保存
				const position = editorRef.current.getPosition();

				// エディタの値を更新
				editorRef.current.setValue(content);
				contentRef.current = content;

				// カーソル位置を復元
				if (position) {
					editorRef.current.setPosition(position);
					editorRef.current.revealPositionInCenter(position);
				}
			}
		}
	}, [content]);

	// Monaco Editorがマウントされたときの処理
	const handleEditorDidMount = (
		editor: Monaco.editor.IStandaloneCodeEditor,
		monaco: typeof Monaco
	) => {
		editorRef.current = editor;
		monacoRef.current = monaco;
		setIsEditorReady(true);
		contentRef.current = content;

		// TypeScriptのコンパイラオプションを設定
		if (monaco.languages.typescript) {
			monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
				target: monaco.languages.typescript.ScriptTarget.ES2016,
				allowNonTsExtensions: true,
				moduleResolution:
					monaco.languages.typescript.ModuleResolutionKind.NodeJs,
				module: monaco.languages.typescript.ModuleKind.CommonJS,
				jsx: monaco.languages.typescript.JsxEmit.React,
				noEmit: true,
				allowJs: true,
				esModuleInterop: true,
				typeRoots: ["node_modules/@types"],
				lib: ["es2016", "dom"],
			});
			monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
				{
					noSemanticValidation: false,
					noSyntaxValidation: false,
				}
			);
		}

		// 基本的なモジュールの型解決を試みる
		const loadTypes = async () => {
			try {
				if (monaco.languages.typescript) {
					// Reactの型定義を追加
					const reactTypes = `
					declare module "react" {
						export interface Component {}
						export interface FC<P = {}> {}
						export interface ReactElement {}
						export function createElement(type: string | React.JSXElementConstructor<any>, props?: Record<string, unknown>, ...children: React.ReactNode[]): React.ReactElement | null;
						export function useState<T>(initialState: T): [T, (newState: T) => void];
						export function useEffect(effect: () => void | (() => void), deps?: React.DependencyList): void;
					}
					`;

					monaco.languages.typescript.typescriptDefaults.addExtraLib(
						reactTypes,
						"file:///node_modules/@types/react/index.d.ts"
					);
				}
			} catch (error) {
				console.error("型の読み込みに失敗しました:", error);
			}
		};

		loadTypes();
	};

	useEffect(() => {
		// エディタが読み込まれたら、変更をonChangeに伝える
		if (editorRef.current) {
			const disposable = editorRef.current.onDidChangeModelContent(() => {
				isUserEditingRef.current = true;
				const value = editorRef.current?.getValue() || "";
				contentRef.current = value;
				onChange(value);

				// ユーザー編集フラグをリセット（次のレンダリングサイクルで）
				setTimeout(() => {
					isUserEditingRef.current = false;
				}, 0);
			});

			return () => {
				disposable.dispose();
			};
		}
	}, [onChange, isEditorReady]);

	// デフォルトオプションとマージ
	const editorOptions = {
		minimap: { enabled: false },
		scrollBeyondLastLine: false,
		automaticLayout: true,
		tabSize: 2,
		fontSize: 14,
		...options,
	};

	return (
		<div className="border rounded-md overflow-hidden">
			<MonacoEditorComponent
				height={height}
				language={language}
				value={content}
				onMount={handleEditorDidMount}
				options={editorOptions}
				className="min-h-[150px]"
			/>
		</div>
	);
}
