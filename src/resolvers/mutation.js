const { AuthenticationError, ValidationError, ForbiddenError } = require('apollo-server-express')
const mongoose = require('mongoose')
require('dotenv').config()
const gravatar = require('../util/gravatar')
const {
  generateJWT,
  passwordEncrypt,
  validatePassword
} = require('../util/authHelpers')

module.exports = {
  newNote: async (parent, { content }, { models, user }, info) => {
    try {
      if (!user) {
        throw new AuthenticationError('Please sign in to create a note.')
      }
      return await models.Note.create({
        content,
        author: mongoose.Types.ObjectId(user.id)
      })
    } catch (error) {
      throw new AuthenticationError(error.message)
    }
  },

  updateNote: async (parent, { content, id }, { models, user }, info) => {
    try {
      if (!user) {
        throw new AuthenticationError('Please sign in to update a note.')
      }

      const noteToUpdate = await  models.Note.findById(id)

      if (!noteToUpdate) {
        throw new ValidationError('This note does not exist.')
      }

      if (noteToUpdate && String(noteToUpdate.author) !== user.id ) {
        throw new ForbiddenError("You're not allowed to perform this operation.")
      }

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
      throw new AuthenticationError(error.message)
    }
  },

  deleteNote: async (parent, { id }, { models, user }, info) => {
    try {
      if (!user) {
        throw new AuthenticationError('Please sign in to delete a note.')
      }

      const noteToDelete = await  models.Note.findById(id)

      if (!noteToDelete) {
        throw new ValidationError('This note does not exist')
      }

      if (noteToDelete && String(noteToDelete.author) !== user.id ) {
        throw new ForbiddenError("You're not allowed to perform this operation")
      }

      await models.Note.findOneAndDelete({ _id: id })
      return true
    } catch (error) {
      return false
    }
  },

  signUp: async (parent, {
    email,
    password,
    username
  }, { models }, info) => {
    email = email.trim().toLowerCase()
    const avatar = gravatar(email)
    try {
      const encryptedPassword = await passwordEncrypt(password)
      const newUser = await models.User.create({
        username,
        password: encryptedPassword,
        email,
        avatar
      })
      const token = await generateJWT(newUser)
      return token
    } catch (error) {
      throw new Error('Error creating account')
    }
  },

  signIn: async (parent, {
    email,
    password,
    username
  }, { models }, info) => {
    try {
      if (email) {
        email = email.trim().toLowerCase()
      }
      if (username) {
        username = username.trim()
      }
      if (!username && !email) {
        throw new AuthenticationError('Please provide your username or email address')
      }
      const user = await models.User.findOne({
        $or: [{ email }, { username }]
      })
      if (!user) {
        throw new AuthenticationError('User does not exist')
      }
      const isValidPassword = validatePassword(password, user.password)
      if (!isValidPassword) {
        throw new AuthenticationError('Invalid password')
      }
      delete user.password
      const token = await generateJWT(user)
      return token
    } catch (error) {
      throw new AuthenticationError(error.message)
    }
  },

  toggleFavorite: async (parent, { id }, { models, user }, info) => {
    try {
      if (!user) {
        throw new AuthenticationError('Please sign in to like a note')
      }

      const noteToFavorite = await models.Note.findById(id)
      if (!noteToFavorite) {
        throw new ValidationError('Note does not exist')
      }
      const isAlreadyFavoritedByUser = noteToFavorite.favoritedBy.includes(user.id)
      if (isAlreadyFavoritedByUser) {
        return await models.Note.findByIdAndUpdate({
          _id: id
        }, {
          $pull: { favoritedBy: mongoose.Types.ObjectId(user.id) },
          $inc: { favoriteCount: -1 }
        },{
          new: true
        })
      } else {
        return await models.Note.findByIdAndUpdate({
          _id: id
        },{
          $push: { favoritedBy: mongoose.Types.ObjectId(user.id) },
          $inc: { favoriteCount: 1 }
        }, {
          new: true
        })
      }
    } catch (error) {
      throw new Error(error.message)
    }
  },
}