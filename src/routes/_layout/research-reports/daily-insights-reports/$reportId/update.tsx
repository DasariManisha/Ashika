import CombineAdd from "@/components/core/AddReports/CombineAdd";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_layout/research-reports/daily-insights-reports/$reportId/update"
)({
  component: () => (
    <CombineAdd
      showCategory={true}
      showThumbnail={false}
      asset_group="research-reports"
      asset_type="daily-insights-reports"
    />
  ),
});
