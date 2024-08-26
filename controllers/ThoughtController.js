const Thought = require('../models/Thought')
const User = require('../models/User')

class ThoughtController {
  static async showThoughts(req, res) {
    res.render('thoughts/home')
  }
}

module.exports = ThoughtController