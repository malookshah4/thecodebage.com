import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import ImagesToPdf from "@/components/tools/images-to-pdf";

export const metadata = toolMetadata("images-to-pdf");

export default function Page() {
  return (
    <ToolLayout slug="images-to-pdf">
      <ImagesToPdf />
    </ToolLayout>
  );
}
