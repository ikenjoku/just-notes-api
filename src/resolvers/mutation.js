const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {
  AuthenticationError,
} = require('apollo-server-express')
require('dotenv').config()

const gravatar = require('../util/gravatar')
const {
  generateJWT,
  passwordEncrypt,
  validatePassword
} = require('../util/authHelpers')

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
  signUp: async (parent, {
    email,
    password,
    username
  }, {
    models
  }, info) => {
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
  }, {
    models
  }, info) => {
    try {
      if (email) {
        email = email.trim().toLowerCase()
      }
      if (username) {
        username = username.trim()
      }
      const user = await models.User.findOne({
        $or: [{
          email
        }, {
          username
        }]
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
      throw new AuthenticationError('Error signing in')
    }
  }
}