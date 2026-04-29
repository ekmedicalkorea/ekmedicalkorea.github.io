import { HashRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'

import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ProductsPage from './pages/ProductsPage'
import CartPage from './pages/CartPage'
import OrderPage from './pages/OrderPage'

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <CartProvider>
          <div className="bg-[#f5f6f8] min-h-screen overflow-x-hidden">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order" element={<OrderPage />} />
            </Routes>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  )
}
