// app/layout.tsx
import 'nextra-theme-docs/style.css'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import {  Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { FaTelegram } from 'react-icons/fa6'

export const metadata = {
  title: 'Panthart Documentation',
  description: 'Official documentation for the Panthart NFT marketplace',
  metadataBase: new URL('http://localhost:3000'), 
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
    projectLink="https://github.com/nippysky/Panthart-Docs"
    chatLink="https://t.me/DecentroneumGroupChat"
    chatIcon={<FaTelegram size={30}/>}
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
      <Head >
             <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/nippysky/Panthart-Docs"
          feedback={{
            content: null,
          }}
          editLink={null}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
