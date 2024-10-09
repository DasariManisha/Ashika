import Reports from "@/components/Reports";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_layout/accl-reports/familirization-programmie"
)({
  component: () => (
    <Reports
      reportGroup={"accl-reports"}
      reportType={"familirization-programmie"}
      categoryType={""}
    />
  ),
});
