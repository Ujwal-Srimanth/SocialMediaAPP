import { useSelector } from "react-redux"
import NavBar from "../navBar"
import {Box, useMediaQuery} from "@mui/material"
import { Block } from "@mui/icons-material"
import UserWidget from "../widgets/userWidget"
import MyPostWidget from "../widgets/myPostWidget"
import PostsWidget from "../widgets/postsWidget"
import AdvertWidget from "../widgets/AdvertWidget"
import FriendListWidget from "../widgets/FriendsListWidget"
const HomePage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
    const { _id, picturePath } = useSelector((state) => state.user || {});

    console.log(_id)

    return(
     <Box>
        <NavBar/>
        <Box
            width="100%"
            padding = "2rem 6%"
            display={isNonMobileScreens ? "flex" : "block"}
            gap = "0.5rem"
            justifyContent="space-between"
        >
            <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                <UserWidget userId = {_id} picturePath={picturePath}></UserWidget>
            </Box>

            <Box flexBasis={isNonMobileScreens ? "42%" : undefined}>
                <MyPostWidget picturePath={picturePath}/>
                <PostsWidget userId = {_id}/>
            </Box>

            <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
               <AdvertWidget/>
               <Box m="2rem 0"/>
               <FriendListWidget userId={_id}/>
            </Box>

        </Box>
    </Box>
    )

}

export default HomePage