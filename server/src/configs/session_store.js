const session = require("express-session");
const options = require("./database_config");
const MySqlStore = require("express-mysql-session")(session);

const myStore = new MySqlStore(options);

module.exports = myStore;
