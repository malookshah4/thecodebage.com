import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import PercentageCalculator from "@/components/tools/percentage-calculator";

export const metadata = toolMetadata("percentage-calculator");

export default function Page() {
  return (
    <ToolLayout slug="percentage-calculator">
      <PercentageCalculator />
    </ToolLayout>
  );
}
