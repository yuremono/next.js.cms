"use client";

import { useState } from "react";
import { RichTextEditor } from "../ui/editor";
import { ImageUpload } from "../ImageUpload";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { FormSection } from "@/types";

interface FormEditorProps {
	section: FormSection;
	onUpdate: (section: FormSection) => void;
}

export function FormEditor({ section, onUpdate }: FormEditorProps) {
	const [html, setHtml] = useState(section.html);

	// セクションの更新を処理
	const handleUpdate = (key: keyof FormSection, value: any) => {
		onUpdate({
			...section,
			[key]: value,
		});
	};

	return (
		<div className="space-y-6">
			<Card className="p-4">
				<h3 className="text-lg font-medium mb-4">
					お問い合わせフォーム設定
				</h3>

				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="form-class">クラス名</Label>
						<Input
							id="form-class"
							value={section.class}
							onChange={(e) =>
								handleUpdate("class", e.target.value)
							}
							placeholder="例: contact-form-section py-8"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="form-endpoint">フォーム送信先URL</Label>
						<Input
							id="form-endpoint"
							value={section.endpoint}
							onChange={(e) =>
								handleUpdate("endpoint", e.target.value)
							}
							placeholder="例: /api/contact"
						/>
						<p className="text-xs text-gray-500">
							フォームデータの送信先URLを指定します。デフォルトは/api/contactです。
						</p>
					</div>

					<ImageUpload
						initialImage={section.bgImage}
						onImageChange={(url) => handleUpdate("bgImage", url)}
						label="背景画像"
					/>

					<div className="space-y-2">
						<Label>フォーム上部のコンテンツ</Label>
						<RichTextEditor
							content={html}
							onChange={(content) => {
								setHtml(content);
								handleUpdate("html", content);
							}}
							placeholder="ここにフォーム上部のHTMLを入力..."
						/>
					</div>

					<div className="mt-4 p-4 bg-gray-50 rounded border">
						<h4 className="font-medium mb-2">フォームプレビュー</h4>
						<div className="space-y-4">
							<div>
								<Label htmlFor="preview-name">お名前</Label>
								<Input
									id="preview-name"
									placeholder="山田 太郎"
									disabled
								/>
							</div>
							<div>
								<Label htmlFor="preview-email">
									メールアドレス
								</Label>
								<Input
									id="preview-email"
									placeholder="example@example.com"
									disabled
								/>
							</div>
							<div>
								<Label htmlFor="preview-message">
									メッセージ
								</Label>
								<textarea
									id="preview-message"
									className="w-full p-2 border rounded"
									rows={4}
									placeholder="お問い合わせ内容をご記入ください"
									disabled
								></textarea>
							</div>
							<div className="flex items-center">
								<input
									type="checkbox"
									id="preview-privacy"
									className="mr-2"
									disabled
								/>
								<Label htmlFor="preview-privacy">
									プライバシーポリシーに同意する
								</Label>
							</div>
							<button
								className="px-4 py-2 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
								disabled
							>
								送信
							</button>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}
 