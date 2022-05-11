import type { NextPage } from 'next'
import Head from 'next/head'
import Footer from '../Footer'

const AppLayout: NextPage = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>FatToken TEST</title>
        <meta name="description" content="FatToken Test UI" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

export default AppLayout
