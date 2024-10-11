import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer"
import helmet from "helmet"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"
import { register } from "./controllers/auth.js"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/user.js"
import postRoutes from "./routes/post.js"
import { verifyToken } from "./middleware/auth.js"
import {createPost} from "./controllers/posts.js"
import User from "./models/User.js"
import Post from "./models/Post.js"
import {users,posts} from "./data/index.js"


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()

const app = express();
app.use(express.json())
app.use(helmet)
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))
app.use(cors())
app.use('/assests',express.static(path.join(__dirname,'public/assets')))

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"public/assets")
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    },
})

const upload = multer({storage})
app.post('/posts',verifyToken,upload.single("picture"),createPost)
app.post('/auth/register',upload.single("picture"),register)
app.use('/auth',authRoutes)
app.use('/user',userRoutes)
app.use('/posts',postRoutes)


const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL).then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server Port ${PORT}`)
        /*inset dummy data at the start*/
        // User.insertMany(users);
        // Post.insertMany(posts);
    })
}).catch((err)=>{
    console.log(`mongo did not connect ${err}`)
})



