const express = require("express");
const app = express();
const ca = require("chalk-animation");
const compression = require("compression");
const db = require("./db"); //accesses database
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("./public"));

app.use(compression());

//security
app.disable("x-powered-by");

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

// ----------------------------------------------

app.post("/registration", (req, res) => {
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let pass = req.body.password;

    //hash pass & insert info into database
    db.hashedPassword(pass)
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
            res.json({ success: false });
        });
});

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
