import express from "express"
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    getUserBasedOnId
} from "../controllers/user.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router();

router.get("/dummy/:id",verifyToken,getUserBasedOnId);
router.get("/:id",verifyToken,getUser)
router.get("/:id/friends",verifyToken,getUserFriends)



router.patch("/:id/:friendId",verifyToken,addRemoveFriend)
export default router
