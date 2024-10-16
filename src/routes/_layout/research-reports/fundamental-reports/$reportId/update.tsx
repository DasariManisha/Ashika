import CombineAdd from "@/components/core/AddReports/CombineAdd";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_layout/research-reports/fundamental-reports/$reportId/update"
)({
  component: () => (
    <CombineAdd
      showThumbnail={false}
      asset_group="research-reports"
      asset_type="fundamental-reports"
    />
  ),
});
