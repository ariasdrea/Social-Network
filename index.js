const express = require("express");
const app = express();
// this code gives app the access to the socket - needs to happen after you require app
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

const ca = require("chalk-animation");
const compression = require("compression");
const db = require("./db");
const bodyParser = require("body-parser");
const csurf = require("csurf");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());

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

// COOKIE SESSION
const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always hungry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

//File Upload / Amazon Boilerplate//
const s3 = require("./s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const config = require("./config.json");

//FILE UPLOAD BOILERPLATE//
var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
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
//FILE UPLOAD BOILERPLATE//

app.use(express.static("./public"));
app.use(express.static("./uploads"));
app.use(express.static("./assets"));

//SECURITY
app.disable("x-powered-by");
app.use(csurf());
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

// ----------------------------------------------

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
            res.json({ success: true });
        }
    } catch (err) {
        console.log("err in post /login: ", err);
        res.json({ success: false });
    }
});

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

app.post("/bio", async (req, res) => {
    let bio = req.body.bio;

    if (req.body.bio) {
        try {
            let result = await db.addBio(req.session.userId, bio);
            res.json(result.rows[0]);
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
        let result = await db.getOtherPersonInfo(req.params.id);
        // console.log("result from otherpersoninfo: ", result.rows);
        res.json({
            userId: req.session.userId,
            result: result.rows
        });
    } catch (err) {
        console.log("err in getOtherPersonInfo:", err);
    }
});

// FRIEND BUTTONS FUNCTIONALITY
app.get("/friend/:id", async (req, res) => {
    try {
        let result = await db.friends(req.params.id, req.session.userId);
        console.log("result from db.friends: ", result.rows);
        res.json(result.rows);
    } catch (err) {
        console.log("err in db.friends:", err);
    }
});

app.post("/makeFriends/:id", (req, res) => {
    db.becomeFriends(req.params.id, req.session.userId)
        .then(() => {
            res.json({
                success: true
            });
        })
        .catch(err => {
            console.log("err in makefriends:", err);
        });
});

app.post("/cancel/:id", (req, res) => {
    db.cancelFriends(req.params.id, req.session.userId)
        .then(() => {
            res.json({
                success: true
            });
        })
        .catch(err => {
            console.log("err in cancelFriends:", err);
        });
});

app.post("/accept/:id", (req, res) => {
    db.acceptFriends(req.params.id, req.session.userId)
        .then(() => {
            res.json({
                success: true
            });
        })
        .catch(err => {
            console.log("err in db.acceptfriends:", err);
        });
});

app.post("/delete/:id", (req, res) => {
    db.deleteFriends(req.params.id, req.session.userId)
        .then(() => {
            res.json({
                success: true
            });
        })
        .catch(err => {
            console.log("err in db.deleteFriends:", err);
        });
});

app.get("/getList", (req, res) => {
    db.getList(req.session.userId)
        .then(result => {
            console.log("result:", result.rows);
            res.json(result.rows);
        })
        .catch(err => {
            console.log("err in db.getlist:", err);
        });
});

//Erases cookies and redirects to Welcome Page
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});

//checks if userId cookie exists. If so, routes to logo page.
app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

//star should always be at the end
app.get("*", (req, res) => {
    if (!req.session.userId && req.url != "/welcome") {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

// ONLY APP ROUTE WE ARE CHANGING IN OUR SERVER
server.listen(8080, () => {
    ca.rainbow("I'm listening.");
});

let onlineUsers = {};

io.on("connection", socket => {
    let socketId = socket.id;
    let userId = socket.request.session.userId;
    onlineUsers[socketId] = userId;
    // console.log("online users:", onlineUsers);
    let arrOfIds = Object.values(onlineUsers);
    // console.log("arrOfIds:", arrOfIds);

    db.getUsersByIds(arrOfIds)
        .then(results => socket.emit("onlineUsers", results.rows))
        .catch(err => {
            console.log("err in socket-getusersbyids", err);
        });

    if (arrOfIds.filter(id => id == userId).length == 1) {
        db.getWhoJoinedById(userId)
            .then(results => {
                socket.broadcast.emit("userJoined", results.rows[0]);
            })
            .catch(err => {
                console.log("error in userWhoJoined:", err);
            });
    }

    socket.on("disconnect", () => {
        delete onlineUsers[socketId];
        io.sockets.emit("userLeft", userId);
    });

    // connects with the emit from chat.js
    socket.on("chatMsg", msg => {
        db.insertMessages(msg, userId)
            .then(result => {
                db.currentUserInfo(result.rows[0].id).then(data => {
                    io.sockets.emit("eachMsg", data.rows[0]);
                });
            })
            .catch(err => {
                console.log("error in socket-insertmsgs:", err);
            });
    });

    db.getMessages()
        .then(result => {
            var arrOfTenMsgs = result.rows;
            io.sockets.emit("showMsgs", arrOfTenMsgs.reverse());
        })
        .catch(err => {
            console.log("err in socket getmessages:", err);
        });
});
