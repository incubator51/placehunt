const express = require('express');
const path = require('path');
const app = express();
const port = 5000;

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Set the views directory (no need to change if using /views/)
app.set('views', path.join(__dirname, 'views'));

// Serve static files like CSS, images, JS from /public
app.use(express.static('public'));

// Signup page route
app.get('/signup', (req, res) => {
  res.render('signup'); // renders /views/signup.ejs
});
app.get('/signin', (req, res) => {
  res.render('signin'); // renders /views/signin.ejs
});
// Start the server
app.listen(port, () => {
  console.log(`Frontend server running at http://localhost:${port}`);
});
