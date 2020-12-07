const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByName, getUserById){

    const authenticateUser = async (username, password, done) => {
        const user = getUserByName(username)
        let hashedPassword = user.password

        if(user == null){
            console.log("User doesnt exist");
            return done(null, false)
        }

        
        bcrypt.genSalt(10, (err, salt) => {
            if(err){
                throw err
            }
            else{
                bcrypt.hash(hashedPassword, salt, (err, hash) =>{
                    if(err){
                        throw err
                    }
                    else{
                        hashedPassword = hash;
                        try{
                            bcrypt.compare(password, hashedPassword, (err, match) =>{
                                if(err){
                                    console.log("Error 1 occured")
                                    throw err
                                }else if(!match){
                                    console.log("Passwords do not match")
                                    return done(null, false)
                                }else{
                                    console.log("Passwords match")
                                    return done(null, user)
                                }
                            })
                        }catch(err){
                            console.log("Error 2")
                            return done(err)
                        }
                    }
                })
            }
        })
    
    }

    passport.use(new localStrategy(authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize;
