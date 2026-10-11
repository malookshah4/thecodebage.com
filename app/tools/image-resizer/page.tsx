import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import ImageResizer from "@/components/tools/image-resizer";

export const metadata = toolMetadata("image-resizer");

export default function Page() {
  return (
    <ToolLayout slug="image-resizer">
      <ImageResizer />
    </ToolLayout>
  );
}
