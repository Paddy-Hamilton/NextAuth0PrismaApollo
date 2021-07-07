import React from 'react'
import Container from 'components/Container'
import Link from 'next/link'
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { PrismaClient, User, Cakery } from '@prisma/client'

const DashboardPage = ({
  dbUser,
}: {
  dbUser:
    | (User & {
        cakery: Cakery | null
      })
    | null
}) => {
  if (!dbUser) {
    ;<Container>
      <div className="bg-white w-full text-gray-600 p-8">
        <h2 className="text-3xl font-md my-2">Please log in</h2>
      </div>
    </Container>
  }
  return (
    <Container>
      <div className="bg-white w-full text-gray-600 p-8">
        <h2 className="text-3xl font-md my-2">Subscription</h2>
        <button
          className="mx-4 bg-blue-400 text-white px-4 py-2 rounded mt-2"
          onClick={() => {
            console.log('click')
          }}
        >
          Manage subscription
        </button>
        <h2 className="text-3xl font-md mt-4 mb-2">Purchased courses</h2>
      </div>
    </Container>
  )
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, res, params }) {
    const session = await getSession(req, res)

    const prisma = new PrismaClient()
    if (!session) {
      return {
        props: {
          dbUser: undefined,
        },
      }
    }
    const dbUser = await prisma.user.findUnique({
      where: {
        email: session.user.email || '',
      },
      include: {
        cakery: true,
      },
    })

    await prisma.$disconnect()

    return {
      props: {
        dbUser: JSON.parse(JSON.stringify(dbUser)),
      },
    }
  },
})

export default DashboardPage
