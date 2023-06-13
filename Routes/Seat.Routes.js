const express = require("express");

const seatRouters = express.Router();

const { BookModel } = require("../Model/Seat.Model");

// Book seats
const totalSeats = 80;
const totalSeatsInRow = 7;
const lastRowSeats = 3;

const seatsArray = new Array(totalSeats).fill(false);

//Seat Booking Function

const trainSeatsBooking = (seatCount) => {
  const result = [];

  // Check Availability
  for (let i = 0; i <= totalSeats - seatCount; i++) {
    //   check seat Rows
    let seatsPerRow =
      i < totalSeats - lastRowSeats ? totalSeatsInRow : lastRowSeats;

    if (
      (i % seatsPerRow) + seatCount <= seatsPerRow &&
      seatsArray.slice(i, i + seatCount).every((x) => x === false)
    ) {
      const newSeats = [...seatsArray];

      for (let j = 0; j < seatCount; j++) {
        newSeats[i + j] = true;
        result.push(generateSeatNumber(i + j));
      }
      seatsArray.splice(0, totalSeats, ...newSeats);
      break;
    }
  }

  return result;
};

// Generating Seat Number after Booking

const generateSeatNumber = (seatIndex) => {
  let rowLetter = String.fromCharCode(
    "a".charCodeAt(0) + Math.floor(seatIndex / totalSeatsInRow)
  );
  let seatNumber = (seatIndex % totalSeatsInRow) + 1;
  if (seatIndex >= totalSeats - lastRowSeats) {
    rowLetter = "z";
    seatNumber = seatIndex - (totalSeats - lastRowSeats) + 1;
  }
  return rowLetter + seatNumber;
};

//get All Booked Seats
seatRouters.get("/", async (req, res) => {
  BookModel.find()
    .then((trainSeatsBooking) => {
      res.send(trainSeatsBooking);
    })
    .catch((error) => {
      console.error("Error fetching booked seats:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

//Reserve Seats
seatRouters.post("/reserve", async (req, res) => {
  const seatCount = parseInt(req.body.seats);
  const newBookedSeats = trainSeatsBooking(seatCount);
  console.log("newBookedSeats:", newBookedSeats);

  if (newBookedSeats.length > 0) {
    const seatDocuments = newBookedSeats.map((seatNumber) => ({
      seatNumber: seatNumber,
      isReserved: true,
    }));
    console.log("seatDocuments:", seatDocuments);

    BookModel.insertMany(seatDocuments)
      .then(() => {
        res.json({ trainSeatsBooking: seatDocuments });
        console.log("newBookedSeats:", newBookedSeats);
      })
      .catch((error) => {
        console.error("Error saving booked seats:", error.message);
        res.status(500).json({ error: "Internal server error" });
      });
  } else {
    res.status(400).json({ error: "No seats available" });
  }
});

//Delete
seatRouters.delete("/delete", async (req, res) => {
  await BookModel.deleteMany();
  
  await BookModel.find()
  .then((trainSeatsBooking) => {
    console.log("data delete", trainSeatsBooking);
    res.send(trainSeatsBooking);
    res.redirect("/")
  })
  .catch((error) => {
    console.error("Error fetching booked seats:", error);
    res.status(500).json({ error: "Internal server error" });
  });
  
});

module.exports = {
  seatRouters,
};
