module.exports = {
  notes: async (parent, args, {
    models
  }, info) => await models.Note.find({}),
  note: async (parent, args, {
    models
  }, info) => await models.Note.findById(args.id)
}