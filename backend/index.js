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




const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()

const app = express();
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))
app.use(cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    credentials: true, // Allow credentials (e.g., cookies, authorization headers)
}));
app.use('/assets',express.static(path.join(__dirname,'public/assets')))

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
    })
}).catch((err)=>{
    console.log(`mongo did not connect ${err}`)
})



