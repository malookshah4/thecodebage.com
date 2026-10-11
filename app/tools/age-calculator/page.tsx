import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import AgeCalculator from "@/components/tools/age-calculator";

export const metadata = toolMetadata("age-calculator");

export default function Page() {
  return (
    <ToolLayout slug="age-calculator">
      <AgeCalculator />
    </ToolLayout>
  );
}
