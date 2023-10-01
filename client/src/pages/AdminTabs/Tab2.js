import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useAuthContext } from "../../hooks/useAuthContext";

const useStyles = makeStyles({
  inputField: {
    width: "80%",
    borderRadius: 10,
    backgroundColor: "#224957",
    color: "#ffffff",
  },
  active: {
    backgroundColor: "#224957",
  },
});

function Tab2() {
  const { user } = useAuthContext();

  const client = axios.create({
    baseURL: "http://localhost:4000/",
    headers: { Authorization: `Bearer ${user.token}` },
    WithCredentials: true,
  });
  const classes = useStyles();
  const [isChecked, setChecked] = useState(false);
  const [psName, setPsName] = useState("");
  const [editPS, setEditPS] = useState({});
  const [deletePS, setDeletePS] = useState({});
  const [selectValue, setSelectValue] = useState({});
  const [value, setValue] = useState({});
  const [events, setEvents] = useState([]);
  const [menuItems, setItems] = useState([]);

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const filterOptions = (options, state) => {
    let newOptions = [];
    options.forEach((element) => {
      if (
        element.eventName &&
        element.eventName
          .replace(",", "")
          .toLowerCase()
          .includes(state.inputValue.toLowerCase())
      )
        newOptions.push(element);
    });
    return newOptions;
  };
  const handleListItemClick = (event, index, PS) => {
    setSelectedIndex(index);
    setEditPS(PS);
  };
  const loadEvents = async () => {
    client
      .get(`create`)
      .then((res) => {
        setEvents(res.data.event);
        // console.log(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (user) {
      console.log(user);
      loadEvents();
    }
  }, [user]);

  useEffect(() => {
    // console.log(selectValue.allProblems);
    setItems([]);
    if (Object.keys(selectValue).length !== 0) {
      Promise.all(
        selectValue.allProblems.map((value) =>
          client.get(`create/ps/${value}`, { WithCredentials: true })
        )
      ).then((data) => {
        console.log(data);
        data.map((val) => {
          if (val.data.problemset)
            setItems((prev) => [...prev, val.data.problemset]);
        });
      });
      // selectValue.allProblems.map((value) => {
      //   loadPS(value);
      // });
    }
  }, [selectValue]);

  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.nativeEvent.submitter.name === "savebtn") {
      if (Object.keys(selectValue).length === 0) {
        if (!value.eventName) {
          alert("Enter preoper name");
          return;
        }
        client
          .post("create", {
            eventName: value.eventName,
            isArchived: value.isArchived,
          })
          .then((res) => {
            setEvents((prev) => [...prev, res.data.event]);
            setSelectValue(res.data.event);
            // console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        if (!value.eventName) {
          alert("Enter preoper name");
          return;
        }
        client
          .patch(`create/${selectValue._id}`, {
            eventName: value.eventName,
            isArchived: value.isArchived,
          })
          .then((res) => {
            let newArr = events.filter((data) => data._id !== selectValue._id);
            setEvents([...newArr, res.data.event]);
            setSelectValue(res.data.event);
            // console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else if (e.nativeEvent.submitter.name === "deletebtn") {
      if (Object.keys(selectValue).length !== 0) {
        client
          .delete(`create/${selectValue._id}`)
          .then((res) => {
            setEvents(events.filter((data) => data._id !== selectValue._id));
            setSelectValue({});
            setValue({});
            // console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else if (e.nativeEvent.submitter.name === "addbtn") {
      if (!psName) {
        alert("Enter preoper name");
        return;
      }
      client
        .post(`create/${selectValue._id}`, {
          name: psName,
        })
        .then((res) => {
          setItems((prev) => [...prev, res.data.problemset]);
          setPsName("");
          // console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (e.nativeEvent.submitter.name === "editPSbtn") {
      if (Object.keys(editPS).length === 0) {
        alert("Enter preoper name");
        return;
      }
      client
        .patch(`create/ps/${editPS._id}`, {
          name: editPS.problemSetName,
        })
        .then((res) => {
          let newArr = menuItems.filter((data) => data._id !== editPS._id);
          setItems([...newArr, res.data.problemset]);
          setEditPS(res.data.problemset);

          // console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (e.nativeEvent.submitter.name === "deletePSbtn") {
      client
        .delete(`create/ps/${deletePS._id}`)
        .then((res) => {
          setItems(menuItems.filter((data) => data._id !== deletePS._id));
          setDeletePS({});
          setEditPS({});
          // console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const defaultProps = {
    options: events,
    getOptionLabel: (option) =>
      Object.keys(option).length !== 0 ? option.eventName : "",
    isOptionEqualToValue: (option, value) => {
      if (Object.keys(value).length === 0) {
        return true;
      } else if (value._id === option._id) {
        return true;
      }
    },
  };
  return (
    <Box>
      <Box>
        <form name="upper_part" onSubmit={handleSubmit}>
          {/* <Autocomplete
            name="title"
            labelId="select-filled-label"
            id="Events"
            value={selectValue}
            onChange={handleChange}
            sx={{ color: "primary.main" }}
            options={events}
            renderInput={(params) => <TextField {...params} label="Events" />}
          /> */}
          {/* <MenuItem key="0" value="">
              <em>New Event</em>
            </MenuItem>
            {events.map((event, i) => {
              return (
                <MenuItem key={event._id} value={event}>
                  {event.eventName}
                </MenuItem>
              );
            })} */}
          <Autocomplete
            {...defaultProps}
            id="clear-on-escape"
            name="title"
            clearOnEscape
            filterOptions={filterOptions}
            value={selectValue}
            onChange={(e, val) => {
              if (val !== null) {
                setSelectValue(val);
                setValue(val);
              } else {
                setSelectValue({});
                setValue({});
              }
            }}
            sx={{ width: 300 }}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option._id}>
                  {option.eventName}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField key="" {...params} label="Event" variant="standard" />
            )}
          />

          <Grid container spacing={2} sx={{ my: 2, mx: 1 }}>
            <Grid container item xs={12} sm={6} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="name"
                  label="Name"
                  name="eventName"
                  variant="filled"
                  value={value.eventName || ""}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="medium"
                      name="isArchived"
                      checked={!!value.isArchived}
                      onChange={(e) =>
                        setValue({
                          ...value,
                          isArchived: !value.isArchived,
                        })
                      }
                      color="primary"
                    />
                  }
                  label={
                    <Typography color="primary" sx={{ fontWeight: "600" }}>
                      Archived
                    </Typography>
                  }
                  labelPlacement="start"
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} sm={6} spacing={1}>
              <Grid item xs={12}>
                <Button
                  aria-label="save-event"
                  variant="contained"
                  type="submit"
                  name="savebtn"
                  endIcon={<SaveIcon />}
                  sx={{ width: "20%" }}
                >
                  Save
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  aria-label="delete-event"
                  variant="contained"
                  type="submit"
                  name="deletebtn"
                  sx={{ width: "20%" }}
                  endIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Box>
      <Box display={Object.keys(selectValue).length !== 0 ? "block" : "none"}>
        <form name="lower_part" onSubmit={handleSubmit}>
          <Typography variant="h5" sx={{ color: "primary.main", my: 2 }}>
            ProblemSets
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <List
                sx={{
                  backgroundColor: "white",
                  width: "100%",
                  maxWidth: 500,
                  overflow: "auto",
                  mr: 10,
                  bgcolor: "background.paper",
                  maxHeight: 300,
                  // selected and (selected + hover) states
                  "&& .Mui-selected, && .Mui-selected:hover": {
                    bgcolor: "#20DF7F",
                  },
                }}
              >
                {menuItems.map((item, i) => {
                  // console.log(item);
                  return (
                    <ListItemButton
                      key={item._id}
                      className="PS"
                      selected={selectedIndex === item._id}
                      onClick={(e) => handleListItemClick(e, item._id, item)}
                    >
                      <ListItemText primary={item.problemSetName} />
                      <IconButton
                        color="primary"
                        aria-label="delete-ps"
                        component="label"
                      >
                        <Button
                          type="submit"
                          name="deletePSbtn"
                          sx={{ all: "inherit" }}
                          onClick={(e) => setDeletePS(item)}
                        >
                          <DeleteIcon />
                        </Button>
                      </IconButton>
                    </ListItemButton>
                  );
                })}
              </List>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  display: "inline-flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}
              >
                <TextField
                  variant="filled"
                  label="Add Problemset"
                  sx={{ mt: 1 }}
                  value={psName}
                  onChange={(e) => setPsName(e.target.value)}
                />

                <IconButton
                  color="primary"
                  aria-label="add-ps"
                  component="label"
                >
                  <Button type="submit" name="addbtn" sx={{ all: "inherit" }}>
                    <AddCircleIcon />
                  </Button>
                </IconButton>
              </Box>
              <Box
                sx={{
                  display: "inline-flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  mt: 2,
                }}
              >
                <TextField
                  variant="filled"
                  label="Edit Problemset"
                  sx={{ mt: 1 }}
                  disabled={selectedIndex === -1}
                  value={editPS.problemSetName || ""}
                  onChange={(e) =>
                    setEditPS({ ...editPS, problemSetName: e.target.value })
                  }
                />

                <IconButton
                  color="primary"
                  aria-label="edit-ps"
                  component="label"
                >
                  <Button
                    type="submit"
                    name="editPSbtn"
                    sx={{ all: "inherit" }}
                  >
                    <SaveIcon />
                  </Button>
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
}

export default Tab2;
