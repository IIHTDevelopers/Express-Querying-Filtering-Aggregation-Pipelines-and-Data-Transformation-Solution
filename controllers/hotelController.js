const Hotel = require('../models/hotel');

// Handle the form submission and save data to MongoDB
const createHotel = async (req, res) => {
    try {
        const { name, location, price, rooms } = req.body;

        if (name && location && price && rooms) {
            // Validate fields
            if (name.trim() === '' || location.trim() === '' || !price || !rooms) {
                return res.status(400).json({ message: 'All fields are required and must be valid' });
            }
        } else {
            return res.status(400).json({ message: 'All fields are required and must be valid' });
        }

        const hotel = new Hotel({
            name,
            location,
            price,
            rooms
        });

        await hotel.save();
        res.status(201).json({ message: 'Hotel successfully added!' }); // Success message
    } catch (err) {
        res.status(500).json({ error: err.message }); // Handle errors
    }
};

// Get all hotels with filtering, sorting, and aggregation options
const getAllHotels = async (req, res) => {
    try {
        const { location, sort, price, rooms, page = 1, limit = 10 } = req.query;

        // Build the query object for filtering
        let query = {};

        if (location) {
            query.location = location;  // Filter by location
        }

        if (price) {
            const priceRange = price.split(',');  // Expect price as "min,max"
            if (priceRange.length === 2) {
                query.price = { $gte: priceRange[0], $lte: priceRange[1] };  // Filter by price range
            }
        }

        if (rooms) {
            const roomRange = rooms.split(',');  // Expect rooms as "min,max"
            if (roomRange.length === 2) {
                query.rooms = { $gte: roomRange[0], $lte: roomRange[1] };  // Filter by rooms range
            }
        }

        // Sorting by the specified field
        let sortOptions = {};
        if (sort) {
            sortOptions[sort] = 1;  // Sorting by field, ascending order
        }

        // Pagination logic
        const skip = (page - 1) * limit;

        // Get hotels from DB with pagination, filtering, and sorting
        const hotels = await Hotel.find(query)
            .sort(sortOptions)  // Sort hotels by specified field
            .skip(skip)          // Skip the records for pagination
            .limit(parseInt(limit)); // Limit the number of records returned per page

        res.status(200).json(hotels);  // Return the hotels as the response
    } catch (err) {
        res.status(500).json({ error: err.message });  // Handle errors
    }
};

// Aggregate hotels data (e.g., average price, room count by location)
const aggregateHotels = async (req, res) => {
    try {
        const { location } = req.query;

        const aggregationPipeline = [];

        if (location) {
            aggregationPipeline.push({ $match: { location } });  // Filter by location
        }

        // Group by location, calculate average price and total rooms
        aggregationPipeline.push({
            $group: {
                _id: "$location",
                averagePrice: { $avg: "$price" },
                totalRooms: { $sum: "$rooms" }
            }
        });

        // Sort by average price
        aggregationPipeline.push({ $sort: { averagePrice: 1 } });

        const aggregatedData = await Hotel.aggregate(aggregationPipeline);

        res.status(200).json(aggregatedData);  // Return aggregated data
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get distinct hotel locations
const getDistinctValues = async (req, res) => {
    try {
        // Get the field from query parameter (e.g., 'location')
        const field = req.query.field || 'location';  // Default to 'location' if not provided

        // Get distinct values for the field from the hotel collection
        const distinctValues = await Hotel.distinct(field);

        res.status(200).json(distinctValues);  // Return the distinct values
    } catch (err) {
        res.status(500).json({ error: err.message });  // Handle any errors
    }
};

module.exports = { createHotel, getAllHotels, aggregateHotels, getDistinctValues };
