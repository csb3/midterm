const { alertMessages, evaluateAlert } = require('./lib/alertMessages');

// load prewritten queries -DT
const queries = require('./db/queries');

// for debugging (shows parameterized queries) -DT
const printQuery = require('./lib/printQuery');

// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');

// Use cookie-session for secure cookies
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['dirtyYarn', 'breadalyzer'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const listingsRoutes = require("./routes/listings");
const messagesRoutes = require("./routes/messages");
const { checkPermission } = require('./lib/routeHelpers');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/listings", listingsRoutes(db));
app.use("/api/messages", messagesRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  const templateVars = { alertMessages, alert: { display: false} };
  evaluateAlert(templateVars, alertMessages, req);

  const permission = checkPermission(req.session, false, templateVars, db);
  templateVars.pageTitle = 'Latest Breads';
  db.query(queries.browseRecentListings)
    .then(
      // results for recent listings
      (recent) => {
        templateVars.recentListings = recent.rows;
        return db.query(queries.showFeatured);
      }
    )
    .then(
      // results for featured listings
      (featured) => {
        templateVars.showFeatured = true;
        templateVars.featuredListings = featured.rows;
        res.render("index", templateVars);
      }
    )
    .catch(
      (error) => {
        console.log(error);
      }
    );
});

app.get('/test/:dynamic', (req, res) => {
  if (req.query.param1) {
    console.log(req.query.param1);
  } else {
    console.log('No query');
  }
});


app.get('*', (req, res) => {
  const templateVars = { alertMessages, alert: { display: false} };
  checkPermission(req.session, false, templateVars, db);
  templateVars.pageTitle = '404 Page Not Found';
  res.render('error', templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
