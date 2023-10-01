const axios = require('axios');
const AllProblems = require("../Model/allProblems");

let url = "https://codeforces.com/api/problemset.problems"
axios.get(url)
    .then((res) => {
        if(res["status"] == "FAILED")
        {
            console.log("Couldn't Fetch Problems");
            return;
        }
        let data = res["data"]["result"]["problems"];
        addProblems(data);
    })

async function addProblems(data)
{
    // console.log(data);
    for(let i = 0; i<data.length; i++)
    {
        let problem = data[i];
        try
        {
            let problemName = problem["name"];
            let id = problem["contestId"].toString() + problem["index"];
            let tags = problem["tags"]; 
            if(problem.hasOwnProperty("rating"))
            {
                let rating = problem["rating"];
                const p = await AllProblems.create({name : problemName, id : id, tags : tags, rating : rating});
            }
            else
            {
                const p = await AllProblems.create({name : problemName, id : id, tags : tags});
            }
        }
        catch(e)
        {
            // console.log(e);
        }
    }
    // console.log("All Problems Added to Database");
}

// addProblems();

