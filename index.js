const express=require('express');
var session=require('express-session');
const passport=require('passport');
const app=express();

app.set('view engine','ejs');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID='649268603964-4smdaretsvq86a3hhpe5vnuertp9kt2b.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET='Li0I104ifqDjd4PBBWrh5fuY'

var userProfile;

app.use(session({
    secret:'googleAuth',
    saveUninitialized:'true',
    resave:true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/',(req,res)=>{
    res.render('../pages/auth');

})

app.get('/error',(req,res)=>{
  res.send('Error in login with gmail...') ; 
})
app.get('/success',(req,res)=>{
    res.send(userProfile);
    
})

passport.serializeUser((user,cb)=>{
    return cb(null,user);
})

passport.deserializeUser((obj,cb)=>{
    return cb(null,obj);
})

passport.use(new googleStrategy({
    clientID:GOOGLE_CLIENT_ID,
    clientSecret:GOOGLE_CLIENT_SECRET,
    callbackURL:"http://localhost:3000/auth/google/callback"
},
function(accessToken,refreshToken,profile,done){
userProfile=profile;
return done(null,userProfile);
}));

app.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
app.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/error'}),
function(req,res){
    res.redirect('/success')
});

const port=process.env.PORT||3000;

app.listen(port,()=>{
    console.log('App listening on port' +port)
});

