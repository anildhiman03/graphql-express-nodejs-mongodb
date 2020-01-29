const bcrypt = require ('bcryptjs');
const User = require('../../models/user');
const { eventFunc } = require('./common');
const jwt = require('jsonwebtoken');

module.exports = {
    
    users: async () => {
        try {
        // return User.find().populate('createdEvents') // to fetch relational data
        const user = await User.find()
        // .then(res => {
            // return res; // we can just direclty pass this also
            // console.log(res);{user}
            return user.map(singleUser => {
                return { 
                    ...singleUser._doc, 
                    password:null,
                    createdEvents:eventFunc.bind(this,singleUser.createdEvents) } ; // or we can use like this also to protect password field
            })
        } catch(err){
            throw err;
        };
    } ,
    createUser : async args => {

        // check unique
        try {
            const userExist = await User.findOne({email:args.userInput.email})
            if (userExist) {
                throw new Error('user already exist');
            }

            // encripting hash password then subscribing and saving date inside of that
            const bcriptPassword =  await bcrypt.hash(args.userInput.password,12)
            // .then(hashedPass => { // if fine then move on
                const user = new User({
                    email: args.userInput.email,
                    password: bcriptPassword,
                    date: new Date(args.userInput.date),
                })
                const userSaveResult = await user.save()
                // .then( res => {
                    // return res ;
                    return { 
                        ...userSaveResult._doc, 
                        password:null 
                    } ; // or we can use like this also to protect password field
                        
        } catch(err) {
            throw err;
        };
    },
    // login: async args => { // can use like this also
    login: async ({email, password}) => {
        const user = await User.findOne({email : email});
        if (!user) {
            throw new Error('User not found');
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
          throw new Error('Password is incorrect!');
        }
    

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            'somesupersecretkey',
            {
              expiresIn: '1h'
            }
          );
          return { userId: user.id, token: token, tokenExpiration: 1 };
    }
}