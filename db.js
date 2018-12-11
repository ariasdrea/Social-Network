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
        FROM friends
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
        [receiverid, senderid]
    );
};

exports.becomeFriends = (receiver, sender) => {
    return db.query(
        `INSERT INTO friends (receiver_id, sender_id)
        VALUES ($1, $2)
        RETURNING *`,
        [receiver, sender]
    );
};

exports.cancelFriends = (receiver, sender) => {
    return db.query(
        `
        DELETE FROM friends
        WHERE (receiver_id = $2 AND sender_id = $1)
        RETURNING *`,
        [receiver, sender]
    );
};

exports.acceptFriends = (sender, receiver) => {
    return db.query(
        `UPDATE friends
        SET accepted = true
        WHERE (sender_id = $1 AND receiver_id = $2)
        RETURNING *`,
        [sender, receiver]
    );
};

exports.deleteFriends = (receiver, sender) => {
    return db.query(
        `DELETE FROM friends
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)
        RETURNING *`,
        [receiver, sender]
    );
};

exports.getList = id => {
    return db.query(
        `
    SELECT users.id, first, last, profilePicUrl, accepted
    FROM friends
    JOIN users
    ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)`,
        [id]
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

exports.getUsersByIds = arrOfIds => {
    const query = `SELECT id, first, last, profilePicUrl FROM users WHERE id = ANY($1)`;
    return db.query(query, [arrOfIds]);
};

exports.getWhoJoinedById = id => {
    const query = `SELECT id, first, last, profilePicUrl FROM users WHERE id = $1`;
    return db.query(query, [id]);
};
