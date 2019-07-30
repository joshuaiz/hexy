const stripe = require('stripe')('sk_test_J64K8W5GbdDHGXaYuq9MT7Xy') // add your secret key here

exports.handler = (event, context, callback) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return callback(null, { statusCode: 405, body: 'Method Not Allowed' })
    }

    // console.log('called')

    const data = JSON.parse(event.body)

    // console.log('charge.js', data)

    const accountType = data.desc.toUpperCase()

    if (!data.token || parseInt(data.amount) < 1) {
        return callback(null, {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Some required fields were not supplied.'
            })
        })
    }

    const token = data.token

    ;(async () => {
        const charge = await stripe.charges
            .create({
                amount: data.amount,
                currency: 'usd',
                description: data.desc,
                source: token,
                receipt_email: data.email,
                statement_descriptor: `HEXYIO*${accountType}`,
                metadata: {
                    email: data.email
                }
            })
            .then(({ status }) => {
                return callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({ status })
                })
            })
            .catch(err => {
                console.log('reached error in charge.js')
                return callback(null, {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: `Error: ${err.message}`
                    })
                })
            })
    })()
}
