const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/social");
const bcrypt = require("./bcrypt");

//REGISTER USERS
exports.createUser = (first, last, email, pass) => {
    return db.query(
        `INSERT INTO users (first, last, email, pass)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [first || null, last || null, email || null, pass || null]
    );
};

//GET USER FOR LOGIN FUNCTIONALITY
exports.getUserByEmail = email => {
    return db.query(
        `SELECT *
        FROM users
        WHERE email = $1`,
        [email]
    );
};

exports.getUserById = id => {
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

exports.getOtherPersonInfo = id => {
    return db.query(
        `SELECT id, first, last, email, profilePicUrl, bio
        FROM users
        WHERE id = $1`,
        [id]
    );
};

exports.friends = (receiverid, senderid) => {
    return db.query(
        `SELECT *
    FROM friendships
    WHERE (receiver_id = $1 AND sender_id = $2)
    OR (receiver_id = $2 AND sender_id = $1)`,
        [receiverid, senderid]
    );
};

exports.makeFriends = (receiver, sender) => {
    return db.query(
        `INSERT INTO friendships (receiver_id, sender_id)
        VALUES ($1, $2)
        RETURNING *`,
        [receiver, sender]
    );
};

// HASHING PASSWORDS
exports.hashedPassword = pass => {
    return bcrypt.hash(pass);
};

// CHECK/COMPARE PASSWORDS
exports.checkPassword = (pass, hash) => {
    return bcrypt.compare(pass, hash);
};
