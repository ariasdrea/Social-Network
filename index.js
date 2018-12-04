const express = require("express");
const app = express();
const ca = require("chalk-animation");
const compression = require("compression");
const db = require("./db"); //accesses database
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
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

app.use(
    cookieSession({
        secret: `amazing.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

//File Upload / Amazon Boilerplate//
const s3 = require("./s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const config = require("./config.json");

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
//File Upload Boilerplate//

app.use(express.static("./public"));
app.use(express.static("./uploads"));
app.use(express.static("./assets"));

//Security
app.disable("x-powered-by");
app.use(csurf());
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

// ----------------------------------------------

app.post("/registration", (req, res) => {
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;

    //hash pass & insert info into database
    db.hashedPassword(req.body.password)
        .then(hash => {
            return db.createUser(first, last, email, hash).then(result => {
                console.log("result in db.createUser:", result.rows[0]);
                req.session.userId = result.rows[0].id;
                req.session.first = result.rows[0].first;
                req.session.last = result.rows[0].last;
                res.json({ success: true });
            });
        })
        .catch(err => {
            console.log("ERR in db.createUser:", err);
            res.json(err.column);
        });
});

app.post("/login", (req, res) => {
    let email = req.body.email;
    db.getUserByEmail(email)
        .then(results => {
            // console.log("result in server:", results);
            return db
                .checkPassword(req.body.password, results.rows[0].pass)
                .then(result => {
                    if (result == true) {
                        req.session.userId = results.rows[0].id;
                        res.json({ success: true });
                    }
                });
        })
        .catch(err => {
            console.log("ERR in db.getUser:", err);
            res.json({ success: false });
        });
});

app.get("/user", (req, res) => {
    db.getUserById(req.session.userId)
        .then(result => {
            res.json(result.rows[0]);
        })
        .catch(err => {
            console.log("ERR in getUserById:", err);
            res.json({
                success: false
            });
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    if (req.file) {
        let url = req.file.filename;
        let fullUrl = config.s3Url + url;
        db.updateImage(req.session.userId, fullUrl)
            .then(result => {
                res.json(result.rows[0]);
            })
            .catch(err => {
                console.log("ERR in db.uploadImg:", err);
                res.json({
                    success: false
                });
            });
    } else {
        res.json({
            success: false
        });
    }
});

app.post("/bio", (req, res) => {
    let bio = req.body.bio;

    if (req.body.bio) {
        db.updateBio(req.session.userId, bio)
            .then(result => {
                res.json(result.rows[0]);
            })
            .catch(err => {
                console.log("ERR in db.updateBio:", err);
            });
    } else {
        res.json({
            success: false
        });
    }
});

app.get("/user/:id/info", function(req, res) {
    db.getOtherPersonInfo(req.params.id)
        .then(result => {
            res.json({ userId: req.session.userId, result: result.rows });
        })
        .catch(err => {
            res.json({
                success: false
            });
            console.log("err in getOtherPersonInfo:", err);
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
    res.sendFile(__dirname + "/index.html");
});

app.listen(8080, () => {
    ca.rainbow("I'm listening.");
});
