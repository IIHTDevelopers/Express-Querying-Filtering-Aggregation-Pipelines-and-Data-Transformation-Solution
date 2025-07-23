const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');

// POST route to handle the form submission
router.post('/hotels', hotelController.createHotel);

// GET route for getting all hotels with filtering and pagination
router.get('/hotels', hotelController.getAllHotels);

// GET route for aggregating hotels data (e.g., average price, total rooms)
router.get('/hotels/aggregate', hotelController.aggregateHotels);

// GET route for fetching distinct values (e.g., distinct locations)
router.get('/hotels/distinct', hotelController.getDistinctValues);

module.exports = router;
