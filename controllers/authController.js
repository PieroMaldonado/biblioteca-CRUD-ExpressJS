const bcrypt = require('bcrypt');
const dbConnection = require('../config/database');
const { validationResult } = require('express-validator');

module.exports = {
    index:function (req,res){ 
        dbConnection.execute("SELECT `name` FROM `users` WHERE `id`=?",[req.session.userID])
        .then(([rows]) => {
            res.render('auth/home',{
                name:rows[0].name
            });
        });
    },
    register:function (req,res) {
        const validation_result = validationResult(req);
        const {user_name, user_pass, user_email} = req.body;
        // IF validation_result HAS NO ERROR
        if(validation_result.isEmpty()){
            // password encryption (using bcryptjs)
            bcrypt.hash(user_pass, 12).then((hash_pass) => {
                // INSERTING USER INTO DATABASE
                dbConnection.execute("INSERT INTO `users`(`name`,`email`,`password`) VALUES(?,?,?)",[user_name,user_email, hash_pass])
                .then(result => {
                    res.send(`your account has been created successfully, Now you can <a href="/">Login</a>`);
                }).catch(err => {
                    // THROW INSERTING USER ERROR'S
                    if (err) throw err;
                });
            })
            .catch(err => {
                // THROW HASING ERROR'S
                if (err) throw err;
            })
        }
        else{
            // COLLECT ALL THE VALIDATION ERRORS
            let allErrors = validation_result.errors.map((error) => {
                return error.msg;
            });
            // REDERING login-register PAGE WITH VALIDATION ERRORS
            res.render('auth/login-register',{
                register_error:allErrors,
                old_data:req.body
            });
        }
    },
    login: function (req, res) {
        const validation_result = validationResult(req);
        const {user_pass, user_email} = req.body;
        if(validation_result.isEmpty()){
            dbConnection.execute("SELECT * FROM `users` WHERE `email`=?",[user_email])
            .then(([rows]) => {
                bcrypt.compare(user_pass, rows[0].password).then(compare_result => {
                    if(compare_result === true){
                        req.session.isLoggedIn = true;
                        req.session.userID = rows[0].id;
                        res.redirect('/');
                    }
                    else{
                        res.render('auth/login-register',{
                            login_errors:['Invalid Password!']
                        });
                    }
                })
                .catch(err => {
                    if (err) throw err;
                });
            }).catch(err => {
                if (err) throw err;
            });
        }
        else{
            let allErrors = validation_result.errors.map((error) => {
                return error.msg;
            });
            // REDERING login-register PAGE WITH LOGIN VALIDATION ERRORS
            res.render('auth/login-register',{
                login_errors:allErrors
            });
        }
    },
    logout: function (req, res) {
        //session destroy
        req.session = null;
        res.redirect('/');    
    }
}