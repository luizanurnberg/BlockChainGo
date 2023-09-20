const axios = require('axios') /* Transform the request and response data */
const Weather = require('../model/Weather')
const API_KEY = 'YOUR API KEY' /* to get your API, go to 'http://api.openweathermap' */

/* Will render the home page depending in which route the user take*/
exports.renderHomePage = (req, res) => {
    res.render('index')
}

/*Main function for the application
    - First it sees if something was typed by the user
    - If so, then it makes a request to 'openweathermap' getting the information based on the wanted city and API_KEY used in this case
    - After that, .then and .catch are used to manipulate the information. If the request returns 'Request failed with status code 404' 
    the page '404.hbs' will appear 
      - If everything is okay, then the index will render and the current temperature its shown
*/
exports.searchWeather = (req, res) => {
    const weather = new Weather(req.body.city)
    weather.validateUserInput()

    if (weather.errors.length) {
        res.render('index', {
            error: weather.errors.toString()
        })
    } else {
        const city = req.body.city
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        axios.get(url).then((response) => {
            const { temp: temperature } = response.data.main
            const { name: location } = response.data
            res.render('index', {
                weather: `It's currently ${parseInt(temperature)} degrees in ${location}.`
            })
        }).catch((error) => {
            res.render('404')
            console.log(error)
        })
    }
}

/* Will render the about page depending in which route the user take*/
exports.renderAboutPage = (req, res) => {
    res.render("about")
}
