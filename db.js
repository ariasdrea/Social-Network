const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/social");
const bcrypt = require("./bcrypt");

//REGISTER USERS
exports.createUser = function(first, last, email, pass) {
    return db.query(
        `INSERT INTO users (first, last, email, pass)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [first || null, last || null, email || null, pass || null]
    );
};

// HASHING PASSWORDS
exports.hashedPassword = function(pass) {
    return bcrypt.hash(pass);
};

// CHECK/COMPARE PASSWORDS
exports.checkPassword = function(pass, hash) {
    return bcrypt.compare(pass, hash);
};
