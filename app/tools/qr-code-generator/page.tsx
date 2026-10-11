import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import QrCodeGenerator from "@/components/tools/qr-code-generator";

export const metadata = toolMetadata("qr-code-generator");

export default function Page() {
  return (
    <ToolLayout slug="qr-code-generator">
      <QrCodeGenerator />
    </ToolLayout>
  );
}
