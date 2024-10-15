import Users from '@/components/Users'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute("/_layout/users/$userId/update")({
  component: () => (
    <Users />
  )
})
