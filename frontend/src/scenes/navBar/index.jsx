import {useState} from "react"
import {
    Box,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery,
    Icon
} from "@mui/material"
import {
    Search,
    Message,
    DarkMode,
    LightMode,
    Notifications,
    Help,
    Menu,
    Close
} from "@mui/icons-material"
import { useDispatch,useSelector } from "react-redux"
import { setMode,setLogout } from "../../state"
import  FlexBetween from "../../components/FlexBetween.jsx"
import { useNavigate } from "react-router-dom"

const NavBar = () => {
    const [isMobileMenuToggled,setIsMobileMenuToggled] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state)=>state.user)
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    // const fullName = `${user.fullName} ${user.lastName}`;
    const fullName = `Ujwal Srimanth`



    return <FlexBetween padding="1rem 6%" backgroundColor={alt}>
        <FlexBetween gap="1.5rem"> 
            <Typography fontWeight="bold" fontSize="clamp(1rem,2rem,2.25rem)" color="primary" onClick={()=>navigate('/home')} sx={{'&:hover':{
                color:primaryLight,
                cursor: "pointer",
            }}}>
                UjwalSocio
            </Typography>
            {isNonMobileScreens && (
                <FlexBetween backgroundColor={neutralLight} borderRadius="9px" gap="3rem" padding="0.1rem 1.5rem">
                    <InputBase placeholder="Search..."></InputBase>
                    <IconButton><Search/></IconButton>
                </FlexBetween>
            )}
        </FlexBetween>
       

       {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
            <IconButton onClick={()=>dispatch(setMode())}>
                {theme.palette.mode === "dark" ? (
                    <DarkMode fontSize="25px"></DarkMode>
                ) : (
                    <LightMode fontSize="25px" color="dark"></LightMode>
                )}
            </IconButton>
            <Message sx={{fontSize:'25px'}}></Message>
            <Notifications sx={{fontSize:'25px'}}></Notifications>
            <Help sx={{fontSize:'25px'}}></Help>
            <FormControl variant="standard" value={fullName}>
            <Select
                value={fullName}
                sx={{
                    backgroundColor: neutralLight,
                    width: "150px",
                    borderRadius: "0.25rem",
                    p: "0.25rem 1rem",
                    "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                    },
                    "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                    },
                }}
                input = {<InputBase></InputBase>}
                >
                <MenuItem value={fullName}>{fullName}</MenuItem>
                <MenuItem onclick = {()=>{setLogout()}}>Log Out</MenuItem>
            </Select>
            </FormControl>
        </FlexBetween>
       ) : (
        <IconButton onClick={()=> setIsMobileMenuToggled(!isMobileMenuToggled)}>
            <Menu></Menu>
        </IconButton>
       )}

{!isNonMobileScreens && isMobileMenuToggled && (
        <Box
        position="fixed"
        right="0"
        bottom = "0"
        height="100%"
        zIndex="10"
        maxWidth="500px"
        minWidth="300px">
            <Box display="flex" justifyContent="flex-end" p = "1rem">
                <IconButton onClick={()=> setIsMobileMenuToggled(!isMobileMenuToggled)}></IconButton>
            </Box>
            <FlexBetween display = "flex" flexDirection="column" justifyContent="center" alignItems="center" gap="3rem">
            <IconButton onClick={()=>dispatch(setMode())}>
                {theme.palette.mode === "dark" ? (
                    <DarkMode fontSize="25px"></DarkMode>
                ) : (
                    <LightMode fontSize="25px" color="dark"></LightMode>
                )}
            </IconButton>
            <Message sx={{fontSize:'25px'}}></Message>
            <Notifications sx={{fontSize:'25px'}}></Notifications>
            <Help sx={{fontSize:'25px'}}></Help>
            <FormControl variant="standard" value={fullName}>
            <Select
                value={fullName}
                sx={{
                    backgroundColor: neutralLight,
                    width: "150px",
                    borderRadius: "0.25rem",
                    p: "0.25rem 1rem",
                    "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                    },
                    "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                    },
                }}
                input = {<InputBase></InputBase>}
                >
                <MenuItem value={fullName}>{fullName}</MenuItem>
                <MenuItem onclick = {()=>{setLogout()}}>Log Out</MenuItem>
            </Select>
            </FormControl>
        </FlexBetween>
        
        </Box>
    )}
    </FlexBetween>

   

}

export default NavBar