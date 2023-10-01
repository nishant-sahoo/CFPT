import axios from 'axios';

function generateRandomProblem(){
    let contestId = Math.floor((Math.random()*1779)+1);
    let idx = ['A','B','C'];
    let problemIndex =  idx[Math.floor(Math.random()*2)];
    let problemlink = 'https://codeforces.com/problemset/problem/' + contestId +'/'+problemIndex;

    return {contestId,problemIndex,problemlink};
}

async function lookForSubmission(handle){
    let checkLink = 'https://codeforces.com/api/user.status?handle='+handle+'&from=1&count=1';
    let {data} = await axios.get(checkLink);
    return data;
    
}

async function checkSubmission(handle,problem){
    let problemIndex = problem['problemIndex'];
    let contestId_ = problem['contestId'];

    console.log(problem);
    return lookForSubmission(handle).then((submission)=>{
        let {contestId,index} = submission['result'][0]['problem'];
        if(contestId===contestId_ && index===problemIndex){
            let submissionTime = submission['result'][0]['creationTimeSeconds'];
            let difference =(Date.now()/1000) - submissionTime;
            console.log(difference);
            if(difference < 30){
                return true;
            };
        }
        return false;
    }).catch((err)=>  {return err})
    
}
  

export {checkSubmission, generateRandomProblem}