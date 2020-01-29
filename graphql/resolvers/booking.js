const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { eventResponse, bookingResponse } = require('./common');
 // booking respolver means all controller methods related with booking
module.exports = {
    bookings : async (args,req) => {
        if (!req.isAuth) {
            throw new Error('Invalid Access')
        }
        try { 
                const booking = await Booking.find();
                return booking.map(eachBooking => {
                    return bookingResponse(eachBooking);  // common method
                })
        } catch(err) { 
            throw err; 
        }
    },
    bookEvent : async (args,req) => {
        if (!req.isAuth) {
            throw new Error('Invalid Access')
        }
        const singleEvent = await Event.findOne({ _id: args.eventId });
        if (!singleEvent) {
            throw new Error('event not found');
        };

        const booking = new Booking({
            user : req.userId,
            event:singleEvent
        });
        // return await booking.save();
        const saveBooking = await booking.save();
        return bookingResponse(saveBooking); // common method
    },
    cancelBooking: async (args,req) => {
        if (!req.isAuth) {
            throw new Error('Invalid Access')
        }
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            
            if (!booking) {
                throw new Error('booking not found');
            }
            const event = eventResponse(result.event);
            
            if (!booking.delete()) {
                throw new Error('error while deleting booking');
            }
            return event;

        } catch (err) {
            throw err;
        }
    }

}