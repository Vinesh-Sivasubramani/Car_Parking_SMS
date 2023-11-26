const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
app.use(express.json());

const cors = require("cors");
app.use(cors({
    origin: "*"
}));

const slots = require("./Slots");

main().catch((e) => {
    console.log(e);
});

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
        // To Create Parking Slots 
    // const slot= await slots.create({slot_no:10,slot_status:0})
}

app.get("/", (req, res) => {
    res.sendStatus(200);
});

app.post("/getData", async (req, res) => {
    try {
        const data = req.body.uplink_message.decoded_payload;
        const { slot_no, slot_status } = data;
        console.log(`Slot_no: ${slot_no} Slot_status: ${slot_status}`);

        const slot = await slots.findOne({ slot_no: Number(slot_no) });
        if (!slot) {
            return res.sendStatus(404);
        }

        slot.slot_status = Number(slot_status);
        const date = new Date();
        slot.updatedAt = date;
        await slot.save();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error parsing JSON data:", error);
        res.status(400).json({ error: "Invalid JSON data" });
    }
});

app.get("/api/v1/allData", async (req, res) => {
    const allSlotStatus = await slots.find();
    res.json(allSlotStatus);
});

app.post("/api/v1/query", async (req, res) => {
    const { slot_status, slot_no } = req.query;

    const slot = await slots.findOne({ slot_no: Number(slot_no) });

    if (!slot) {
        return res.sendStatus(404);
    }
    console.log(slot_status, slot_no);
    slot.slot_status = Number(slot_status);

    const date = new Date();
    const formattedDate = date.toISOString(); 

    slot.updatedAt = formattedDate;
    await slot.save();
    return res.sendStatus(200);
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Listening🚗🚗🚗");
});
