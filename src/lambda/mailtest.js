// Connect to our Mailgun API wrapper and instantiate it
// var API_KEY = 'YOUR_API_KEY';
// var DOMAIN = 'YOUR_DOMAIN_NAME';
var mailgun = require('mailgun-js')({
    // apiKey: process.env.MAILGUN_API_KEY,
    // domain: process.env.MAILGUN_DOMAIN
    apiKey: '0881732dfc49ca1d4d62d0cea428af51-060550c6-7765eb9d',
    domain: 'mail1.hexy.io'
})

// Response stuff
// const successCode = 200
// const errorCode = 400
// const headers = {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Headers': 'Content-Type'
// }

// Our cloud function
exports.handler = function() {
    //   let data = JSON.parse(event.body)
    //   let { name, email, subject, message } = data
    // let mailOptions = {
    //     from: 'Hexy Notifications <notifications@hexy.io>',
    //     to: ['joshuaiz@me.com', 'notifications@hexy.io'],
    //     replyTo: 'info@hexy.io',
    //     subject: 'Mailgun Test',
    //     text: 'Testing Mailgun awesomeness!'
    // }

    // It's really as simple as this,
    // directly from the Mailgun dashboard

    // mg.messages().send(mailOptions, (error, body) => {
    //     if (error) {
    //         console.log(error)
    //         callback(null, {
    //             errorCode,
    //             headers,
    //             body: JSON.stringify(error)
    //         })
    //     } else {
    //         console.log(body)
    //         callback(null, {
    //             successCode,
    //             headers,
    //             body: JSON.stringify(body)
    //         })
    //     }
    // })

    const data = {
        from: 'Hexy Notifications <notifications@hexy.io>',
        to: ['joshuaiz@me.com', 'notifications@hexy.io'],
        replyTo: 'info@hexy.io',
        subject: 'Mailgun Test',
        text: 'Simpler function test 1'
    }

    mailgun
        .messages()
        .send(data, (error, body) => {
            console.log(body)
        })
}
