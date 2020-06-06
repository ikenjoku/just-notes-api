const express = require('express')

const app = express()
const port = process.env.PORT || 1414

app.get('/', (req, res) => {
  res.send('Good to go')
})

app.listen(port, () => {
  console.log(`Running: listening on port ${port}`)
})