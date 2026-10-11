import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import WhatsAppLinkGenerator from "@/components/tools/whatsapp-link-generator";

export const metadata = toolMetadata("whatsapp-link-generator");

export default function Page() {
  return (
    <ToolLayout slug="whatsapp-link-generator">
      <WhatsAppLinkGenerator />
    </ToolLayout>
  );
}
