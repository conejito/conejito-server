import app from './App'

const port = process.env.PORT || 3000

app.listen(port, () => {
  return console.log(`server is listening on ${port}`)
})