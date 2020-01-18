const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcript = require ('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();
const events = [];

const eventFunc = eventIds => {
    return Event.find( { _id: { $in:eventIds } } )
    .then( event => {
        return event.map(evnt => {
            return {...evnt._doc, creator: userFunc.bind(this,evnt.creator)}
        })
    })
    .catch(error => {
        throw error;
    })
}


// create this method to show relational data
const userFunc = userID => {
    return User.findById(userID)
    .then(user => {
        // we can directly send user keyword also but 
        // here we use like below to set pasword as null
        return { ...user._doc, password : null, createdEvents:eventFunc.bind(this,user.createdEvents) }
    })
    .catch(err => {
        throw err;
    })
}

app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    res.send('Hi!!!');
});

app.use('/graphql',graphQlHttp({
    schema:buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price : Float!
            date: String!
            creator:User!
        }

        type User {
            _id: ID!
            email: String!
            password: String
            createdEvents:[Event!]
        }

        input UserInput {
            email: String!
            password: String!
        }

        input EventInput {
            title: String!
            description: String!
            price : Float!
            date: String!
        }

        type RootQuery {
            events : [Event!]!
            users : [User!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput) : Event
            createUser(userInput: UserInput) : User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find()
            // return Event.find().populate('creator') // we can use populate function to show relational data but here
            // we are using bind function to show data
            .then(res => {
                // return res;
                // console.log(res);
                return res.map(event => {
                    return {...event._doc,creator:userFunc.bind(this,event.creator)}
                })
            })
            .catch(err => {
                throw err;
            })
            ;
        } ,
        createEvent : (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: "5e22c388161507862feba721"
            })
            let createdEventParam;
            return event
            .save()
            .then( res => {
                createdEventParam = { ...res._doc,creator:userFunc.bind(this,event.creator)} ;
                // createdEventParam = res ;
                console.log(createdEventParam);
                // saving event id in user table
                return User.findById('5e22c388161507862feba721');
            })
            .then( user => { // user find by id then
                // storing event in user object
                user.createdEvents.push(event);
                return user.save()
            })
            .then(res => { // after user save promise subscription
                return createdEventParam;
            })
            .catch(err => { // if save failed then subscrip
                throw err;
            })
            .catch(err => { // in case user not find then error
                throw new Error ('User not exist');
            })
                // return {...res._doc};
            .catch(err => {
                throw err;
            });
        },
        users: () => {
            return User.find().populate('createdEvents')
            .then(res => {
                // return res; // we can just direclty pass this also
                // console.log(res);{user}
                return res.map(user => {
                    return { ...user._doc, password:null } ; // or we can use like this also to protect password field
                })
            })
            .catch(err => {
                throw err;
            })
            ;
        } ,
        createUser : (args) => {

            // check unique

            return User.findOne({email:args.userInput.email})
            .then(exist => {
                if (exist) {
                    throw new Error('user already exist');
                }
                    // encripting hash password then subscribing and saving date inside of that
                    return bcript.hash(args.userInput.password,12)
                            .then(hashedPass => { // if fine then move on
                                const user = new User({
                                    email: args.userInput.email,
                                    password: hashedPass,
                                    date: new Date(args.userInput.date),
                                })
                                return user
                                .save()
                                .then( res => {
                                    // return res ;
                                    return { ...res._doc, password:null } ; // or we can use like this also to protect password field
                                }).catch(err => {
                                    throw err;
                                });
                            })
                            .catch(err => {
                                throw err;
                            })
                });
            
        }
    },
    graphiql: true
}));

// db connection
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-0lmtn.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
).then(() => {
    // starting the app
    app.listen(3000);
}).catch(err => {
    console.log(err);
})
