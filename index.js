const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore  = require('session-file-store')(session)
const flash  =require('express-flash')
const conn = require('./db/conn')

const thoughtsRoutes = require('./routes/thoughtsRoutes')
const authRoutes = require('./routes/authRoutes')

const ThoughtController = require('./controllers/ThoughtController')

//Models
const Thought = require('./models/Thought')
const User = require('./models/User')

const app = express()

// Template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// Receive data's body
app.use(express.urlencoded({
  extended: true
}))

app.use(express.json())

// public path
app.use(express.static('public'))

// Session Middleware
app.use(
  session({
    name: 'session',
    secret: 'your_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function() {},
      path: require('path')
            .join(require('os')
            .tmpdir(), 'sessions'),
    }),
    cookie: {
      secure: false,
      maxAge: 360000,
      expires: new Date(Date.now() + 360000),
      httpOnly: true
    }
  }),
)

// flash messages
app.use(flash())

// set session to res
app.use((req, res, next) => {

  if(req.session.userId) {
    res.locals.session = req.session
  }

  next()
})

app.use('/thoughts', thoughtsRoutes)
app.use('/', authRoutes)

app.get('/', ThoughtController.showThoughts)


conn.sync({force: true})
    .then(() => {
      app.listen(3000)
      console.log('Server is running...')
    })
    .catch((err) => console.log(err))