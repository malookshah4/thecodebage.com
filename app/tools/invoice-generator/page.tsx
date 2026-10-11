import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import InvoiceGenerator from "@/components/tools/invoice-generator";

export const metadata = toolMetadata("invoice-generator");

export default function Page() {
  return (
    <ToolLayout slug="invoice-generator">
      <InvoiceGenerator />
    </ToolLayout>
  );
}
