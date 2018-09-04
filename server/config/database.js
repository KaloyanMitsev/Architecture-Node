const mongoose = require('mongoose');
const User = require('../data/User');

mongoose.Promise = global.Promise;

module.exports = (settings) => {
    console.log("hI")
    mongoose.connect(settings.db);

    let db = mongoose.connection;

    db.once('open', err => {
        if (err){
            throw err;
        }
        console.log('MongoDB Ready');

        User.seedAdminUser();
    });

    db.on('error', err => console.log(`Darabase error ${err}`))
};