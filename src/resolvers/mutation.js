module.exports = {
  newNote: async (parent, args, {
    models
  }, info) => {
    return await models.Note.create({
      content: args.content,
      author: 'Ike Njoku'
    })
  }
}