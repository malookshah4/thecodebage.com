import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import AmazonFbaCalculator from "@/components/tools/amazon-fba-calculator";

export const metadata = toolMetadata("amazon-fba-calculator");

export default function Page() {
  return (
    <ToolLayout slug="amazon-fba-calculator">
      <AmazonFbaCalculator />
    </ToolLayout>
  );
}
