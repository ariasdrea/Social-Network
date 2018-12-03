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

//GET USER FOR LOGIN FUNCTIONALITY
exports.getUserByEmail = function(email) {
    return db.query(
        `SELECT *
        FROM users
        WHERE email = $1`,
        [email]
    );
};

exports.getUserById = function(id) {
    return db.query(
        `SELECT *
        FROM users
        WHERE id = $1`,
        [id]
    );
};

exports.updateImage = (userId, profilePicUrl) => {
    return db.query(
        `UPDATE users
        SET profilePicUrl = $2
        WHERE id = $1
        RETURNING *`,
        [userId, profilePicUrl]
    );
};

exports.updateBio = (userId, bio) => {
    return db.query(
        `UPDATE users
        SET bio = $2
        WHERE id = $1
        RETURNING *`,
        [userId, bio]
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
