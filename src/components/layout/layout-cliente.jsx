import Navbar from './navbar'
import Footer from './footer'

export default function LayoutCliente({ children }) {
  return (
    <div className="layout-cliente">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
