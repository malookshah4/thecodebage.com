import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import CurrencyConverter from "@/components/tools/currency-converter";

export const metadata = toolMetadata("currency-converter");

export default function Page() {
  return (
    <ToolLayout slug="currency-converter">
      <CurrencyConverter />
    </ToolLayout>
  );
}
