const mongoose= require("mongoose");

const slotsSchema=new mongoose.Schema({
    slot_no:{
        type:Number,
        min:1,
        max:100
    },
    slot_status:{
        type:Number,
        min:0,
        max:1
    },
    updatedAt:{
        type:Date,
        default:()=> Date.now()
    }
})

module.exports= mongoose.model("all_slots",slotsSchema);