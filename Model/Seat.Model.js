const mongoose = require("mongoose");

// Seat Reservation Schema
const reservationSchema = new mongoose.Schema({
    coachRow: Number,
    seatNumber: String,
    isReserved: Boolean,
},{
    versionKey:false
});

const ReserveModel = mongoose.model("seatsbooks",reservationSchema);

module.exports = {
    ReserveModel
}


