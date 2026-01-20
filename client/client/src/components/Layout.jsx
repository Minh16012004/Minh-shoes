import Header from './Header/Header'
import Footer from './Footer'
import Chatbot from './Chatbot';
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
       <Chatbot />
    </>
  )
}
