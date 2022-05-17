import type { NextPage } from 'next'
import { getSession, GetSessionParams } from 'next-auth/react'
import Center from '../components/Center'
import Sidebar from '../components/Sidebar'

const Home: NextPage = () => {
  return (
    <div className="h-screen overflow-hidden bg-black">
      <main className="flex">
        <Sidebar />
        <Center />
      </main>

      <div>{/** Player */}</div>
    </div>
  )
}

export default Home

export async function getServerSideProps(context: GetSessionParams) {
  const session = await getSession(context)
  return {
    props: {
      session,
    },
  }
}
