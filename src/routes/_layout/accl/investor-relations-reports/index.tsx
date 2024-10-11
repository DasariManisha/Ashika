import Reports from "@/components/Reports";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_layout/accl/investor-relations-reports/"
)({
  component: () => (
    <Reports
      asset_group={"accl"}
      asset_type={"investor-relations-reports"}
      asset_category={""}
    />
  ),
});
