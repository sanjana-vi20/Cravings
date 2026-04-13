import mongoose from "mongoose";

const contactSchema = mongoose.Schema({
    
    fullName : {
        type : String,
        required:true,
    },
     email : {
        type : String,
        required:true,
    },
     mobnumber : {
        type : String,
        required:true,
    },
     message : {
        type : String,
        required:true,
    },
} , {timestamp:true});

const Contact = mongoose.model("Contact" , contactSchema);

export default Contact;