require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const { ApolloServer } = require('apollo-server-express')
const deepthLimit = require('graphql-depth-limit')
const { createComplexityLimitRule } = require('graphql-validation-complexity')

const db = require('./db')
const typeDefs = require('./schema')
const models = require('./data/models')
const resolvers = require('./resolvers')
const {
  validateJWT
} = require('./util/authHelpers')

const app = express()
const port = process.env.PORT || 1414
const DB_URL = process.env.DB_URL

app.use(helmet())
app.use(cors())
db.connect(DB_URL)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [
    deepthLimit(5),
    createComplexityLimitRule(1000)
  ],
  context: async ({ req }) => {
    const token = req.headers.authorization
    const user = await validateJWT(token)

    return {
      models,
      user
    }
  }
})

server.applyMiddleware({ app, path: '/api' })
app.listen({ port }, () => {
  console.log(`GraphQL Server Running: http://localhost:${port}${server.graphqlPath}`)
})