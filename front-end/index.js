const express = require('express')
const router = require('./routes/route')
const app = express()

/*.use is a middleware used mostly to manipulate the requests
    - use(express.json()) parses incoming requests with JSON payloads and is based on body-parser, returning an Object
    - use(express.static('public')) makes express able to read files like .css and .hbs
  .set is a function used  in this case to configure the behavior of the server
    - set('views', 'views') is a configuration variable that sets folder from which express will grab templates.
    - set('view engine', 'hbs') to setup hbs view engine
*/
app.use(express.urlencoded({
    extended: false
}))
app.use(express.json())
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'hbs')

app.use('/', router)

/* If the user tries to access a nonexistent route, '404.hbs' is shown*/
app.use(function (req, res, next) {
    res.status(404).render('404') 
})

app.listen(3000, () => {
    console.log('Server working!')
})
