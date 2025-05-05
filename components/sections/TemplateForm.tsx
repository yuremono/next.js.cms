"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { EnhancedTextarea } from "../ui/enhanced-textarea";
import { RichTextEditor } from "../ui/editor";
import { PageTemplate } from "@/types";

const templateSchema = z.object({
	title: z.string().min(1, "必須項目です"),
	slug: z
		.string()
		.min(1, "必須項目です")
		.regex(
			/^[a-z0-9-]+$/,
			"アルファベット小文字、数字、ハイフンのみ使用可能です"
		),
	description: z.string().optional(),
	content: z.string().min(1, "必須項目です"),
	meta_title: z.string().optional(),
	meta_description: z.string().optional(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

interface TemplateFormProps {
	initialData?: PageTemplate;
	onSubmit: (data: TemplateFormValues) => void;
	isSubmitting?: boolean;
}

export function TemplateForm({
	initialData,
	onSubmit,
	isSubmitting = false,
}: TemplateFormProps) {
	const [content, setContent] = useState(initialData?.content || "");

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<TemplateFormValues>({
		resolver: zodResolver(templateSchema),
		defaultValues: {
			title: initialData?.title || "",
			slug: initialData?.slug || "",
			description: initialData?.description || "",
			content: initialData?.content || "",
			meta_title: initialData?.meta_title || "",
			meta_description: initialData?.meta_description || "",
		},
	});

	const onSubmitForm = (data: TemplateFormValues) => {
		// コンテンツをフォームデータに追加
		data.content = content;
		onSubmit(data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="title">タイトル</Label>
				<Input id="title" {...register("title")} />
				{errors.title && (
					<p className="text-red-500 text-sm">
						{errors.title.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="slug">スラッグ</Label>
				<Input id="slug" {...register("slug")} />
				{errors.slug && (
					<p className="text-red-500 text-sm">
						{errors.slug.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">説明</Label>
				<EnhancedTextarea
					id="description"
					{...register("description")}
				/>
				{errors.description && (
					<p className="text-red-500 text-sm">
						{errors.description.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="content">コンテンツ</Label>
				<RichTextEditor
					content={content}
					onChange={(value) => {
						setContent(value);
						setValue("content", value, { shouldValidate: true });
					}}
				/>
				{errors.content && (
					<p className="text-red-500 text-sm">
						{errors.content.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="meta_title">メタタイトル</Label>
				<Input id="meta_title" {...register("meta_title")} />
				{errors.meta_title && (
					<p className="text-red-500 text-sm">
						{errors.meta_title.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="meta_description">メタディスクリプション</Label>
				<EnhancedTextarea
					id="meta_description"
					{...register("meta_description")}
				/>
				{errors.meta_description && (
					<p className="text-red-500 text-sm">
						{errors.meta_description.message}
					</p>
				)}
			</div>

			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? "保存中..." : "保存"}
			</Button>
		</form>
	);
}
