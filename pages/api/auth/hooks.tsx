import { createUser } from 'utils/db'

module.exports = async (req, res) => {
  const { email, secret, picture, email_verified } = JSON.parse(req.body)
  console.log({ email, picture, email_verified })
  if (secret === process.env.AUTH0_HOOK_SECRET) {
    try {
      console.log('creating user')
      await createUser({ email, picture, email_verified })
      res.send({ received: true })
    } catch (err) {
      console.log(err)
      res.send({ received: true })
    }
  } else {
    console.log('You forgot to send me your secret!')
    res.send('You forgot to send me your secret!')
  }
}
