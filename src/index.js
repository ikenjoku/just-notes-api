require('dotenv').config()
const db = require('./db')
const express = require('express')
const {
  ApolloServer,
  gql
} = require('apollo-server-express')
const models = require('./data/models')

const app = express()
const port = process.env.PORT || 1414
const DB_URL = process.env.DB_URL

const typeDefs = gql `
  type Note {
    id: ID!
    content: String!
    author: String!
  }

  type Query {
    hello: String
    notes: [Note]!
    note(id:ID!): Note!
  }

  type Mutation {
    newNote(content: String!): Note!
  }
`

const resolvers = {
  Query: {
    hello: () => 'still Good to go',
    notes: async () => await models.Note.find({}),
    note: async (parent, args, context, info) => await models.Note.findById(args.id)
  },
  Mutation: {
    newNote: async (parent, args, context, info) => {
      return await models.Note.create({
        content: args.content,
        author: 'Ike Njoku'
      })
    }
  }
}

db.connect(DB_URL)

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