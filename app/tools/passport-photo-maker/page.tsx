import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import PassportPhotoMaker from "@/components/tools/passport-photo-maker";

export const metadata = toolMetadata("passport-photo-maker");

export default function Page() {
  return (
    <ToolLayout slug="passport-photo-maker">
      <PassportPhotoMaker />
    </ToolLayout>
  );
}
