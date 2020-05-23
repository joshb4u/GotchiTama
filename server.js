const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const db = require('./models');
const htmlRouter = require('./routes/html-routes');
const apiRouter = require('./routes/api-routes');

// create app
const app = express();

// define middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serve static resources
app.use(express.static('./public'));

// define authentication and session handler
// We need to use sessions to keep track of our user's login status
app.use(
  session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// add the routers
app.use(apiRouter);
app.use(htmlRouter);

// start the server AFTER syncing the database
// IMPORTANT : remove the force option when done with dev.
db.sequelize.sync({ force: true }).then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
