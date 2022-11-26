const express=require('express')
const app=express()
const session = require('express-session')
const mongoose = require('mongoose')
const mongoSession=require('connect-mongodb-session') (session)
const UserModel=require('./models/User')
const bcrypt=require('bcrypt')
const mongoURI='mongodb://localhost:27017/UserData';




////MONGODB AND SESSION CREATION
mongoose
.connect('mongodb://localhost:27017/UserData',{
    useNewUrlParser:true,
    useUnifiedTopology:true
    
}).then((res)=>{
    console.log('mongodb connected');
})


const store = new mongoSession({
    uri:mongoURI,
    collection:'mysession'
})


app.set('view engine','ejs')
app.use(express.urlencoded({extends:true}))




app.use(session({
    secret:'hellooooo',
    resave:false,
    saveUninitialized:false,
    store:store,
  
})
);

app.use((req,res,next)=>{
    res.header(
        "Cache-Control",
        "no-cache,privet,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0"
    );
next();
})

const isAuth = (req, res, next)=>{
if(req.session.isAuth){
    next()
}else{ 
    res.redirect('/login')
}
}


/// SERVER GET AND POST

app.get('/',(req,res)=>{

    res.render('landing')
})


app.get('/login',(req,res)=>{
  
    res.render('login')
})




app.post('/login', async(req,res)=>{
    const {email ,Password}=req.body

const user=await UserModel.findOne({email})



if(!user){
   return res.redirect('/login')

}

const isMatch = await bcrypt.compare(Password,user.Password)

if(!isMatch){
  


 return res.redirect('/login')   
}
req.session.isAuth = true
res.redirect('/dashboard')

}
)


app.get('/register',(req,res)=>{
    res.render('register')
})






app.post('/register',async(req,res)=>{
    const {username,email,Password}=req.body

let user = await UserModel.findOne({email});
if(user){
  return   res.redirect('/register');
}

const hashPsw = await bcrypt.hash(Password,12);

user = new UserModel({
    username,
    email,
    Password:hashPsw
})

await user.save();
res.redirect('/login')

}

)




app.get("/dashboard", isAuth, (req,res)=>{


 res.render('dashboard')

})
 

app.post('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect('/')
    })
})



 





app.listen(5000 ,console.log('Server Running '))