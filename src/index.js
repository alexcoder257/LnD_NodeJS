const express = require('express')
const morgan = require('morgan')
const { engine } = require ('express-handlebars');
const path = require('path')
const app = express()
const port = 3000

// View static files
app.use(express.static(path.join(__dirname,'public')))

// Template Engine - Structure HTML
app.engine('.hbs', engine({extname:".hbs"}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,'resources/views'));

// HTTP Loger - Log message 
app.use(morgan('combined'))

app.get('/', (req, res) => {
  res.render('home');
})

app.get('/news', (req, res) => {
  res.render('news');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)

})
        