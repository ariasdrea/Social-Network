const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/social");
const bcrypt = require("../bcrypt");

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

exports.addBio = (userId, bio) => {
    return db.query(
        `UPDATE users
        SET bio = $2
        WHERE id = $1
        RETURNING *`,
        [userId, bio]
    );
};

// GETS THE OTHER USER'S INFO
exports.getOtherPersonInfo = id => {
    return db.query(
        `SELECT id, first, last, email, profilePicUrl, bio
        FROM users
        WHERE id = $1`,
        [id]
    );
};

exports.getFriendshipStatus = (receiverid, senderid) => {
    return db.query(
        `SELECT *
        FROM friends
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
        [receiverid, senderid]
    );
};

// UPDATES ROWS FOR FRIEND BUTTON //
exports.sendRequest = (receiver, sender) => {
    return db.query(
        `INSERT INTO friends (receiver_id, sender_id)
        VALUES ($1, $2)`,
        [receiver, sender]
    );
};

exports.cancelRequest = (sender, receiver) => {
    return db.query(
        `DELETE FROM friends
        WHERE (receiver_id = $2 AND sender_id = $1)`,
        [sender, receiver]
    );
};

exports.acceptFriend = (sender, receiver) => {
    return db.query(
        `UPDATE friends
        SET accepted = true
        WHERE (sender_id = $1 AND receiver_id = $2) 
        RETURNING id`,
        [sender, receiver]
    );
};

exports.deleteFriend = (receiver, sender) => {
    return db.query(
        `DELETE FROM friends
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
        [receiver, sender]
    );
};
// END FRIEND BUTTON //

exports.getListOfFriends = id => {
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

//ONLINE USERS QUERIES
exports.getUsersByIds = arrOfIds => {
    const query = `SELECT id, first, last, profilePicUrl FROM users WHERE id = ANY($1)`;
    return db.query(query, [arrOfIds]);
};

exports.getWhoJoinedById = id => {
    const query = `SELECT id, first, last, profilePicUrl FROM users WHERE id = $1`;
    return db.query(query, [id]);
};

// CHAT QUERIES
exports.insertMessages = (messages, user_id) => {
    return db.query(
        `INSERT INTO chats (messages, user_id )
        VALUES ($1, $2)
        RETURNING * `,
        [messages || null, user_id]
    );
};

exports.getMessages = () => {
    return db.query(
        `SELECT users.first, users.last, users.profilePicUrl, chats.messages, chats.id, chats.created_at
        FROM chats
        LEFT JOIN users
        ON chats.user_id = users.id
        ORDER BY chats.created_at DESC
        LIMIT 10
        `
    );
};

exports.currentUserInfo = id => {
    return db.query(
        `SELECT u.first, u.last, u.profilePicUrl,
        c.messages, c.id AS "messageId"
        FROM chats AS c
        LEFT JOIN users AS u
        ON c.user_id = u.id
        WHERE c.id = $1`,
        [id]
    );
};

exports.getUsers = () => {
    return db.query(`
        SELECT * FROM users
        ORDER BY id DESC
        LIMIT 3;
        `);
};

exports.searchUsers = (val) => {
    return db.query(`
            SELECT id, first, last, profilepicurl FROM users
            WHERE first ILIKE $1;`,
    ['%' + val + '%']
    );
};

exports.checkEmail = (email) => {
    return db.query(`
        SELECT email FROM users
        WHERE email = $1;
    `,
    [email]
    );
};

exports.storeCode = (email, code) => {
    return db.query(`
        INSERT INTO resetPass (email, code)
        VALUES ($1, $2)
        RETURNING *
    `,
    [email, code]
    );
};

exports.getCode = () => {
    return db.query(`
        SELECT * FROM resetPass
        WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes';
    `);
};

exports.updatePassword = (email, newPass) => {
    return db.query(`
        UPDATE users
        SET pass = $2
        WHERE email = $1
        RETURNING *
    `,
    [email, newPass]
    );
};
