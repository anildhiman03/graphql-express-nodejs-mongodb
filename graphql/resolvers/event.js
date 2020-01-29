const Event = require('../../models/event');
const User = require('../../models/user');
const { eventResponse } = require('./common');

module.exports = {
    events: async () => {
        try {
        const event = await Event.find()
        // return Event.find().populate('creator') // we can use populate function to show relational data but here
        // we are using bind function to show data
            // return res;
            // console.log(res);
            return event.map(eachEvent => {
                return eventResponse(eachEvent); // response coming from func.
            })
        } catch(err) {
            throw err;
        };
    },
    createEvent : async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Invalid Access')
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        })
        let createdEventParam;
        try {
            const result = await event
            .save()
                createdEventParam = eventResponse(result); // response coming from func.{ 
                // createdEventParam = res ;
                console.log(createdEventParam);
                // saving event id in user table
                const user = await User.findById(req.userId);

                if (!user) {
                    throw new Error('user not found');
                }
                // storing event in user object
                user.createdEvents.push(event);
                await user.save()

            // .then(res => { // after user save promise subscription
                return createdEventParam;
            // })
            // .catch(err => { // if save failed then subscrip
            //     throw err;
            // })
            // .catch(err => { // in case user not find then error
            //     throw new Error ('User not exist');
            // })
            //     // return {...res._doc};
        } catch(err) {
            throw err;
        };
    }

}