import "./global.css"
import { Inter } from "next/font/google"
// import { Toaster } from "./app/components/ui/use-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Centrion - Context-Aware Security Surveillance",
  description: "AI-powered surveillance system that understands context rather than just recording footage",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {/* <Toaster /> */}
      </body>
    </html>
  )
}