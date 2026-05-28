import Navbar from './navbar'
import Footer from './footer'

export default function LayoutPublic({ children }) {
  return (
    <div className="layout-public">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
