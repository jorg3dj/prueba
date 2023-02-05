const mongoose = require("mongoose");
require("dotenv").config();

const clientDB = mongoose
    .connect(process.env.URI, {})
    .then((m) => {
        console.log("db conectada 🔥");
        return m.connection.getClient();
    })
    .catch((e) => console.log("error de conexión: " + e));

module.exports = clientDB