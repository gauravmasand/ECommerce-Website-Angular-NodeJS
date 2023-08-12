const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {

    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-site')
    .then(() => console.log("connected"))
    .catch((err) => console.error(err));

}

var conn = mongoose.connection;

module.exports = conn;