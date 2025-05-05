"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const settingsSchema = z.object({
	site_name: z.string().min(1, "必須項目です"),
	site_description: z.string().optional(),
	openai_api_key: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		reset,
	} = useForm<SettingsFormValues>({
		resolver: zodResolver(settingsSchema),
		defaultValues: {
			site_name: "",
			site_description: "",
			openai_api_key: "",
		},
	});

	// 設定を取得
	useEffect(() => {
		const fetchSettings = async () => {
			try {
				// ここでは仮の実装として、ブラウザのローカルストレージから設定を取得
				const siteNameFromStorage =
					localStorage.getItem("site_name") || "";
				const siteDescriptionFromStorage =
					localStorage.getItem("site_description") || "";
				// APIキーは安全のためマスクして表示
				const openaiApiKeyFromStorage = localStorage.getItem(
					"openai_api_key"
				)
					? "************" // マスク表示
					: "";

				reset({
					site_name: siteNameFromStorage,
					site_description: siteDescriptionFromStorage,
					openai_api_key: openaiApiKeyFromStorage,
				});
			} catch (err) {
				console.error("設定の取得に失敗しました", err);
			}
		};

		fetchSettings();
	}, [reset]);

	// 設定を保存
	const onSubmit = async (data: SettingsFormValues) => {
		setIsSubmitting(true);
		setIsSaved(false);
		setError(null);

		try {
			// ここでは仮の実装として、ブラウザのローカルストレージに設定を保存
			localStorage.setItem("site_name", data.site_name);

			if (data.site_description) {
				localStorage.setItem("site_description", data.site_description);
			}

			// APIキーが変更された場合のみ保存（マスクされていない場合）
			if (data.openai_api_key && !data.openai_api_key.includes("*")) {
				localStorage.setItem("openai_api_key", data.openai_api_key);
			}

			setIsSaved(true);

			// APIキーをマスク表示に戻す
			if (data.openai_api_key && !data.openai_api_key.includes("*")) {
				setValue("openai_api_key", "************");
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "エラーが発生しました"
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">設定</h1>

			{error && (
				<div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-600">
					{error}
				</div>
			)}

			{isSaved && (
				<div className="bg-green-50 border border-green-200 p-4 rounded-md text-green-600">
					設定が保存されました
				</div>
			)}

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
				<Card className="p-6">
					<h2 className="text-xl font-medium mb-4">サイト設定</h2>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="site_name">サイト名</Label>
							<Input id="site_name" {...register("site_name")} />
							{errors.site_name && (
								<p className="text-red-500 text-sm">
									{errors.site_name.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="site_description">
								サイトの説明
							</Label>
							<Input
								id="site_description"
								{...register("site_description")}
							/>
							{errors.site_description && (
								<p className="text-red-500 text-sm">
									{errors.site_description.message}
								</p>
							)}
						</div>
					</div>
				</Card>

				<Card className="p-6">
					<h2 className="text-xl font-medium mb-4">APIキー設定</h2>
					<p className="text-gray-500 mb-4">
						AI機能を使用するには、OpenAI APIキーが必要です。
					</p>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="openai_api_key">
								OpenAI APIキー
							</Label>
							<Input
								id="openai_api_key"
								type="password"
								{...register("openai_api_key")}
								placeholder="sk-..."
							/>
							{errors.openai_api_key && (
								<p className="text-red-500 text-sm">
									{errors.openai_api_key.message}
								</p>
							)}
							<p className="text-xs text-gray-500">
								APIキーは安全に保管され、AIテキスト生成にのみ使用されます。
							</p>
						</div>
					</div>
				</Card>

				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "保存中..." : "設定を保存"}
				</Button>
			</form>
		</div>
	);
}
