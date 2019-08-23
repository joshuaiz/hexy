// Connect to our Mailgun API wrapper and instantiate it
var mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
})

// Our cloud function
exports.handler = (event, context, callback) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return callback(null, { statusCode: 405, body: 'Method Not Allowed' })
    }

    const message = JSON.parse(event.body)

    let emailData = {
        email: message.email,
        displayName: message.displayName
    }

    let vars = {}
    vars[emailData.email] = emailData

    const data = {
        from: 'Hexy Notifications <notifications@hexy.io>',
        to: message.email,
        replyTo: 'no-reply@hexy.io',
        subject: 'Welcome to Hexy!',
        template: 'hexy_welcome',
        'o:tag': ['welcome'],
        'recipient-variables': vars,
        'v:email': '%recipient.displayName%',
        'v:displayName': '%recipient.email%'
    }

    mailgun.messages().send(data, (error, body) => {
        console.log(body)
        console.log(error)
    })
}
