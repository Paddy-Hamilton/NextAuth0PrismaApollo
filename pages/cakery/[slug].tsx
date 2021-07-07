import React from 'react'
import { getCakeries, getCakeryBySlug } from 'utils/db'
import Container from 'components/Container'

const CakeryPage = ({ cakeries: { name, description } }) => {
  return (
    <Container>
      <div className="bg-white text-gray-600 w-full px-8 pt-8 pb-8 rounded-md relative">
        <h2 className="text-3xl">{name}</h2>
        <p>{description}</p>
      </div>
    </Container>
  )
}

export const getStaticPaths = async () => {
  const cakeries = await getCakeries()

  const paths = cakeries.map(({ slug }) => ({
    params: {
      slug,
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const { slug } = params

  console.log(slug)

  const cakeries = await getCakeryBySlug(slug)

  return {
    props: {
      cakeries: JSON.parse(JSON.stringify(cakeries)),
    },
  }
}

export default CakeryPage
