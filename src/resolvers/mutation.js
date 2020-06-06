module.exports = {
  newNote: async (parent, {
    content
  }, {
    models
  }, info) => {
    try {
      return await models.Note.create({
        content,
        author: 'Ike Njoku'
      })
    } catch (error) {
      console.log('Error creating note')
    }
  },
  updateNote: async (parent, {
    content,
    id
  }, {
    models
  }, info) => {
    try {
      return await models.Note.findOneAndUpdate({
        _id: id
      }, {
        $set: {
          content
        }
      }, {
        new: true
      })
    } catch (error) {
      console.log('Error updating note')
    }
  },
  deleteNote: async (parent, {
    id
  }, {
    models
  }, info) => {
    try {
      await models.Note.findOneAndDelete({
        _id: id
      })
      return true
    } catch (error) {
      return false
    }
  },
}