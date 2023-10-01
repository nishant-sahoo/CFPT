const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const Mime = require('../node_modules/mime-message');

// If modifying these scopes, delete token.json.
const SCOPES =['https://www.googleapis.com/auth/gmail.readonly','https://www.googleapis.com/auth/gmail.send'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

async function sendMail(auth,messageContent){
  const gmail = google.gmail({version: 'v1', auth});

  // create a mime message
  const messageData = {
    type: 'text/html',
    encoding: 'UTF-8',
    
    //change these credentials
    from: 'Putin <cfptwebsite@gmail.com>',
    to: [
      'Stalin <cfptwebsite@gmail.com>',
    ],
    replyTo: [
      'Hitler <cfptwebsite@gmail.com>',
    ],
    date: new Date(),
    subject: 'Some Feedback from CFPT!',
    body: messageContent
  }
   
  if (Mime.validMimeMessage(messageData)) {
    
    const message = Mime.createMimeMessage(messageData)
    const base64SafeString = message.toBase64SafeString()

    // send mail
  try{
    let sentMail = gmail.users.messages.send({userId:'me',resource:{
      raw:base64SafeString
    }});
      return sentMail;
    }catch(err){
        return err;
    }
  }

}

let sendFeedback = async function (req,res){
    let message = '<h2>Contact Us Message:</h2>Name: '+req.body.fullName+
    '<br/>Email: '+req.body.email+'<br/>Contact Number:'+req.body.contactNumber
    +'<br/><h3>Description:</h3>'+req.body.description;

    try{
    authorize().then((auth)=>sendMail(auth,message));
    res.status(200).send('Message sent succesfully!');
    }catch(err){
        console.log(err)
        res.send('There was an error in sending the message!');
    }
    
}

module.exports = sendFeedback;