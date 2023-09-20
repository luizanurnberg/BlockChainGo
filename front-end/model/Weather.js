/* - Defining that Weather has to receive 'data'
   - An array of errors was used by the teacher as one of the multiple ways to aware the user that something went wrong
*/
const Weather = function (data) {
    this.data = data
    this.errors = []
}

/*If the property can't be found in the object itself, the prototype is searched for the property. 
 - If still not found, an error will be pushed to errors array and used in the controller's function 'exports.getWeather' 
*/
Weather.prototype.validateUserInput = function () {
    if (this.data == "") {
        this.errors.push("Please enter a city name to access the application.")
    }
}

module.exports = Weather
