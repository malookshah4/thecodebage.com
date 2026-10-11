import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import WordCounter from "@/components/tools/word-counter";

export const metadata = toolMetadata("word-counter");

export default function Page() {
  return (
    <ToolLayout slug="word-counter">
      <WordCounter />
    </ToolLayout>
  );
}
