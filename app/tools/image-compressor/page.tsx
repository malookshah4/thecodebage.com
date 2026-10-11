import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import ImageCompressor from "@/components/tools/image-compressor";

export const metadata = toolMetadata("image-compressor");

export default function Page() {
  return (
    <ToolLayout slug="image-compressor">
      <ImageCompressor />
    </ToolLayout>
  );
}
