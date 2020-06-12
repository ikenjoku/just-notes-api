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
    favorites: [Note]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Note {
    id: ID!
    author: User!
    content: String!
    favoriteCount: Int!
    favoritedBy: [User]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    me: User!,
    user(username: String!): User
    users: [User]!
    notes: [Note]!
    note(id:ID!): Note!
  }

  type Mutation {
    deleteNote(id: ID!): Boolean!
    toggleFavorite(id: ID!): Note!
    newNote(content: String!): Note!
    updateNote(content: String!, id:ID!): Note!
    signUp(email: String!, password: String!, username: String!): String!
    signIn(email: String, password: String!, username: String): String!
  }
`

module.exports = typeDefs