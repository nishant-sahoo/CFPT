const express = require('express');
// const router = express.Router();
// const bodyParser = require('body-parser');

// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(bodyParser.json());
const User = require('../Model/user');

// get the user id form log-in data stored in local storage

const getUser = async function (req, res, next) {
        User.findById(req.params.id, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("No user found.");
            res.status(200).json({
                name : user.name,
                email : user.email,
                handle : user.handle,
                isAdmin : user.isAdmin,
                profilePhoto : user.profilePhoto,
                solvedProblems : user.solvedProblems.length,
                // POTDStreak : 
            });
            // next();
            // res.status(200).send(user)
        });
    };

// update userName,email,handle
const updateUserInfo = async function (req, res) {
    User.findByIdAndUpdate(req.params.id,req.body,{new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).json({
            name : user.name,
            email : user.email,
            handle : user.handle
        });
    });
};

// update userRatings in the database when page refreshes
const updateUserRatings = async function (req, res) {
    User.findByIdAndUpdate(req.params.id,req.body,{new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).json({
            rating : user.rating,
            maxRating : user.maxRating,
            POTDStreak : user.POTDStreak.POTDStreakInfo.maxPOTDStreak
        });
    });
};

const deleteUser = async function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
      if (err){
        console.log(err);
        return res.status(500).send("There was a problem deleting the user.");
      } 
      res.status(200).send("User successfully deleted");
    });
  };

module.exports = {getUser,updateUserInfo,updateUserRatings,deleteUser};