var express = require('express');
var router = express.Router();
const dbConnection = require('../config/database');
const { body } = require('express-validator');
const authentication = require('../middleware/authentication')
const authController = require("../controllers/authController");

// INDEX PAGE
router.get('/', authentication.ifNotLoggedin, authController.index) 

// REGISTER PAGE
router.post('/register', authentication.ifLoggedin, 
[
    body('user_email','Invalid email address!').isEmail().custom((value) => {
        return dbConnection.execute('SELECT `email` FROM `users` WHERE `email`=?', [value])
        .then(([rows]) => {
            if(rows.length > 0){
                return Promise.reject('This E-mail already in use!');
            }
            return true;
        });
    }),
    body('user_name','Username is Empty!').trim().not().isEmpty(),
    body('user_pass','The password must be of minimum length 6 characters').trim().isLength({ min: 6 }),
], authController.register)

// LOGIN PAGE
router.post('/', authentication.ifLoggedin, 
[
    body('user_email').custom((value) => {
        return dbConnection.execute('SELECT email FROM users WHERE email=?', [value])
        .then(([rows]) => {
            if(rows.length == 1){
                return true;
                
            }
            return Promise.reject('Invalid Email Address!');
            
        });
    }),
    body('user_pass','Password is empty!').trim().not().isEmpty(),
], authController.login);

// LOGOUT
router.get('/logout', authController.logout);

// router.use('/', (req,res) => {
//     res.status(404).send('<h1>404 Page Not Found!</h1>');
// });

module.exports = router;