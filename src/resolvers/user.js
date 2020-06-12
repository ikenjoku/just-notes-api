module.exports = {
  notes: async (user, args, { models }, info) => {
    return await models.Note.find({ author: user._id })
    .sort({ _id: -1 })
  },
  favorites: async (user, args, { models }, info) => {
    return await models.Note.find({ favoritedBy: user._id })
    .sort({ _id: -1 })
  }
}