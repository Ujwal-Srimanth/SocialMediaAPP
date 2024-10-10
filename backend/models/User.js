import { strictTransportSecurity } from "helmet";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        min:2,
        max:50
    },
    lastName:{
        type:String,
        required:true,
        min:2,
        max:50
    },
    email:{
        type:String,
        required:true,
        max:50,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:5,
        max:15,

    },
    picturePath:{
        type:String,
        default:""
    },
    friends:{
        type:Array,
        defualt:[]
    },
    location:String,
    occupation:String,
    viewedProfile:String,
    impressions:String
},{timestamps:true})

const User = mongoose.model("User",userSchema)
export default User;


