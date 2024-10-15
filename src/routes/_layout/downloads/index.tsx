import Reports from "@/components/Reports";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/downloads/")({
  component: () => (
    <>
      <Reports
        asset_group={"downloads"}
        asset_type={"downloads"}
        asset_category={""}
      />
    </>
  ),
});
