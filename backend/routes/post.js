import express from "express"
import { getFeedPosts , getUserPosts , likePost} from "../controllers/post.js"
import { verifyToken } from "../middleware/auth"

const router = express.router()

router.get("/",verifyToken,getFeedPosts)
router.get("/:userId/posts",verifyToken,getUserPosts)

router.patch("/:id/like",likePost)
export default router