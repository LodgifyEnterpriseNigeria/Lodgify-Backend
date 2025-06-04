import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/account/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Account Page</h1>
      <ul>
        <li><a href="/admin/profile">Admin Profile</a></li>
        <li><a href="/admin/security">Security</a></li>
        <li><a href="/admin/account-actions">Other Account Related Actions</a></li>
      </ul>
    </div>
  );
}
