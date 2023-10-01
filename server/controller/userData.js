const AllProblems = require("../Model/allProblems");
const User = require("../Model/user");
const axios = require("axios");

module.exports.getRating = async(req, res) => {
    let user = req.body.user;
    let url = "https://codeforces.com/api/user.info?handles=" + user;
    axios.get(url)
        .then((response) => {
            let data = response["data"];
            if(data["status"] == "FAILED")
            {
                return res.status(500).send("User not found");
            }
            let rating;
            if(data["result"][0].hasOwnProperty("rating"))
            {
                if(data["result"][0]["rating"] < 800)
                    rating = 800;
                else
                    rating = data["result"][0]["rating"];
            }
            else
            {
                rating = 800;
            }
            // console.log(data["result"][0]);
            res.status(200).send({rating : rating});
        })
        .catch((err) => {
            console.log(err.message);
        })
}

module.exports.isSolved = async(req,res) => {

    let problem = req.body.problem;
    let user = req.body.user;
    let contestId = "", problemIdx = "";
    let index = 0;
    for(let i = 0; i<problem.length; i++)
    {
        if(problem[i] >= '0' && problem[i] <= '9')
            contestId += problem[i];
        else
        {
            index = i;
            break;
        }
    }

    for(let i = index; i<problem.length; i++)
    {
        problemIdx += problem[i];
    }

    let url = "https://codeforces.com/api/contest.status?contestId=" + contestId + "&handle=" + user;
    axios.get(url)
        .then((response) => {
            let data = response["data"];
            if(data["status"] == "FAILED")
            {
                return res.status(500).send("Problem Status could not be checked");
            }

            data = data["result"];
            for(let i = 0; i<data.length; i++)
            {
                if(data[i]["problem"]["index"] === problemIdx && data[i]["verdict"] === "OK")
                    return res.status(200).send({isSolved: true});
            }
            return res.status(200).send({isSolved: false});
        })
        .catch((err) => {
            console.log(err.message);
        })
}

module.exports.getProblem = async(req,res) => {

    let rating = req.body.rating;
    let tags = req.body.tags;
    let lowerBound = req.body.lowerBound;
    let upperBound = req.body.upperBound;

    let up = rating + upperBound;
    let down = rating + lowerBound;

    if(tags.includes("any"))
    {
        AllProblems.countDocuments({rating: {$gte: down, $lte:up}}).exec((err,count) => {
            if(err)
            {
                console.log(err.message);
                return res.status(500).send("There was issue counting the number of problems.")
            }
            else
            {
                var random = Math.floor(Math.random() * count);
                AllProblems.findOne({rating: {$gte: down, $lte:up}}).skip(random).exec((err, problem) => {
                    if(err)
                    {
                        console.log(err.message);
                        return res.status(500).send("There was an issue generating a new problem.");
                    }
                    else
                    {
                        // console.log(problem);
                        res.status(200).send({problem});
                    }
                })
            }
        })
    }
    else
    {
        AllProblems.countDocuments({rating: {$gte: down, $lte:up}, tags: {$all : tags}}).exec((err,count) => {
            if(err)
            {
                console.log(err.message);
                return res.status(500).send("There was issue counting the number of problems.")
            }
            else
            {
                var random = Math.floor(Math.random() * count);
                AllProblems.findOne({rating: {$gte: down, $lte:up}, tags: {$all : tags}}).skip(random).exec((err, problem) => {
                    if(err)
                    {
                        console.log(err.message);
                        return res.status(500).send("There was an issue generating a new problem.");
                    }
                    else
                    {
                        // console.log(problem);
                        res.status(200).send({problem});
                    }
                })
            }
        })
    }

}