import * as React from "react";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import { themeTokenProfile } from "../components/theme";
import { createTheme } from "@mui/material";
import UserProfile from "../components/userProfile";
import Grid from "@mui/material/Unstable_Grid2";
import responsiveFontSizes from "@mui/material/styles/responsiveFontSizes";
import DarkModeButton from "../components/darkmodeButton";
import Navbar from "../components/Navbar";

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: false,
    };
    this.handleDMButtonClick = this.handleDMButtonClick.bind(this);
  }

  handleDMButtonClick() {
    console.log("clicked");
    this.setState({
      isDarkMode: !this.state.isDarkMode,
    });
  }

  render() {
    let isDarkMode = this.state.isDarkMode;
    let currentThemeToken = themeTokenProfile;

    if (isDarkMode) {
      currentThemeToken.palette.mode = "dark";
      currentThemeToken.palette.background.default = "black";
    } else {
      currentThemeToken.palette.mode = "light";
      currentThemeToken.palette.background.default = "#8d6e63";
    }

    let currentTheme = createTheme(currentThemeToken);
    currentTheme = responsiveFontSizes(currentTheme);

    const pages = ["home", "profile", "archive", "potd", "help"];
    return (
      <div style={{ backgroundColor: "#093545" }} className="page-min-height">
      <ThemeProvider theme={currentTheme}>
        <CssBaseline enableColorScheme />
        <Navbar md={12} useage={pages} />
        <Grid
          margin={3}
          container
          justifyContent="center"
          disableEqualOverflow
          spacing={4}
        >
          <Grid md={6} sm={10} xs={12}>
            <UserProfile />
          </Grid>
        </Grid>
        {/* <DarkModeButton
          onClick={this.handleDMButtonClick}
          isDarkMode={isDarkMode}
        /> */}
      </ThemeProvider>
      </div>
    );
  }
}

export default ProfilePage;
