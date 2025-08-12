import { Section, isSection } from "@/types";
import { MainVisualEditor } from "@/components/sections/MainVisualEditor";
import { ImgTextEditor } from "@/components/sections/ImgTextEditor";
import { CardsEditor } from "@/components/sections/CardsEditor";
import { FormEditor } from "@/components/sections/FormEditor";
import { GroupEditor } from "@/components/sections/GroupEditor";
import { DescListEditor } from "@/components/sections/DescListEditor";import { Alert } from "@/components/ui/alert";
import { HtmlContentEditor } from "@/components/sections/HtmlContentEditor";

interface SectionEditorRendererProps {
  section: Section;
  onUpdate: (section: Section) => void;
}

export function SectionEditorRenderer({
  section,
  onUpdate,
}: SectionEditorRendererProps) {
  // 型ガードで不正データを排除
  if (!isSection(section)) {
    return (
      <div className="SectionEditorRenderer">
        <Alert variant="destructive">
          <p>不正なセクションデータです</p>
        </Alert>
      </div>
    );
  }

  // セクションタイプに応じたエディタコンポーネントを表示
  switch (section.layout) {
    case "mainVisual":
      return (
        <div className="SectionEditorRenderer">
          <MainVisualEditor section={section} onUpdate={onUpdate} />
        </div>
      );
    case "imgText":
      return (
        <div className="SectionEditorRenderer">
          <ImgTextEditor section={section} onUpdate={onUpdate} />
        </div>
      );
    case "cards":
      return (
        <div className="SectionEditorRenderer">
          <CardsEditor section={section} onUpdate={onUpdate} />
        </div>
      );
    case "form":
      return (
        <div className="SectionEditorRenderer">
          <FormEditor section={section} onUpdate={onUpdate} />
        </div>
      );
    case "descList":
      return (
        <div className="SectionEditorRenderer">
          <DescListEditor section={section} onUpdate={onUpdate} />
        </div>
      );
    case "htmlContent":
      return (
        <div className="SectionEditorRenderer">
          <HtmlContentEditor section={section} onUpdate={onUpdate} />
        </div>
      );
    case "group-start":
      return (
        <div className="SectionEditorRenderer">
          <GroupEditor section={section} onUpdate={onUpdate} />
        </div>
      );
    case "group-end":
      return <div className="SectionEditorRenderer"></div>;
    default:
      return (
        <div className="SectionEditorRenderer">
          <Alert variant="destructive">
            <p>
              未知のセクションタイプです:{" "}
              {(section as { layout?: string })?.layout ?? "不明"}
            </p>
          </Alert>
        </div>
      );
  }
}
