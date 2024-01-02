const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required:[true,"Please provide a Name"]
        },
        email: {
            type: String,
            unique : true ,
            required: [true,"Please provide a Email"]
        },
        password: {
            type: String,
            required:true
        }
    
    }
)


const Register = new mongoose.model("Register", adminSchema);

module.exports = Register;