import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface TextGeneratorProps {
	prompt: string;
	generatedText: string;
	onSelect: (text: string) => void;
}

export function TextGenerator({
	prompt,
	generatedText,
	onSelect,
}: TextGeneratorProps) {
	return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="prompt">AIテキスト生成プロンプト</Label>
        <p id="prompt">{prompt}</p>
      </div>
      {generatedText && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="max-h-96 overflow-y-auto">
              <p className="whitespace-pre-wrap">{generatedText}</p>
            </div>
            <button
              onClick={() => onSelect(generatedText)}
              className="rounded bg-slate-700 px-4 py-2 font-medium text-white"
            >
              このテキストを使用
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
