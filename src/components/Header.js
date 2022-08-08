import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  // debugger;
  const username = localStorage.getItem("username");
  const history = useHistory();
    let logout = () => {
    localStorage.clear();
    window.location.reload();
    // enqueueSnackbar("Logged Out Successfully", { variant:"success" })
    history.push("/", { from: "Header" })
  }

  
  
    return (
      <Box className="header">
        <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        
        {children}

        {hasHiddenAuthButtons ? (
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={() => {
              history.push("/")
            }}    
        >
          Back to explore
        </Button>
        ) : username ? (
             <Stack direction="row" spacing={2} alignItems="center" key="logout">
              <Avatar src="avatar.png" alt="crio.do"/>
              <p style={{ marginTop: "0.02rem" }}>{username}</p>
              <Button
                variant="text"
                onClick={logout}>
                LOGOUT
              </Button>
            </Stack>
          ) : (
               <Stack direction="row" spacing={2} alignItems="center" key="login">
                <Button variant="text" onClick={() => history.push("/login")}>
                  LOGIN
                </Button>
                <Button
                  name="logout"
                  variant="contained"
                  onClick={()=>history.push("/register")}
                >
                  REGISTER
                </Button>
              </Stack>
        )
      }
      </Box>
    );
};

export default Header;
