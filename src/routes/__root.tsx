import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { CreateReportProvider } from "@/components/core/AddReports/CreateReportContext";
import { Providers } from "@/redux/Provider";
import "rsuite/dist/rsuite.css";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Providers>
        <React.Suspense>
          <CreateReportProvider>
            <Outlet />
            {/* <TanStackRouterDevtools position="bottom-right" /> */}
          </CreateReportProvider>
        </React.Suspense>
      </Providers>
      <Toaster richColors closeButton position="top-center" />
    </>
  );
}
