const express = require("express");
const app=express();
const mongoose= require("mongoose");
require("dotenv").config();
app.use(express.json())


const slots= require("./Slots");


main().catch((e)=>{
    console.log(e)
})

async function main()
{
    await mongoose.connect(process.env.MONGO_URL);
    
    // To Create Parking Slots 
    // const slot= await slots.create({slot_no:10,slot_status:0})
    
}

app.get("/",(req,res)=>{
    res.sendStatus(200);
})

app.post("/getData",(req,res)=>{
    var data = req.body.uplink_message.decoded_payload.Slot0;
    console.log("Slot 0:",data);
    res.status(200).json(data);
})


app.get("/api/v1/allData",async(req,res)=>{
    const allSlotStatus = await slots.find();
    res.json(allSlotStatus)
})

app.post("/api/v1/query",async(req,res)=>{
    const {slot_status,slot_no}=req.query;
   
    const slot = await slots.findOne({slot_no:Number(slot_no)})
    
    if(!slot){
        return res.sendStatus(404);
    }
    console.log(slot_status,slot_no);
    slot.slot_status=Number(slot_status);

    //DATE
const date = new Date();

const options = {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};

const formattedDate = new Intl.DateTimeFormat('en-IN', options).format(date);

    slot.updatedAt=formattedDate;
    await slot.save()
    return res.sendStatus(200);

})


app.listen(process.env.PORT||5000,()=>{
    console.log("Listing🚗🚗🚗");
})
