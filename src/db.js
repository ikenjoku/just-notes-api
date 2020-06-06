const mongoose = require('mongoose')

module.exports = {
  connect: DB_URL => {
    mongoose.set('useNewUrlParser', true)
    mongoose.set('useFindAndModify', false)
    mongoose.set('useCreateIndex', true)
    mongoose.set('useUnifiedTopology', true)

    mongoose.connect(DB_URL)
    mongoose.connection.on('connected', () => {
      console.log(`Successful db connection: ${DB_URL}`)
    })
    mongoose.connection.on('error', err => {
      console.error(err)
      console.log('Unable to estable db connection')
      process.exit()
    })
  },
  close: () => {
    mongoose.connection.close()
  }
}