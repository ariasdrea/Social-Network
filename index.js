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
app.use(express.static("./public"));
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

//security
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
                //put userId in session
                req.session.userId = result.rows[0].id;
                req.session.first = result.rows[0].first;
                req.session.last = result.rows[0].last;
                //send a response
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
    db.getUser(email)
        .then(results => {
            console.log("result in server:", results);

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
