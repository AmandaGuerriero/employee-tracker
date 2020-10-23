const connection = require("./database");

class DB {
    consturctor(connection){
        this.connection = connection;
    }
    // View All Employess
    getAllEmployes() {
        return this.connection.query(
            `SELECT * FROM employees`
        )
    }
};

module.exports = new DB(connection);