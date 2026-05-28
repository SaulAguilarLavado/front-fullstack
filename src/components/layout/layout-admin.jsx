import SidebarAdmin from './sidebar-admin'

export default function LayoutAdmin({ children }) {
  return (
    <div className="layout-admin">
      <SidebarAdmin />
      <main>{children}</main>
    </div>
  )
}
