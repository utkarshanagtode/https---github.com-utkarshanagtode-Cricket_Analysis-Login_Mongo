var express = require("express")
const path = require("path");
const app = express();
const hbs = require("hbs");
const bodyParser = require("body-parser");
// Middleware for parsing form data
//app.use(bodyParser.urlencoded({ extended: true }));



const { register } = require("module");
require("./db/conn");
const Register = require("./models/registers");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");

app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
app.use(express.json());
app.use(express.urlencoded({extended:false}));

hbs.registerPartials(partials_path);



app.get("/",(req,res)=>{
      res.render("home");
    // Your route handling logic
  });

  app.get("/index",(req,res)=>{
    res.render("index");
  // Your route handling logic
});

app.post("/index", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const useremail = await Register.findOne({ email: email });

    // Check if the user already exists
    if (useremail) {
      // If the user exists, check if the password matches
      if (useremail.password === password) {
        res.status(201).render("home");
      } else {
        res.status(401).send("Password does not match");
      }
    } else {
      // If the user doesn't exist, proceed with registration
      const adminRegistration = new Register({
        name: req.body.name,
        email: email,
        password: password,
      });

      const registered = await adminRegistration.save();
      res.status(201).render("home");
    }
  } catch (error) {
    res.status(400).send(error.message || "An error occurred");
  }
});




  

app.listen(port,()=>{
    console.log(`server is running on post no. ${port}`);
})