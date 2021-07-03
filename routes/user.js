const express = require('express')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const router = express.Router()
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const Task = require('../models/taskModel')

//user authentication Routes

router.get('/login', async(req, res) => {
       res.render('login')
 })

 router.get('/', async(req, res) => {
     res.render('register')
 })


router.post('/', async(req, res) => {
 
    console.log(req.body.email, req.body.password)
    const hashedPassword = await bcrypt.hash(req.body.password, 8)
    try {

        const user = await User.create({email : req.body.email, password :hashedPassword })
        res.redirect('/login')

    } catch(error) {

      console.log(error)
      res.redirect('/')
    }
})

router.post('/login', async(req, res) => {
    try {
       const user = await User.findOne({email : req.body.email})
       if(user) {
           const isMatch = await bcrypt.compare(req.body.password, user.password)
           if(!isMatch) {
              res.redirect('/login')
           }
           const token = jwt.sign({id : user._id}, 'secret token')
           res.cookie('jwt', token, {httpOnly : true})
           res.redirect('/dashboard')

       }
    }catch(error) {
        console.log(error)
        res.redirect('/login')
    }
})

//Dashboard 

router.get('/dashboard', auth , async(req, res) => {
    try {
       
    const tasks = await Task.find({user : req.user.id}).sort({
        createdAt : 'desc'
    })
    
    res.render('dashboard', {
        tasks : tasks
    })

   }catch(error) {
       res.redirect('/tasks/add')
   }
 })

//Task manager Routes

router.get('/tasks/add', auth ,async(req, res) => {
    res.render('addTask')
})

router.post('/tasks/add', auth ,async(req, res) => {

    try {
        req.body.user = req.user.id
        await Task.create(req.body)
       res.redirect('/dashboard')
    } catch(error){
       res.redirect('/error')
    } 
})

router.delete('/tasks/:id', auth ,async(req, res) => {
     try {
        const task = await Task.findByIdAndDelete(req.params.id)
        res.redirect('/dashboard')
     }catch(error) {
       res.redirect('/error404')
     }
 })

router.get('/tasks/edit/:id', auth ,async(req, res) => {
     
      const task = await Task.findById(req.params.id)
      res.render('editTask', {
          task : task
      })
 })

router.put('/tasks/edit/:id', auth ,async(req, res) => {
        const id = req.params.id
        const description = req.body.description
        const status = req.body.status
    try {
      const task = await Task.findByIdAndUpdate(id, {description, status}, {
          new : true,
          runValidators : true
      })
      await task.save()
      res.redirect('/dashboard')
    }catch(error) {
       res.redirect('/error404')
    }
 })

//logout route

router.get('/logout', auth ,async(req, res) => {
    res.cookie('jwt', '')
    res.redirect('/login')
})
module.exports = router