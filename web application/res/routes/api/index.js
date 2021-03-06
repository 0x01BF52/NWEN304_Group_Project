/**
 * api routes
 */
const router = require('express').Router();
const ProductQueries = require('../../dbQueries/products');
const UserQueries = require('../../dbQueries/users');

// products api endpoints
router.get('/products', async (req, res) => {
    const products = await ProductQueries.getRandomProducts(10);
    res.json(products);
});

router.get('/:productType', async (req, res) => {
    let productName = req.params.productType.charAt(0).toUpperCase();
    productName += req.params.productType.slice(1).toLowerCase();
    const products = await ProductQueries.getProductsByType(productName);

    if (products.length > 0) {
        res.json(products);
    } else {
        res.json('no products were found');
    }
});


// auth api endpoints
//POST Route for registration
router.post('/register', async (req, res) => {
    if (!req.body.email) {
        res.status(400).json({message: 'email paramter is missing'})
        return;
    }

    if (!req.body.password) {
        res.status(400).json({message: 'password paramter is missing'})
        return;
    }

    try {
        const result = await UserQueries.register(req.body.email, req.body.password);
        req.session.user = result;
        res.status(200).json({message: 'registration successful'});
    } catch (err) {
        if (err.message.includes("Email address exist")) {
            res.status(401).json({message: "Email address exist"});
        } else if (err.message.includes('password is too weak')) {
            res.status(401).json({message: "password is too weak"});
        } else {
            res.status(400).json({message: "something went wrong"});
        }
    }
});

//POST route for Login
router.post('/login', async (req, res) => {
    console.log("body: ",req.body)
    console.log("query: ",req.query)
    if (!req.body.email) {
        res.status(400).json({message: 'email parameter is missing'})
        return;
    }
    if (!req.body.password) {
        res.status(400).json({message: 'password parameter is missing'})
        return;
    }

    try {
        const result = await UserQueries.login(req.body.email, req.body.password);
        req.session.user = result;
        res.status(200).json({message: "login successful"});
    } catch (err) {
        if (err.message.includes("password doesn't match")) {
            res.status(401).json({message: "password doesn't match"});
        } else if (err.message.includes("no account exists with the given credentials")) {
            res.status(400).json({message: "no account exists with the given credentials"});
        } else {
            res.status(400).json({message: "something went wrong"});
        }
    }
})
router.post('api/')
module.exports = router;