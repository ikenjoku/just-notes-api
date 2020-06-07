const {
  gql
} = require('apollo-server-express')

const typeDefs = gql `
  scalar DateTime

  type User {
    id: ID!,
    username: String!,
    email: String!,
    avatar: String!
    notes: [Note]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Note {
    id: ID!
    content: String!
    author: User!
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
    signUp(email: String!, password: String!, username: String!): String!
    signIn(email: String, password: String!, username: String): String!
  }
`

module.exports = typeDefs