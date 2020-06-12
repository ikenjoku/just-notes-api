module.exports = {
  favoritedBy: async (note, args, { models }, info) => {
    return await models.User.find({ _id: { $in: note.favoritedBy } })
  },
  author: async (note, args, { models }, info) => {
    return await models.User.findById(note.author)
  }
}