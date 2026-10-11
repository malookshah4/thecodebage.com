import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import PasswordGenerator from "@/components/tools/password-generator";

export const metadata = toolMetadata("password-generator");

export default function Page() {
  return (
    <ToolLayout slug="password-generator">
      <PasswordGenerator />
    </ToolLayout>
  );
}
