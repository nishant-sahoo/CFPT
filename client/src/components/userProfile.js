import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import MailTwoToneIcon from "@mui/icons-material/MailTwoTone";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import { useEffect, useState } from "react";
import axios from "axios";
import { InstructionBox, DeleteAccountDialogBox } from "./DialogBox";
import { generateRandomProblem, checkSubmission } from "./validate_handle";
import Link from "@mui/material/Link";
import AlertWithClose from "./alerts";
import LaunchIcon from "@mui/icons-material/Launch";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuthContext } from "../hooks/useAuthContext";
import profilePic from "../images/avatar2.jpg"



 function stringToColor(string) {
    /*
  Takes the name of the user and returns random colors for profile
  */

    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    /*
  first two letters for profile
  */
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  function colorOfRating(rating) {
    /*
  Get color corresponding to ratings
  TODO:Initial letter distinction for specific ratings
  */
    let color;
    if (rating >= 2400) color = "#FF0000";
    else if (rating >= 2000) color = "#FF8C00";
    else if (rating >= 1800) color = "#AA00AA";
    else if (rating >= 1600) color = "#0000FF";
    else if (rating >= 1400) color = "#03A89E";
    else if (rating >= 1200) color = "#008000";
    else if (rating >= 1000) color = "#88CC22";
    else color = "#808080";

    return color;
}


  function UserInfo(props) {
    let rating = props.ratings.currentRating;

    return (
      <Grid container justifyContent="center" sx={{ pt: 12 }}>
        <Grid xs={12}>
          <Typography textAlign="center" variant="h5" component="h2">
            {props.userInfo.userName}
          </Typography>
        </Grid>
        {props.handle === null || props.handle === undefined ? (
          <Grid xs={12} xsOffset={5}>
            <Button onClick={props.handleEditClick}>Add Handle</Button>
          </Grid>
        ) : (
          <Grid xs={12}>
            <Typography
              textAlign="center"
              variant="h6"
              color={colorOfRating(rating)}
            >
              {props.handle}
            </Typography>
          </Grid>
        )}

        <Grid
          xsOffset={3}
          xs={1}
          smOffset={4}
          mdOffset={3.7}
          lgOffset={4}
          sx={{ mr: { md: -1, sm: -1.8, xs: 0.5 } }}
        >
          <MailTwoToneIcon />
        </Grid>
        <Grid>
          <Typography variant="subtitle1">{props.userInfo.email}</Typography>
        </Grid>
        <Grid xsOffset="auto">
          <IconButton disableRipple xs={1} onClick={props.handleEditClick}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Grid>
      </Grid>
    );
  }

  function UserStats(props) {
    return (
      <Stack sx={{ p: 2 }} alignItems="center">
        <Stack alignItems="center" direction="row" spacing={4}>
          <Stack spacing={1}>
            <Typography
              variant="h6"
              color="secondary"
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Rating
            </Typography>
            <Typography
              color={colorOfRating(props.ratings.currentRating)}
              sx={{ textAlign: "center" }}
            >
              {props.ratings.currentRating}
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography
              variant="h6"
              color="secondary"
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Max Rating
            </Typography>
            <Typography
              color={colorOfRating(props.ratings.maxRating)}
              sx={{ textAlign: "center" }}
            >
              {props.ratings.maxRating}
            </Typography>
          </Stack>
        </Stack>
        <Typography
          variant="h6"
          color="secondary"
          sx={{ textAlign: "center", fontWeight: "bold" }}
        >
          Problems Solved
        </Typography>
        <Typography>{props.stats.problemsSolved}</Typography>
        <Typography
          variant="h6"
          color="secondary"
          sx={{ textAlign: "center", fontWeight: "bold" }}
        >
          Current POTD Streak
        </Typography>
        <Typography>{props.stats.problemsSolved}</Typography>
      </Stack>
    );
  }

  function EditProfile(props) {
    return (
      <Grid container sx={{ pt: 12 }} spacing={1} alignItems="flex-end">
        <Grid xs={8} sm={12} smOffset={4} xsOffset={3}>
          <TextField
            id="userName"
            defaultValue={props.userInfo.userName}
            onChange={props.handleNChange}
            variant="standard"
          />
        </Grid>
        <Grid smOffset={4} xsOffset={3} xs={8} md={3.8}>
          <TextField
            id="handle"
            defaultValue={props.handle}
            onChange={props.handleHChange}
            variant="standard"
          />
        </Grid>
        <Grid xs={12} smOffset={5} xsOffset={4.5} mdOffset={0} md={3}>
          {props.validated || props.isValidating ? (
            <Button disabled>Validate</Button>
          ) : (
            <Button onClick={props.handleVClick}>Validate</Button>
          )}
        </Grid>
        {props.isValidating ? (
          <ValidationBar problemLink={props.problemLink} />
        ) : (
          <></>
        )}
        <Grid
          smOffset={3}
          xsOffset={1.8}
          xs={1}
          sx={{ mr: { xs: 1, sm: -0.5 } }}
        >
          <MailTwoToneIcon />
        </Grid>
        <Grid xs={8.5} sm={8}>
          <TextField
            alignItems="center"
            type="email"
            id="email"
            onChange={props.handleEChange}
            defaultValue={props.userInfo.email}
            variant="standard"
          />
        </Grid>
        <Grid xs={1}>
          <IconButton onClick={props.handleBack}>
            <ArrowCircleLeftRoundedIcon fontSize="medium" />
          </IconButton>
        </Grid>
        <Grid xs={4} smOffset={4} xsOffset={3.5} sm={5}>
          <Button
            sx={{ mb: 1.5, mt: 1 }}
            onClick={props.handleSubmit}
            variant="contained"
          >
            Save
          </Button>
        </Grid>
        <Grid xsOffset="auto">
          <IconButton onClick={props.handleDelete}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Grid>
      </Grid>
    );
  }

  function ValidationBar(props) {
    let colorTypes = [
      { bkg: "#C5E1A5", act: "#1B5E20" },
      { bkg: "#EF9A9A", act: "#D32F2F" },
    ];
    let [time, setTime] = useState(30);
    let [colorsUsed, setColorsUsed] = useState(colorTypes[0]);

    useEffect(() => {
      const timer = setInterval(() => {
        if (time > 0) {
          setTime((prevTime) => prevTime - 1);
        } else {
          setTime(1);
        }

        if (time < 6) {
          setColorsUsed(colorTypes[1]);
        }
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }, []);

    return (
      <Grid container xs={12}>
        <Grid xs={12}>
          <Typography textAlign="center">Checking...</Typography>
        </Grid>
        <Grid xsOffset={2} smOffset={4}>
          <Box display="inline-flex">
            <Link target="_blank" href={props.problemLink} display="flex">
              Go to problem
            </Link>
            <LaunchIcon fontSize="10" />
            <Box sx={{ position: "relative", ml: 3 }}>
              <CircularProgress
                variant="determinate"
                sx={{
                  color: colorsUsed.bkg,
                }}
                size={40}
                thickness={4}
                {...props}
                value={100}
              />
              <CircularProgress
                variant="determinate"
                size={40}
                thickness={4}
                value={Math.round((time * 100) / 30)}
                sx={{
                  position: "absolute",
                  left: 0,
                  color: colorsUsed.act,
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    );
  }

  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  }));

  async function getUserRatings(handle) {
    /*
  Codeforces API request user.info to get user-ratings: current and max
  */
    let url = "https://codeforces.com/api/user.info?handles=" + handle;
    try {
      const { data } = await axios.get(url);
      console.log(data["result"][0]);
      return data["result"][0];
    } catch (err) {
      console.log(err);
    }
  }

function UserProfile() {

  const Context = useAuthContext();
  
  const client = axios.create({
      baseURL: "http://localhost:4000/",
      WithCredentials: true,
      headers: { Authorization: `Bearer ${Context.user.token}` },
  });
  
  let userId = Context.user.id;
  let [handle, setUserHandle] = useState(Context.user.handle);
  let [userInfo, setUserInfo] = useState({ userName: null, email: null });
  let [isEdit, setisEdit] = useState(false);
  let [validated, setValidated] = useState(true);
  let [isDialogOpen, setisDialogOpen] = useState(false);
  let [isValidating, setisValidating] = useState(false);
  let [typedHandle, setTypedHandle] = useState(null);
  let [problem, setProblem] = useState({
    contestId: null,
    problemIndex: null,
    problemlink: null,
  });
  let [handleAlert, setHandleAlert] = useState(false);
  let [saveAlert, setSaveAlert] = useState({ display: false, type: null });
  let [isDeleteAlertOpen, setisDeleteAlertOpen] = useState(false);


  async function updateUserInfo(userId, userInfo, handle) {
    let postData = {
      name: userInfo.userName,
      email: userInfo.email,
      handle: handle,
    };
    let url = "/profile/" + userId + "/edit";
    const { data } = await client.post(url, postData);
    console.log(data);
    return data;
  }

  async function getUserInfo(userId) {
    /*
  Request to database for userInfo
  */
    let url = "/profile/" + userId;
    const { data } = await client.get(url);
    return data;
  }

  let [userRatings, setUserRatings] = useState({
    currentRating: "-",
    maxRating: "-",
  });
  let [userDBStats, setUserDBStats] = useState({
    problemsSolved: null,
    maxPOTDStreak: 0,
    POTDGlobalMax: 1,
  });
  
  function handleSave() {
    if (validated) {
      // add email validation
      updateUserInfo(userId, userInfo, handle)
        .then((data) => {
          setisEdit(false);
          setUserHandle(data.handle);
          setUserInfo({ userName: data.name, email: data.email });
          setUserDBStats({
            ...userDBStats,
            problemsSolved: data.solvedProblems,
          });
          setSaveAlert({ display: true, type: "success" });
        })
        .catch((err) => {
          console.log(err);
          setSaveAlert({ display: true, type: "error" });
        });
    } else {
      setSaveAlert({ display: true, type: "handle error" });
      console.log("Validate the handle!");
      return <Typography>Button Clicked!</Typography>;
    }
  }

  function handleHChange(e) {
    let th = e.target.value;
    console.log(th);
    setTypedHandle(th);
    if (th !== handle) {
      setValidated(false);
      setSaveAlert({ ...saveAlert, display: false });
    } else {
      setValidated(true);
    }
  }

  function handleContinue() {
    setisDialogOpen(false);
    setisValidating(true);
    let p = generateRandomProblem();
    console.log(p);
    setProblem(p);
    setTimeout(() => {
      checkSubmission(typedHandle, p).then((res) => {
        if (res === true) {
          console.log("Handle validated!");
          setUserHandle(typedHandle);
          setTypedHandle(null);
          setValidated(true);
        } else {
          console.log("Handle is not validated");
        }
        setHandleAlert(true);
        setisValidating(false);
      });
    }, 30000);
  }

  function handleDelete(uId) {
    let url = "/profile/" + uId + "/delete";
    console.log(url);
    client.delete(url).then((res) => {
      if (res.data === "User successfully deleted") {
        //redirect to login
        console.log("deleted");
      }
    });
  }

  function handleClose() {
    setisDialogOpen(false);
    setisValidating(false);
  }

  useEffect(() => {
    // data from db
    getUserInfo(userId).then((data) => {
      setUserHandle(data.handle);
      // catch statement!
      setUserInfo({ userName: data.name, email: data.email });
      setUserDBStats({ ...userDBStats, problemsSolved: data.solvedProblems });
    });
  }, []);

  useEffect(() => {
    // data from cfapi
    if (handle !== null && handle !== undefined) {
      console.log("Running..", handle);
      getUserRatings(handle)
        .then((data) => {
          setUserRatings({
            currentRating: data["rating"],
            maxRating: data["maxRating"],
          });
        })
        .catch((err) => {
          console.log("Error Occurred while fetching from CF API", err);
        });
    }
  }, [handle]);

  return (
    <>
      <Stack alignItems="center">
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <SmallAvatar>
              <IconButton>
                <AddIcon fontSize="small" />
              </IconButton>
            </SmallAvatar>
          }
        >
          <Avatar
            src={profilePic}
            sx={{
              mt: 5,
              mb: -12,
              width: 200,
              height: 200,
              p: 0,
              m: 0,
            }}
          />
        </Badge>
      </Stack>
      <Paper elevation={9} sx={{ mt: -12 }}>
        {/* <CircularProgress/> */}
        {isEdit ? (
          <EditProfile
            handle={handle}
            userInfo={userInfo}
            handleHChange={(e) => handleHChange(e)}
            handleEChange={(e) => {
              setUserInfo({
                userName: userInfo.userName,
                email: e.target.value,
              });
            }}
            handleNChange={(e) =>
              setUserInfo({ email: userInfo.email, userName: e.target.value })
            }
            validated={validated}
            isValidating={isValidating}
            handleVClick={() => {
              setisDialogOpen(true);
            }}
            handleSubmit={handleSave}
            handleBack={() => setisEdit(false)}
            problemLink={problem.problemlink}
            handleDelete={() => {
              setisDeleteAlertOpen(true);
            }}
          />
        ) : (
          <UserInfo
            ratings={userRatings}
            handle={handle}
            userInfo={userInfo}
            handleEditClick={() => {
              setisEdit(true);
            }}
          />
        )}

        {/* Various Alerts on validating the handle and saving the profile */}

        {handleAlert && isEdit ? (
          validated === true ? (
            <AlertWithClose content={"Handle is successfully verified!"} />
          ) : (
            <AlertWithClose
              type="error"
              content={"Time Out! Handle is not verified"}
            />
          )
        ) : (
          <></>
        )}

        {saveAlert.display ? (
          saveAlert.type === "success" ? (
            <AlertWithClose content={"Profile is Updated!"} />
          ) : saveAlert.type === "error" ? (
            <AlertWithClose
              type="error"
              content={"An error occurred while updating the profile!"}
            />
          ) : (
            <AlertWithClose
              type="error"
              content={"Validate handle to update the profile"}
            />
          )
        ) : (
          <></>
        )}

        <InstructionBox
          open={isDialogOpen}
          onContinue={handleContinue}
          onClose={handleClose}
        />

        <DeleteAccountDialogBox
          open={isDeleteAlertOpen}
          onDelete={() => {
            handleDelete(userId);
          }}
          onClose={() => {
            setisDeleteAlertOpen(false);
          }}
        />

        {isEdit ? (
          <></>
        ) : (
          <>
            <Divider variant="middle" role="presentation" />
            <UserStats ratings={userRatings} stats={userDBStats} />
          </>
        )}
      </Paper>
    </>
  );
}

export default UserProfile;
