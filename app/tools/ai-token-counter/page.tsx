import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import AiTokenCounter from "@/components/tools/ai-token-counter";

export const metadata = toolMetadata("ai-token-counter");

export default function Page() {
  return (
    <ToolLayout slug="ai-token-counter">
      <AiTokenCounter />
    </ToolLayout>
  );
}
