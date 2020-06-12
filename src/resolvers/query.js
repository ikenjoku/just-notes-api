const { AuthenticationError, ValidationError, ForbiddenError } = require('apollo-server-express')

module.exports = {
  notes: async (parent, args, { models }, info) => await models.Note.find().limit(50),

  note: async (parent, { id }, { models }, info) =>{
    try {
      const note = await models.Note.findById(id)
      if (!note) {
        throw new ValidationError('This note does not exist.')
      }
      return note
    } catch (error) {
      throw new Error(error.message)
    }
  },

  user: async (parent, { username }, { models }, info) => {
    return await models.User.findOne({ username })
  },

  users: async (parent, args, { models }, info) => {
    return await models.User.find().limit(100)
  },

  me: async (parent, args, { models, user }, info) => {
    return await models.User.findById(user.id)
  },

  noteFeed: async (parent, { cursor, limit = 10 }, { models }, info) => {
    let hasNextPage = false
    let cursorQuery = {}
    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } }
    }
      let notes = await models.Note.find(cursorQuery)
      .sort({_id: -1})
      .limit(limit + 1)

      if(notes.length > limit) {
        hasNextPage = true
        notes = notes.slice(0, -1)
      }

      const newCursor = notes[notes.length - 1]._id

      return {
        notes,
        cursor: newCursor,
        hasNextPage
      }
  }
}