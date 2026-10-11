import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import ImageToText from "@/components/tools/image-to-text";

export const metadata = toolMetadata("image-to-text");

export default function Page() {
  return (
    <ToolLayout slug="image-to-text">
      <ImageToText />
    </ToolLayout>
  );
}
