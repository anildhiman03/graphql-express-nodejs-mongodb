const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolver = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth')
const app = express();
const events = [];

app.use(isAuth)

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
})

app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    res.send('Hi!!!');
});

app.use('/graphql',graphQlHttp({
    schema:    graphQlSchema,
    rootValue:  graphQlResolver,
    graphiql: true
}));

// db connection
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-0lmtn.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
).then(() => {
    // starting the app
    app.listen(8000);
}).catch(err => {
    console.log(err);
})
