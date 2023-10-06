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
    const d = new Date();
    slot.updatedAt=d;
    await slot.save()
    return res.sendStatus(200);

})


app.listen(process.env.PORT||5000,()=>{
    console.log("Listing🚗🚗🚗");
})
