const AllProblems = require("../Model/allProblems");
const axios = require("axios");

//Returns 0 if problem is solved by an user & 1 if problem is solved & 2 in case of error
// const isValid = (problem, user) => {

//     problem = problem["problem"];
//     id = problem["id"];
//     var contestId = 0
//     for(let i = 0; i<id.length; i++)
//     {
//         if(!(id[i] >= '0' && id[i] <= '9'))
//             break;
//         contestId = contestId * 10 + (id[i] - '0');
//     }

//     let url = "https://codeforces.com/api/contest.status?contestId=" + contestId.toString() + "&handle=" + user;

//     return axios.get(url).then((res) => {
//         data = res["data"];
//         if(data["status"] == "FAILED")
//         {
//             console.log("Couldn't check if the problem was solved");
//             return 2;
//         }
//         data = data["result"];
//         for(let i = 0; i<data.length; i++)
//         {
//             let name = data[i]["problem"]["index"];
//             let verdict = data[i]["verdict"];
//             if(name === problem["name"] && verdict === "OK")
//             {
//                 return 0;
//             }
//         }
//         return 1;
//     })
// }

module.exports.generateProblem = async(req, res) => {
    
    let user = req.body.user;
    let lowerBound = 150;
    let upperBound = 150;
    // console.log(user);
    let url = "https://codeforces.com/api/user.info?handles=" + user;
    axios.get(url)
        .then((response) => {
            let data = response["data"];
            if(data["status"] == "FAILED")
            {
                return res.status(500).send("User not found");
            }
            let rating = (data["result"][0].hasOwnProperty("rating")) ? data["result"][0]["rating"] : 800;
            let up = rating + upperBound;
            let down = rating - lowerBound;
            AllProblems.countDocuments({rating:{$gte:down,$lte:up}}).exec((err,count) => {
                if(err)
                {
                    console.log(err.message);
                    return res.status(500).send("There was an issue counting the number of problems");
                }
                var random = Math.floor(Math.random() * count);
                AllProblems.findOne({rating:{$gte:down,$lte:up}}).skip(random).exec((err,problem) => {
                    if(err)
                    {
                        console.log(err.message);
                        return res.status(500).send("There was an issue generating a new problem.");
                    }
                    res.status(200).send({problem : problem});
                });
            });
        })
        .catch((e) => {
            console.log("Backend = " + e.message);
        })

}