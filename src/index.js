const express = require('express')
const {
  ApolloServer,
  gql,
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
    note(id:ID!): Note!
  }

  type Mutation {
    newNote(content: String!): Note!
  }
`

const resolvers = {
  Query: {
    hello: () => 'still Good to go',
    notes: () => notes,
    note: (parent, args, context, info) => notes.find(note => note.id === args.id)
  },
  Mutation: {
    newNote: (parent, args, context, info) => {
      const newNote = {
        id: String(notes.length + 1),
        content: args.content,
        author: 'Ike Njoku'
      }
      notes.push(newNote)
      return newNote
    }
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