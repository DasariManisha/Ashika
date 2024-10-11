import CombineAdd from "@/components/core/AddReports/CombineAdd";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_layout/accl/investor-relations-reports/add/"
)({
  component: () => (
    <CombineAdd
      showThumbnail={false}
      showYear={false}
      showMonth={false}
      asset_group="accl"
      asset_type="investor-relation-documents"
    />
  ),
});
