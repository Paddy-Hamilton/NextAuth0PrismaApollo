import React from 'react'
import { getCakeries } from 'utils/db'
import { useUser } from '@auth0/nextjs-auth0'
import Container from 'components/Container'
import Link from 'next/link'

const Index = ({ cakeries }) => {
  const { user } = useUser()

  return (
    <Container>
      <div>
        <div className="flex flex-wrap">
          {cakeries.map(({ name, slug }) => {
            return (
              <Link href={`/cakery/${slug}`} key={slug}>
                <a className="bg-white mx-2 my-2 text-gray-600 w-56 px-8 pt-8 pb-8 rounded-md relative">
                  <h1 className="">{name}</h1>
                </a>
              </Link>
            )
          })}
        </div>
      </div>
    </Container>
  )
}

export const getStaticProps = async () => {
  const data = await getCakeries()

  return {
    props: {
      cakeries: JSON.parse(JSON.stringify(data)),
    },
  }
}

export default Index
