import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import UnitConverter from "@/components/tools/unit-converter";

export const metadata = toolMetadata("unit-converter");

export default function Page() {
  return (
    <ToolLayout slug="unit-converter">
      <UnitConverter />
    </ToolLayout>
  );
}
