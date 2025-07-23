const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, 'Hotel name must be at least 3 characters long']
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be a positive number']
    },
    rooms: {
        type: Number,
        required: true,
        min: [1, 'There must be at least one room']
    },
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
