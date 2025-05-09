const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const Reservation = require('../models/Reservation');
const { body, query, validationResult } = require('express-validator');

/**
 * Search for restaurants by date, time, party size, and optional location
 * Returns restaurants with available time slots within +/- 30 minutes of requested time
 */
router.get('/search', [
  query('date').isDate().withMessage('Valid date is required (YYYY-MM-DD)'),
  query('time').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Valid time is required (HH:MM)'),
  query('partySize').isInt({ min: 1 }).withMessage('Valid party size is required'),
  query('location').optional()
], async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { date, time, partySize, location } = req.query;
    
    // Convert time to minutes for easier calculation
    const [hours, minutes] = time.split(':').map(Number);
    const requestedTimeInMinutes = hours * 60 + minutes;
    
    // Define the time window (± 30 minutes)
    const windowStart = requestedTimeInMinutes - 30;
    const windowEnd = requestedTimeInMinutes + 30;
    
    // Build query for restaurants
    let query = {};
    
    // Add location filter if provided
    if (location) {
      // Check if location is a zip code (5 digits)
      if (/^\d{5}$/.test(location)) {
        query.zipCode = location;
      } else {
        // Otherwise search by city or state
        query.$or = [
          { 'address.city': new RegExp(location, 'i') },
          { 'address.state': new RegExp(location, 'i') }
        ];
      }
    }
    
    // Get all restaurants matching location criteria
    const restaurants = await Restaurant.find(query).lean();
    
    // For each restaurant, determine available time slots
    const availableRestaurants = await Promise.all(restaurants.map(async (restaurant) => {
      // Get restaurant's operating hours for the given date
      const dayOfWeek = new Date(date).getDay(); // 0 = Sunday, 6 = Saturday
      const operatingHours = restaurant.operatingHours.find(day => day.dayOfWeek === dayOfWeek);
      
      if (!operatingHours) {
        return null; // Restaurant closed on this day
      }
      
      // Convert opening/closing hours to minutes
      const [openHours, openMinutes] = operatingHours.openTime.split(':').map(Number);
      const [closeHours, closeMinutes] = operatingHours.closeTime.split(':').map(Number);
      const openTimeInMinutes = openHours * 60 + openMinutes;
      const closeTimeInMinutes = closeHours * 60 + closeMinutes;
      
      // Check if requested time window is within operating hours
      if (windowStart >= closeTimeInMinutes || windowEnd <= openTimeInMinutes) {
        return null; // Requested time outside operating hours
      }
      
      // Find tables that can accommodate the party size
      const suitableTables = restaurant.tables.filter(table => table.capacity >= partySize);
      
      if (suitableTables.length === 0) {
        return null; // No tables can accommodate this party size
      }
      
      // Get all reservations for this restaurant on the specified date
      const existingReservations = await Reservation.find({
        restaurantId: restaurant._id,
        date: date,
        status: { $ne: 'cancelled' }
      });
      
      // Generate possible time slots within the window (every 15 minutes)
      const possibleSlots = [];
      
      // Start from the max of window start and opening time
      let currentSlot = Math.max(windowStart, openTimeInMinutes);
      
      // End at the min of window end and closing time
      const endSlot = Math.min(windowEnd, closeTimeInMinutes);
      
      // Generate slots at 15-minute intervals
      while (currentSlot <= endSlot) {
        const slotHours = Math.floor(currentSlot / 60);
        const slotMinutes = currentSlot % 60;
        const timeSlot = `${slotHours.toString().padStart(2, '0')}:${slotMinutes.toString().padStart(2, '0')}`;
        
        possibleSlots.push({
          time: timeSlot,
          formattedTime: new Date(`2000-01-01T${timeSlot}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
        });
        
        currentSlot += 15; // Move to next 15-minute slot
      }
      
      // For each time slot, check if there are available tables
      const availableSlots = possibleSlots.filter(slot => {
        const [slotHours, slotMinutes] = slot.time.split(':').map(Number);
        const slotTimeInMinutes = slotHours * 60 + slotMinutes;
        
        // Consider a reservation blocks a table for 2 hours
        const reservationDuration = 120; // 2 hours in minutes
        
        // For each table, check if it's available at this time slot
        return suitableTables.some(table => {
          // Check against existing reservations
          const isTableAvailable = !existingReservations.some(reservation => {
            const [resHours, resMinutes] = reservation.time.split(':').map(Number);
            const resTimeInMinutes = resHours * 60 + resMinutes;
            
            // Check if reservation overlaps with the slot
            const reservationEnd = resTimeInMinutes + reservationDuration;
            const slotEnd = slotTimeInMinutes + reservationDuration;
            
            return (
              (reservation.tableId.toString() === table._id.toString()) &&
              (
                (slotTimeInMinutes >= resTimeInMinutes && slotTimeInMinutes < reservationEnd) ||
                (resTimeInMinutes >= slotTimeInMinutes && resTimeInMinutes < slotEnd)
              )
            );
          });
          
          return isTableAvailable;
        });
      });
      
      if (availableSlots.length === 0) {
        return null; // No available slots
      }
      
      // Get number of bookings made today
      const today = new Date().toISOString().split('T')[0];
      const bookingsToday = await Reservation.countDocuments({
        restaurantId: restaurant._id,
        createdAt: { $gte: new Date(`${today}T00:00:00.000Z`) },
        status: { $ne: 'cancelled' }
      });
      
      // Return restaurant with available time slots
      return {
        _id: restaurant._id,
        name: restaurant.name,
        cuisineType: restaurant.cuisineType,
        costRating: restaurant.costRating,
        rating: restaurant.rating,
        reviewCount: restaurant.reviews.length,
        address: restaurant.address,
        image: restaurant.images && restaurant.images.length ? restaurant.images[0] : null,
        bookingsToday: bookingsToday,
        availableSlots
      };
    }));
    
    // Filter out null results and sort by rating
    const results = availableRestaurants
      .filter(restaurant => restaurant !== null)
      .sort((a, b) => b.rating - a.rating);
    
    res.json({
      count: results.length,
      restaurants: results
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
});