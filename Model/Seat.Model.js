const mongoose = require("mongoose");

// Seat Reservation Schema
const reservationSchema = new mongoose.Schema({
    seatNumber: String,
    isReserved: {
      type:Boolean,
      default:false
    }
},{
    versionKey:false
});

const ReserveModel = mongoose.model("seatsbooks",reservationSchema);

module.exports = {
    ReserveModel
}


