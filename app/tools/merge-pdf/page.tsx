import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import MergePdf from "@/components/tools/merge-pdf";

export const metadata = toolMetadata("merge-pdf");

export default function Page() {
  return (
    <ToolLayout slug="merge-pdf">
      <MergePdf />
    </ToolLayout>
  );
}
