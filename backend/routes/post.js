import express from "express"
import { getFeedPosts , getUserPosts , likePost} from "../controllers/posts.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.get("/", verifyToken, (req, res, next) => {
    console.log("getFeedPosts route hit");
    next();
}, getFeedPosts);

router.get("/:userId/posts",verifyToken,getUserPosts)

router.patch("/:id/like",verifyToken,likePost)
export default router