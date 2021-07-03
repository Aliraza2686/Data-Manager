const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
      email : {
          type: String,
          required : true,
          trim : true,
          unique : true,
          validate(value) {
              if(!validator.isEmail(value)) {
                  throw new Error('invalid email')
              }
          }
      },
      password : {
          type : String,
          required : true,
          trim : true
      }
})

const User = mongoose.model('User', userSchema)

module.exports = User