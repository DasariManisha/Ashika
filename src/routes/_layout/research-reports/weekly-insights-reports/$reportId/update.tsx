import CombineAdd from "@/components/core/AddReports/CombineAdd";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_layout/research-reports/weekly-insights-reports/$reportId/update"
)({
  component: () => (
    <CombineAdd
      showCategory={false}
      showThumbnail={false}
      asset_group="research-reports"
      asset_type="weekly-insights-reports"
    />
  ),
});
