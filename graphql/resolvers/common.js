// store all common methods in this file
const { dateToString } = require('../../helpers/date');
const User = require('../../models/user');
const Event = require('../../models/event');

const eventResponse = evnt => {
    return {
        ...evnt._doc, 
        creator: userFunc.bind(this,evnt.creator),
        date: dateToString(evnt.date)
    }
}

const bookingResponse = booking => {
    return {
        ...booking._doc, 
        createdAt: dateToString(booking.createdAt),
        updatedAt: dateToString(booking.updatedAt),
        user: userFunc.bind(this, booking._doc.user),
        event: singleEventFunc.bind(this, booking._doc.event)
    }
}

const eventFunc = async eventIds => {
    try{
    const event = await Event.find( { _id: { $in:eventIds } } )
        return event.map(evnt => {
            return eventResponse(evnt); // response coming from func.
        })
    } catch(error) {
        throw error;
    }
}

const singleEventFunc = async eventId => {
    try{
        const event = await Event.findById(eventId);
        if (!event) {
            throw new Error('event not found');
        }
        return eventResponse(event); // response coming from func.
    } catch(error) {
        throw error;
    }
}


// create this method to show relational data
const userFunc = async userID => {
    try {
    const user =  await User.findById(userID)
        // we can directly send user keyword also but 
        // here we use like below to set pasword as null
        return { 
            ...user._doc, 
            password : null, 
            createdEvents:eventFunc.bind(this,user.createdEvents) 
        }
    } catch(err){
        throw err;
    }
}


// exports.userFunc = userFunc;
exports.eventFunc = eventFunc;
// exports.singleEventFunc = singleEventFunc;
exports.eventResponse = eventResponse;
exports.bookingResponse = bookingResponse;