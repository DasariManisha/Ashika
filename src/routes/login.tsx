import LoginComponent from "@/components/auth/Login";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: () => (
    <div>
      <LoginComponent />
    </div>
  ),
});
