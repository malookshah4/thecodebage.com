import { ToolLayout, toolMetadata } from "@/components/tools/tool-layout";
import LoanEmiCalculator from "@/components/tools/loan-emi-calculator";

export const metadata = toolMetadata("loan-emi-calculator");

export default function Page() {
  return (
    <ToolLayout slug="loan-emi-calculator">
      <LoanEmiCalculator />
    </ToolLayout>
  );
}
