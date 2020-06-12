const { AuthenticationError, ValidationError, ForbiddenError } = require('apollo-server-express')

module.exports = {
  notes: async (parent, args, { models }, info) => await models.Note.find({}),

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
    return await models.User.find({})
  },

  me: async (parent, args, { models, user }, info) => {
    return await models.User.findById(user.id)
  }
}