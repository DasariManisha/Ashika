import CombineAdd from "@/components/core/AddReports/CombineAdd";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/downloads/$reportId/update")({
  component: () => (
    <CombineAdd
      showThumbnail={false}
      showCategory={false}
      showYear={false}
      showMonth={false}
      asset_group="downloads"
      asset_type="downloads"
    />
  ),
});
