import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import DarazFeeCalculator from "@/components/tools/daraz-fee-calculator";

export const metadata = toolMetadata("daraz-fee-calculator");

export default function Page() {
  return (
    <ToolLayout slug="daraz-fee-calculator">
      <DarazFeeCalculator />
    </ToolLayout>
  );
}
