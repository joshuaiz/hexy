var sendemail = require('sendemail')
var email = sendemail.email

var person = {
    name: 'Joshua',
    email: 'joshuaiz@me.com', // person.email can also accept an array of emails
    subject: 'Testing'
}

email('welcome', person, function(error, result) {
    console.log(' - - - - - - - - - - - - - - - - - - - - -> email sent: ')
    console.log(result)
    console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
})
