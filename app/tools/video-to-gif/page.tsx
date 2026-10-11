import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import VideoToGif from "@/components/tools/video-to-gif";

export const metadata = toolMetadata("video-to-gif");

export default function Page() {
  return (
    <ToolLayout slug="video-to-gif">
      <VideoToGif />
    </ToolLayout>
  );
}
