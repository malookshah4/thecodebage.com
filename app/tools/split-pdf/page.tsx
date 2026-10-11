import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import SplitPdf from "@/components/tools/split-pdf";

export const metadata = toolMetadata("split-pdf");

export default function Page() {
  return (
    <ToolLayout slug="split-pdf">
      <SplitPdf />
    </ToolLayout>
  );
}
