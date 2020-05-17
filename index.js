const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./db");
const bodyParser = require("body-parser");
const csurf = require("csurf");
const cryptoRandomString = require('crypto-random-string');
const cookieSession = require("cookie-session");


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(compression());


////// SENDING EMAILS //////
const aws = require('aws-sdk');

let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env;
} else {
    secrets = require('./secrets');
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: 'eu-west-1'
});


if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

////// COOKIE SESSION //////
app.use(cookieSession({
    secret: `I'm always hungry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
}));
//////////////////////////////


// FILE UPLOAD BOILERPLATE //
const s3 = require("./s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const config = require("./config.json");

var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});
var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
////////////////////////////

app.use(express.static("./public"));
app.use(express.static("./uploads"));
app.use(express.static("./assets"));

//SECURITY
app.disable("x-powered-by");
app.use(csurf());
app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

// ROUTES START
app.post("/registration", async (req, res) => {
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;

    try {
        let hash = await db.hashedPassword(req.body.password);
        let result = await db.createUser(first, last, email, hash);

        req.session.userId = result.rows[0].id;
        req.session.first = result.rows[0].first;
        req.session.last = result.rows[0].last;

        res.json({
            success: true
        });
    } catch (err) {
        console.log("err in post /registration: ", err);
        res.json(err.column);
    }
});

app.post("/login", async (req, res) => {
    let email = req.body.email;

    try {
        let result = await db.getUserByEmail(email);
        let check = await db.checkPassword(
            req.body.password,
            result.rows[0].pass
        );

        if (check == true) {
            req.session.userId = result.rows[0].id;
            res.json({
                success: true
            });
        }
    } catch (err) {
        console.log("err in post /login: ", err);
        res.json({
            success: false
        });
    }
});

// RESET PASSWORD 
app.post("/resetPass", (req, res) => {
    let { email } = req.body;

    db.checkEmail(email).then(result => {
        let emailFromDb = result.rows[0].email;

        if (emailFromDb) {
            const secretCode = cryptoRandomString({
                length: 6
            });

            db.storeCode(email, secretCode).then(result => {
                let { code } = result.rows[0];

                ses.sendEmail({
                    Source: "Andrea Arias <andrea@spiced-academy.com>",
                    Destination: {
                        ToAddresses: [email]
                    },
                    Message: {
                        Body: {
                            Text: {
                                Data: `You have requested a reset in password. Your code is ${code}`
                            }
                        },
                        Subject: {
                            Data: "SES reset password"
                        }
                    }
                })
                    .promise()
                    .then(() => {
                        res.json({
                            success: true
                        });
                    })
                    .catch(err => console.log(err));
            });
        }
    }).catch(() => {
        res.json({
            err: 'Sorry, this is not a registered email address.'
        });
    });
});

app.post('/confirm-identity', (req, res) => {
    let { code, email, password } = req.body;

    db.getCode().then(result => {
        let codesFromDb = result.rows;

        codesFromDb.forEach(item => {
            if (code == item.code) {
                db.hashedPassword(password).then(hash => {
                    db.updatePassword(email, hash).then(() => {
                        res.json({
                            success: true
                        });
                    });
                });
            } else {
                res.json({
                    err: 'That is not the correct code - please try again.'
                });
            }
        });
    });
});
// END RESET PASSWORD FUNCTIONALITY

app.get("/user", async (req, res) => {
    try {
        let result = await db.getUserById(req.session.userId);

        res.json(result.rows[0]);
    } catch (err) {
        console.log("err in get /user: ", err);
        res.json({
            success: false
        });
    }
});

app.post("/upload", uploader.single("file"), s3.upload, async (req, res) => {
    if (req.file) {
        let url = req.file.filename;
        let fullUrl = config.s3Url + url;

        try {
            let result = await db.updateImage(req.session.userId, fullUrl);

            res.json(result.rows[0]);
        } catch (err) {
            console.log("err in post /upload: ", err);
            res.json({
                success: false
            });
        }
    } else {
        res.json({
            success: false
        });
    }
});

app.post("/add-bio", async (req, res) => {
    if (req.body.bio) {
        try {
            let result = await db.addBio(req.session.userId, req.body.bio);

            res.json(result.rows[0].bio);
        } catch (err) {
            console.log("err in post /bio: ", err);
        }
    } else {
        res.json({
            success: false
        });
    }
});

app.get("/user/:id/info", async (req, res) => {
    try {
        let { rows } = await db.getOtherPersonInfo(req.params.id);

        res.json({
            userId: req.session.userId,
            result: rows
        });
    } catch (err) {
        console.log("err in getOtherPersonInfo:", err);
    }
});

/////// FRIEND BUTTON FUNCTIONALITY ///////
app.get("/checkFriendStatus/:id", async (req, res) => {
    const { id } = req.params;
    const { userId } = req.session;

    try {
        let { rows } = await db.getFriendshipStatus(id, userId);
        
        if (!rows.length) {
            res.json({
                buttonText: 'Send Friend Request'
            });
        } else {
            const senderId = rows[0].sender_id;

            if (rows[0].accepted == true) {
                res.json({
                    buttonText: 'Unfriend'
                });
            } else {
                if (senderId == userId) {
                    res.json({
                        buttonText: 'Cancel Friend Request'
                    });
                } else {
                    res.json({
                        buttonText: 'Accept Friend Request'
                    });
                }
            }
        }
    } catch (err) {
        console.log("err in db.friends:", err);
    }
});

// LOGIC BASED ON TEXT
app.post('/updateFriendStatus/:id', async (req, res) => {
    const { id } = req.params;
    const { userId } = req.session;
    const { buttonText } = req.body;

    if (buttonText == 'Send Friend Request') {
        try {
            await db.sendRequest(id, userId);
            res.json({ 
                buttonText: 'Cancel Friend Request'
            });
        } catch (err) {
            console.log("err in db.sendRequest: ", err);
        }

    } else if (buttonText == 'Unfriend') {
        try {
            await db.deleteFriend(id, userId);
            res.json({
                buttonText: 'Send Friend Request'
            });
        } catch (err) {
            console.log('err in db.deleteFriend: ', err);
        }

    } else if (buttonText == 'Cancel Friend Request') {
        try {
            await db.cancelRequest(userId, id);
            res.json({
                buttonText: 'Send Friend Request'
            });
        } catch (err) {
            console.log('err in : ', err);
        }
    } else {
        // buttonText == Accept Friend Request
        try {
            await db.acceptFriend(id, userId);
            res.json({
                buttonText: 'Unfriend'
            });

        } catch (err) {
            console.log('err in db.acceptfriend: ', err);
        }
    }
});
/////// END FRIEND BUTTON FUNCTIONALITY ///////

/////// LIST OF FRIENDS ///////
app.get("/getList", async (req, res) => {
    try {
        let { rows } = await db.getListOfFriends(req.session.userId);

        res.json(rows);
    } catch (err) {
        console.log("err in db.getlist:", err);
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/getUsers", async (req, res) => {
    try {
        let { rows } = await db.getUsers();

        res.json(rows);
    } catch (err) {
        console.log("err in get /getUsers: ", err);
    }
});

app.get('/searchUsers/:val', async (req, res) => {
    try {
        let { rows } = await db.searchUsers(req.params.val || "");

        res.json(rows);
    } catch (err) {
        console.log('err in get /searchUsers: ', err);
    }
});

//Star route should always be at the end
app.get("*", (req, res) => {
    if (!req.session.userId && req.url != "/welcome") {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, () => {
    console.log("I'm listening.");
});