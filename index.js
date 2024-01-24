require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")



//App config
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

//DB config
mongoose.connect('mongodb://127.0.0.1:27017/reminderAppDB');

const reminderSchema = new mongoose.Schema({
    reminderMsg: String,
    remindAt: String,
    isReminded: Boolean,
})
const Reminder =new mongoose.model("reminder",reminderSchema)

// Whatsapp reminding functionality

setInterval(()=>{
    Reminder.find({}).then(function(reminderList){
        reminderList.forEach(reminder=>{
            if(!reminder.isReminded){
                const now = new Date()
                if(new Date(reminder.remindAt) - now < 0){
                    Reminder.findByIdAndUpdate( reminder._id,{isReminded: true})
                    .then(function(remindObj)
                    {
                        const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    
    client.messages
        .create({
            body: reminder.reminderMsg,
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+917067119845'
        })
        .then(message => console.log(message.sid))
    
                    }).catch(function(err){ console.log(err);})
                }
            }
        })
    }).catch(function(err){ console.log(err);})
    },1000)

//const accountSid = process.env.ACCOUNT_SID
//const authToken = process.env.AUTH_TOKEN


//const client = require('twilio')(accountSid, authToken);

//client.messages
   // .create({
      //  body: 'this is a demo message from by backend server',
      //  from: 'whatsapp:+14155238886',
       // to: 'whatsapp:+917067119845',
 //   })
   // .then(message => console.log(message.sid))
    




app.get("/getAllReminder", function(req,res) {
    Reminder.find({}).then(function(reminderList){ res.send(reminderList)}).catch(function(err){
        console.log(err);
    })
    }
)
app.post("/addReminder", (req,res)=>{
     const {reminderMsg, remindAt} = req.body
     const reminder = new Reminder({
        reminderMsg,
        remindAt,
        isReminded:false
     })

     
   
     reminder.save(
        Reminder.find({}).then(function(reminderList){ res.send(reminderList)}).catch(function(err){
            console.log(err);
        })
     ).catch(function(err){console.log(err);})
    })


// app.post("/deleteReminder", (req,res)=>{
     
//     Reminder.deleteOne({_id: req.body.id}, ()=>{
//         Reminder.find({}).then(function(reminderList){ res.send(reminderList)}).catch(function(err){
//             console.log(err);
//         })
       
//     })
// })


app.post("/deleteReminder", (req,res)=>{
     
    Reminder.deleteOne({_id:req.body.id}).then(function(_id){
        Reminder.find({}).then(function(reminderList){ res.send(reminderList)}).catch(function(err){
                        console.log(err);
                    })
    })
})

app.get("/",(req,res)=>{
    res.send("A message from BE")
})

app.listen(9000,()=>console.log("BE started"))