const express = require('express')
const {
  ApolloServer,
  gql
} = require('apollo-server-express')
const notes = require('./data/notes')

const app = express()
const port = process.env.PORT || 1414

const typeDefs = gql `
  type Note {
    id: ID!
    content: String!
    author: String!
  }

  type Query {
    hello: String
    notes: [Note]!
  }
`

const resolvers = {
  Query: {
    hello: () => 'still Good to go',
    notes: () => notes
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
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