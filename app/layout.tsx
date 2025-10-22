// app/layout.tsx
import 'nextra-theme-docs/style.css'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import {  Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'

export const metadata = {
  title: 'Panthart Documentation',
  description: 'Official documentation for the Panthart NFT marketplace',
  metadataBase: new URL('http://localhost:3000'), // change to your prod URL at deploy time
  openGraph: {
    title: 'Panthart Documentation',
    images: ['/og-image.png'],
  },
  icons: { icon: '/favicon.ico' }
}


// Navbar with logo + external links
const navbar = (
  <Navbar
    logo={
      <div style={{display: 'flex', alignItems: "center", gap: "0.5rem"}}>
        <img src="/logo.png" alt="Panthart" width={30} height={30} />
        <b>Panthart Documentation</b>
      </div>
    }
    projectLink="https://github.com/nippysky/Panthart-Marketplace"
    chatLink="https://t.me/your-telegram" // update if you want
  />
)

// Footer
const footer = (
  <Footer>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <span>© {new Date().getFullYear()} Panthart</span>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <a href="/governance-and-policies/terms-and-conditions">Terms & Condition</a>
      </div>
    </div>
  </Footer>
)

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/nippysky/panthart-docs/blob/main"  // update once you push the docs repo
          feedback={{
            content: 'Question? Give us feedback ↗',
            labels: 'docs,feedback'
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
