require('dotenv').config();
const express = require('express');
const dialogflow = require('@google-cloud/dialogflow');
const structjson = require('./structjson');
const cors = require('cors');
const uuid = require('uuid');

const { sequelize, chat, User } = require('./models');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

const projectId = 'dialowflow-350619'
  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  app.post('/textQuery', async (req, res) => {
    //We need to send some information that comes from the client to Dialogflow API 
    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text: req.body.text,
          // The language used by the client (en-US)
          languageCode: 'en-US',
        },
      },
    };
  
    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`);
    } else {
      console.log('  No intent matched.');
    }
  });


  app.post('/eventQuery', async (req, res) => {
    //We need to send some information that comes from the client to Dialogflow API 
    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            event: {
                // The query to send to the dialogflow agent
                name: req.body.event,
                // The language used by the client (en-US)
                // languageCode: languageCode,
                languageCode: 'en-US',
            },
        },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);

    res.send(result)
})




app.listen({ port: 5000}, async () => {
    console.log('Server up on http://localhost:5000');

    // create new tables with sync, not auth
    await sequelize.sync({ force: true })
    // await sequelize.sync({ alter: true })

    // auth allows use of premade tables
    // await sequelize.authenticate()
    console.log('Database Synced!');
}
)

// app.listen(5000, function(){
//   console.log("Server started on port 5000.");
// });