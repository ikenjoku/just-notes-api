const {
  gql
} = require('apollo-server-express')

const typeDefs = gql `
  scalar DateTime

  type Note {
    id: ID!
    content: String!
    author: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    notes: [Note]!
    note(id:ID!): Note!
  }

  type Mutation {
    newNote(content: String!): Note!
    updateNote(content: String!, id:ID!): Note!
    deleteNote(id: ID!): Boolean!
  }
`

module.exports = typeDefs