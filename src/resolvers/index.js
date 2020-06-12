const {
  GraphQLDateTime
} = require('graphql-iso-date')
const Query = require('./query')
const Mutation = require('./mutation')
const User = require('./user.js')
const Note = require('./note.js')

module.exports = {
  Query,
  Mutation,
  Note,
  User,
  DateTime: GraphQLDateTime
}