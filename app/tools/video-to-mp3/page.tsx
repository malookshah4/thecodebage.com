import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import VideoToMp3 from "@/components/tools/video-to-mp3";

export const metadata = toolMetadata("video-to-mp3");

export default function Page() {
  return (
    <ToolLayout slug="video-to-mp3">
      <VideoToMp3 />
    </ToolLayout>
  );
}
