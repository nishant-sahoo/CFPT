import * as React from "react";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import createTheme from "@mui/material/styles/createTheme";
import responsiveFontSizes from "@mui/material/styles/responsiveFontSizes";
import Typography from "@mui/material/Typography";
import DarkModeButton from "../components/darkmodeButton";
import themeToken from "../components/theme";
import ContactUsForm from "../components/contactUsForm";
import Grid from "@mui/material/Unstable_Grid2";
import Navbar from "../components/Navbar";

class Help extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: false,
    };

    this.handleDMButtonClick = this.handleDMButtonClick.bind(this);
  }

  handleDMButtonClick() {
    this.setState({
      isDarkMode: !this.state.isDarkMode,
    });
  }

  render() {
    let isDarkMode = this.state.isDarkMode;
    let currentThemeToken = themeToken;
    const pages = this.props.pages;

    if (isDarkMode) {
      currentThemeToken.palette.mode = "dark";
      currentThemeToken.palette.background.default = "black";
    } else {
      currentThemeToken.palette.mode = "light";
      currentThemeToken.palette.background.default = "#224957";
    }

    let currentTheme = createTheme(currentThemeToken);
    currentTheme = responsiveFontSizes(currentTheme);

    return (
      <div style={{ backgroundColor: "#093545" }} className="page-min-height">
        <Navbar useage={pages} />

        <ThemeProvider theme={currentTheme}>
          {/* <CssBaseline enableColorScheme /> */}
          <Grid container spacing={0} disableEqualOverflow>
            <Grid xs={12}></Grid>
            <Grid p={2} xs={12} display="flex" justifyContent="center">
              <Typography className="contactus" variant="h1">
                Contact Us
              </Typography>
            </Grid>
            <Grid xs={12} display="flex" justifyContent="center">
              <ContactUsForm />
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

export default Help;