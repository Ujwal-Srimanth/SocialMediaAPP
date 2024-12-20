import { useMediaQuery, Box , useTheme , Typography } from "@mui/material";
import Form from "./Form";
const LoginPage = () => {
    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
    const message = "Welcome to Our Social Media App!";
    const words = message.split(" ");
    return (
        <Box>
            <Box 
             width = "100%"
             backgroundColor = {theme.palette.background.alt}
             p = "1 rem 6%"
             textAlign="center"
             >
            <Typography fontWeight="bold" fontSize="32px" color="primary">
                UjwalSocio
            </Typography>
            </Box>

            <Box width={isNonMobileScreens ? "50%" : "93%"} p="2rem" m = "2rem auto" borderRadius="1.5rem" backgroundColor = {theme.palette.background.alt}>
                <Typography fontWeight="500" variant="h5" sx={{marginBottom:"1.5rem"}}>
                   Bored of Insta Try Out my UjwalSocio , The new Genz Social Media Platform
                </Typography>
            <Form/>
            </Box>
            
        </Box>
    );
};

export default LoginPage;
