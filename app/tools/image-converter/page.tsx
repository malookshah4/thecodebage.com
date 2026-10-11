import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import ImageConverter from "@/components/tools/image-converter";

export const metadata = toolMetadata("image-converter");

export default function Page() {
  return (
    <ToolLayout slug="image-converter">
      <ImageConverter />
    </ToolLayout>
  );
}
