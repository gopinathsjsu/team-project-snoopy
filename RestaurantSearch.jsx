import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Rating,
    Chip,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment
} from '@mui/material';
import {
    Search as SearchIcon,
    Restaurant as RestaurantIcon,
    AttachMoney as MoneyIcon,
    CalendarToday as CalendarIcon,
    AccessTime as TimeIcon,
    People as PeopleIcon,
    LocationOn as LocationIcon
} from '@mui/icons-material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

const RestaurantSearch = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useState({
        date: dayjs(),
        time: dayjs().hour(19).minute(0), // Default to 7:00 PM
        partySize: 2,
        location: ''
    });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleInputChange = (field) => (event) => {
        setSearchParams({
            ...searchParams,
            [field]: event.target.value
        });
    };

    const handleDateChange = (newDate) => {
        setSearchParams({
            ...searchParams,
            date: newDate
        });
    };

    const handleTimeChange = (newTime) => {
        setSearchParams({
            ...searchParams,
            time: newTime
        });
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            // Format the date and time for the API
            const formattedDate = searchParams.date.format('YYYY-MM-DD');
            const formattedTime = searchParams.time.format('HH:mm');

            const response = await axios.get('/api/restaurants/search', {
                params: {
                    date: formattedDate,
                    time: formattedTime,
                    partySize: searchParams.partySize,
                    location: searchParams.location || undefined
                }
            });

            setResults(response.data.restaurants);
            setSearched(true);
        } catch (error) {
            console.error('Search failed:', error);
            // Handle error appropriately
        } finally {
            setLoading(false);
        }
    };

    const handleReservation = (restaurantId, time) => {
        // Format the parameters to include in navigation
        const reservationParams = {
            restaurantId,
            date: searchParams.date.format('YYYY-MM-DD'),
            time,
            partySize: searchParams.partySize
        };

        // Navigate to reservation confirmation page with the parameters
        navigate(`/reservation/new?${new URLSearchParams(reservationParams).toString()}`);
    };

    // Generate dollar signs based on cost rating
    const renderCostRating = (cost) => {
        return Array(cost).fill('$').join('');
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Find a Table
                </Typography>

                {/* Search Form */}
                <Card sx={{ mb: 4, p: 2 }}>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6} md={2.5}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker
                                            label="Date"
                                            value={searchParams.date}
                                            onChange={handleDateChange}
                                            disablePast
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    InputProps: {
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <CalendarIcon />
                                                            </InputAdornment>
                                                        ),
                                                    },
                                                },
                                            }}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} sm={6} md={2.5}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['TimePicker']}>
                                        <TimePicker
                                            label="Time"
                                            value={searchParams.time}
                                            onChange={handleTimeChange}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    InputProps: {
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <TimeIcon />
                                                            </InputAdornment>
                                                        ),
                                                    },
                                                },
                                            }}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} sm={6} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel id="party-size-label">Party Size</InputLabel>
                                    <Select
                                        labelId="party-size-label"
                                        value={searchParams.partySize}
                                        onChange={handleInputChange('partySize')}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <PeopleIcon />
                                            </InputAdornment>
                                        }
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                                            <MenuItem key={num} value={num}>
                                                {num} {num === 1 ? 'person' : 'people'}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label="Location (City, State or ZIP)"
                                    value={searchParams.location}
                                    onChange={handleInputChange('location')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocationIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    onClick={handleSearch}
                                    startIcon={<SearchIcon />}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Search'}
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Results */}
                {searched && (
                    <Box>
                        <Typography variant="h5" component="h2" gutterBottom>
                            {results.length > 0
                                ? `${results.length} ${results.length === 1 ? 'Restaurant' : 'Restaurants'} Available`
                                : 'No Restaurants Available'}
                        </Typography>

                        {results.length > 0 ? (
                            <Grid container spacing={3}>
                                {results.map((restaurant) => (
                                    <Grid item xs={12} key={restaurant._id}>
                                        <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                                            <CardMedia
                                                component="img"
                                                sx={{
                                                    width: { xs: '100%', md: 240 },
                                                    height: { xs: 200, md: 'auto' }
                                                }}
                                                image={restaurant.image || '/img/default-restaurant.jpg'}
                                                alt={restaurant.name}
                                            />
                                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                <CardContent sx={{ flex: '1 0 auto' }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                        <Typography component="div" variant="h5">
                                                            {restaurant.name}
                                                        </Typography>
                                                        <Typography variant="subtitle1" color="text.secondary" component="div">
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <MoneyIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                                {renderCostRating(restaurant.costRating)}
                                                            </Box>
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <RestaurantIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                                                            {restaurant.cuisineType}
                                                        </Typography>

                                                        <Rating
                                                            value={restaurant.rating}
                                                            precision={0.5}
                                                            readOnly
                                                            size="small"
                                                            sx={{ mr: 0.5 }}
                                                        />
                                                        <Typography variant="body2" color="text.secondary">
                                                            ({restaurant.reviewCount} {restaurant.reviewCount === 1 ? 'review' : 'reviews'})
                                                        </Typography>
                                                    </Box>

                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                        {restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zipCode}
                                                    </Typography>

                                                    {restaurant.bookingsToday > 0 && (
                                                        <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
                                                            Booked {restaurant.bookingsToday} {restaurant.bookingsToday === 1 ? 'time' : 'times'} today
                                                        </Typography>
                                                    )}

                                                    <Box sx={{ mt: 2 }}>
                                                        <Typography variant="subtitle2" gutterBottom>
                                                            Available Times:
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                            {restaurant.availableSlots.map((slot) => (
                                                                <Button
                                                                    key={slot.time}
                                                                    variant="outlined"
                                                                    size="small"
                                                                    onClick={() => handleReservation(restaurant._id, slot.time)}
                                                                >
                                                                    {slot.formattedTime}
                                                                </Button>
                                                            ))}
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Box>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Card sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="body1">
                                    No restaurants available for your search criteria. Try adjusting your date, time, or party size.
                                </Typography>
                            </Card>
                        )}
                    </Box>
                )}
            </Box>
        </Container>
    );
};