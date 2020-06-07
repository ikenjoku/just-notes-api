const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()


const passwordEncrypt = async (password, saltRounds = 10) => {
  return await bcrypt.hash(password, saltRounds)
}

const validatePassword = async (plainTextPassword, hashedPassword) => {
  return await bcrypt.compare(plainTextPassword, hashedPassword)
}

const generateJWT = async user => {
  return await jwt.sign({
    id: user._id
  }, process.env.JWT_SECRET)
}

const validateJWT = async token => {
  if (token) {
    try {
      return await jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
      throw new Error('Invalid user')
    }
  }
}

module.exports = {
  passwordEncrypt,
  validatePassword,
  generateJWT,
  validateJWT
}