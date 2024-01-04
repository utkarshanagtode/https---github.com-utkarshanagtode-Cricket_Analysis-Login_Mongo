var express = require("express")
const path = require("path");
const app = express();
const hbs = require("hbs");
const bodyParser = require("body-parser");
const session = require("express-session");

// Middleware for parsing form data
//app.use(bodyParser.urlencoded({ extended: true }));



const { register } = require("module");
require("./db/conn");
const Register = require("./models/registers");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");


app.use(
  session({
    secret: "11d4d1c8ceb857eb5ce2f3b6bc8339ac63e9623a322bca1c59ba34377f592661", // Add a secret key for session encryption
    resave: false,
    saveUninitialized: true,
  })
);


app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
app.use(express.json());
app.use(express.urlencoded({extended:false}));

hbs.registerPartials(partials_path);



const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect("/"); // Redirect to the login page if the user is not logged in
};



app.get("/",(req,res)=>{

    res.render("home");
  
  });

  app.get("/index",async (req,res)=>{
    res.render("index");
   
});
// ... (previous code)

app.get("/dashboard", isAuthenticated, async (req, res) => {
  try {
    const user = await Register.findOne({ email: req.session.user.email });

    if (user) {
      res.render("dashboard", { userName: req.session.user.name });
    } else {
      res.status(401).send("User not found");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.post('/dashboard', async (req, res) => {
  try {
    // Assuming req.session.user.email contains the user's email
    const user = await Register.findOne({ email: req.session.user.email });

    if (user) {
      const userName = user.name;
      console.log('Submitted user name:', userName);
      res.render('dashboard', { userName });
    } else {
      res.status(401).send('User not found');
    }
  } catch (error) {
    console.error('Error fetching user data from the database:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post("/index", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Register.findOne({ email: email });

    if (user) {
      // User exists, check if the password matches
      if (user.password === password) {
        req.session.user = { email: user.email, name: user.name }; // Set the user in the session
        res.status(201).render("dashboard", { userName: user.name });
      } else {
        // Incorrect password
        res.send("Password does not match");
      }
    } else {
      // User does not exist, proceed with registration
      const adminRegistration = new Register({
        name: req.body.name,
        email: email,
        password: password,
      });

      const registered = await adminRegistration.save();
      req.session.user = { email: registered.email, name: registered.name }; // Set the user in the session
      res.redirect("/dashboard");
    }
  } catch (error) {
    res.status(400).send(error.message || "An error occurred");
  }
});

// ... (remaining code)









  

app.listen(port,()=>{
    console.log(`server is running on post no. ${port}`);
})