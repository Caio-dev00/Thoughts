const User = require('../models/User')

const bcrypt = require('bcryptjs')

class AuthController {

  static login(req, res) {
    res.render('auth/login')
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } })

    if(!user) {
      req.flash('message', 'User not found!')
      res.render('auth/login')

      return
    }

    const passwordMatch = bcrypt.compareSync(password, user.password)

    if(!passwordMatch) {
      req.flash('message', 'Password invalid!')
      res.render('auth/login')

      return
    }
    
    req.session.userId = user.id
    req.flash('message', 'Login successful!')

    req.session.save(() => {
      res.redirect('/')
    })

  }

  static register(req, res) {
    res.render('auth/register')
  }

  static async registerPost(req, res) {
    
    const { name, email, password, confirmPassword } = req.body;

    // password match vilidation
    if(password != confirmPassword) {
      req.flash('message', 'The passwords didn`t match')
      res.render('auth/register')

      return;
    }

    // check if user exists
    const checkIfUserExistis = await User.findOne({ where: { email: email } })

    if(checkIfUserExistis) {

      req.flash('message', 'Email already has in use!')
      res.render('auth/register')

      return
    }

    // create a password
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    const user = {
      name,
      email,
      password: hashedPassword
    }

    try {

      const createdUser = await User.create(user)

      req.session.userId = createdUser.id
      req.flash('message', 'Account created with successful')

      req.session.save(() => {
        res.redirect('/')
      })
    
    } catch (error) {
      console.log(error)  
    }

  }

  static logout(req, res) {
    req.session.destroy()
    res.redirect('/login')
  }
}

module.exports = AuthController