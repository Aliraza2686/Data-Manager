const express = require('express')
const userRouter = require('./routes/user')
require('./db/db')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended : false}))
app.use(methodOverride('_method'))
app.use(cookieParser())

app.use(userRouter)


const port = 3000

app.listen(port, () => {
   console.log(`Server is running on port ${port}`)
})