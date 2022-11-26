const mongoose =require("mongoose")

const Schema=mongoose.Schema

const userSchema= new Schema({
    username:{
        type:String,

   

}, 



    Password:{
        type:String,
       unique:true,
    

    },
    
   email:{
    type:String,

    unique:true
   }



}


);
module.exports=mongoose.model('user',userSchema)