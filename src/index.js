require('dotenv').config()
const db = require('./db')
const express = require('express')
const {
  ApolloServer
} = require('apollo-server-express')
const resolvers = require('./resolvers')
const typeDefs = require('./schema')
const models = require('./data/models')

const app = express()
const port = process.env.PORT || 1414
const DB_URL = process.env.DB_URL

db.connect(DB_URL)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {

    return {
      models
    }
  }
})

server.applyMiddleware({
  app,
  path: '/api'
})

app.listen({
  port
}, () => {
  console.log(`GraphQL Server Running: http://localhost:${port}${server.graphqlPath}`)
})