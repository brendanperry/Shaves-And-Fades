const Api = require('../javascript/api');

module.exports = {
    charge: charge,
    checkout: checkout,
}

async function charge(req, res) {
    try {
        const stripe = require('stripe')("sk_test_51HsZ8ND4ypkbyKItVIuZGst4qJomJ4yb7P03zNOjv0gJm6XSlOvNIXTUYwy9xQ4KWFlwkfhTdzHiMMkoiYs56olv001o6kkat8");
        const sessionId = req.query.session_id;
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const key = session.setup_intent;
        const intent = await stripe.setupIntents.retrieve(key);
        const payment_method = intent.payment_method;
        
        const customer = await stripe.customers.create({
            payment_method: payment_method,
            invoice_settings: {
            default_payment_method: payment_method,
            },
        });
        
        const charge = await stripe.charges.create({
            amount: 15,
            currency: 'usd',
            customer: customer.id,
        });
    
        return 200;
    } 
    catch (error) {
        return 500;
    }
}

async function checkout(req, res) {
    try 
    {
        const stripe = require('stripe')("sk_test_51HsZ8ND4ypkbyKItVIuZGst4qJomJ4yb7P03zNOjv0gJm6XSlOvNIXTUYwy9xQ4KWFlwkfhTdzHiMMkoiYs56olv001o6kkat8");
    
        let api = new Api();
        let domain = api.getDomain();
    
        const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'setup',
        success_url: domain + 'success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: domain + 'cancelled?session_id={CHECKOUT_SESSION_ID}',
        });
    
        res.send(session)
    }
    catch(error)
    {
        console.log(error)
    }
}