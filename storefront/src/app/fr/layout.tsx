import React from "react"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { CartDrawer } from "@/components/CartDrawer"

export default function FrLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="relative">{children}</main>
      <CartDrawer />
      <Footer />
    </>
  )
}
