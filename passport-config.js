const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByName, getUserById){

    const authenticateUser = async (username, password, done) => {
        const user = getUserByName(username)

        if(user == null){
            return done(null, false)
        }

        try{
            bcrypt.compare(password, user.password, function(err, match){
                if(err){
                    throw err
                }else if(!match){
                    return done(null, false)
                }else{
                    return done(null, user)
                }
            })
        }catch(e){
            return done(e)
        }
    }

    passport.use(new localStrategy(authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize;