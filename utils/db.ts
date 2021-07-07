import { PrismaClient } from '@prisma/client'

const getCakeries = async () => {
  const prisma = new PrismaClient()
  const cakeries = await prisma.cakery.findMany()
  await prisma.$disconnect()
  return cakeries
}

const getCakeryBySlug = async (slug) => {
  const prisma = new PrismaClient()
  const cakery = await prisma.cakery.findUnique({
    where: {
      slug,
    },
  })
  await prisma.$disconnect()
  return cakery
}

const getCakery = async (id) => {
  const prisma = new PrismaClient()
  const cakery = prisma.cakery.findUnique({
    where: {
      id,
    },
  })
  await prisma.$disconnect()
  return cakery
}

const getUserByEmail = async (email) => {
  const prisma = new PrismaClient()
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      cakery: true,
    },
  })
  await prisma.$disconnect()
  return user
}

const createUser = async ({
  email,
  email_verified,
  picture = '',
}: {
  email: string
  picture: string
  email_verified: boolean
}) => {
  const prisma = new PrismaClient()
  const user = await prisma.user.create({
    data: { email, email_verified, picture, hasCakery: false },
  })
  await prisma.$disconnect()
  return user
}

export { getCakeries, getCakeryBySlug, getCakery, createUser, getUserByEmail }
