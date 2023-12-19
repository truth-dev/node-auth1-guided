const express = require("express")
const bcrypt = require("bcryptjs")
const router = express.Router()
const User = require("../users/users-model.js")

router.post('/register',  async (req, res, next) => {
  try{
    const {username, password} = req.body
    const hash = bcrypt.hashSync(password, 8) //a2 ^ 8 = a2a2a2a2a2a2a2
      const newUser = {username, password: hash}
      const result = await User.add(newUser)
      res.status(201).json({
        message: `Welcome, its a pleasure, ${result.username}`
      })
  }catch (err) {
   next(err)
  }
 })
router.post('/login', async (req, res, next) => {
  try{
    const {username, password} = req.body
    const [user] = await User.findBy({username})
    if(user && bcrypt.compareSync(password, user.password))
    {
      req.session.user = user
      res.json({message:`welecome back, ${user.username}`})
    }else{
      next({status: 401, message: 'crappy credentials'})
    }
  }catch(err){
    next(err)
  }
})
router.get('/logout', async (req, res, next) => {
   if(req.session.user){
    const {username} = req.session.user
    req.session.destroy(err => {
      if(err){
        res.json({message: `you may not ever leave, ${username}`})  
      }else{
        res.json({messsage: `is it time for you to leave, ${username}`})
      }
    })
       }else{
         res.json({message: 'Sorry, Have we met before?'})
       }
     next()
    
})
module.exports = router 