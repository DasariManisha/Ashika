import AddUser from '@/components/Users/AddUsers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/users/add/')({
  component: () => 
  <div>
    <AddUser />
  </div>,
})
