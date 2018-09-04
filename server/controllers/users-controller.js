const encryption = require('../utilities/encryption');
const User = require('mongoose').model('User');

module.exports = {
    registerGet: (req, res) => {
        res.status(200);
        res.render('users/register')
    },

    registerPost: (req, res) => {
        const reqUser = req.body;

        //Add validation

        const salt = encryption.generateSalt();
        const hashedPassword = encryption.generateHashedPassword(salt, reqUser.password);

        User.create({
            username: reqUser.username,
            firstName: reqUser.firstName,
            lastName: reqUser.lastName,
            salt: salt,
            hashedPass: hashedPassword
        }).then(user => {
            req.logIn(user, (err, user) => {
                if (err) {
                    res.locals.globalError = err;
                    res.render('users/register', user)
                }
                res.redirect('/')
            })
        })

    },
    loginGet: (req, res) => {
        res.render('users/login')
    },
    loginPost: (req, res) => {
        let reqUser = req.body;

        User.findOne({username: reqUser.username}).then(user => {

            if (!user) {
                res.locals.globalError = 'Invalid user data';
                res.render('users/login')
            }

            if (!user.authenticate(reqUser.password)) {
                console.log("op")
                // res.locals.globalError = 'Invalid user data';
                res.render('users/login', {globalError: 'Invalid user data'} );
                return;
            }

            req.logIn(user, (err, user) => {
                if (err) {
                    res.locals.globalError = err;
                    res.render('users/login');
                    return;
                }

                res.redirect('/');
            })

        })
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    }
}