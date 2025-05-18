import Image from "next/image";

const getImageUrl = (image: string | null): string => {
	if (!image) return "/images/no-image.png";
	return image.startsWith("http")
		? image
		: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${image}`;
};

// 仮のitemデータ（本来はfetch等で取得）
const item = {
	image: null,
	name: "サンプルアイテム",
};

export default function ItemPage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-4xl mx-auto">
				<div className="bg-white rounded-lg shadow-lg overflow-hidden">
					<div className="relative h-96">
						<Image
							src={getImageUrl(item.image)}
							alt={item.name}
							fill
							className="object-cover"
							priority
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
