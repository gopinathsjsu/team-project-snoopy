import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import dayjs from 'dayjs';

const ReservationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  
  // Get reservation parameters from URL query params
  const searchParams = new URLSearchParams(location.search);
  const restaurantId = searchParams.get('restaurantId');
  const date = searchParams.get('date');
  const time = searchParams.get('time');
  const partySize = searchParams.get('partySize');
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
    sendConfirmationEmail: true,
    sendConfirmationSMS: false
  });
  
  useEffect(() => {
    // Fill in user data if authenticated
    if (isAuthenticated && user) {
      setFormData({
        ...formData,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [isAuthenticated, user]);
  
  useEffect(() => {
    // Fetch restaurant details
    const fetchRestaurantData = async () => {
      if (!restaurantId) {
        setError('Missing restaurant information');
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`/api/restaurants/${restaurantId}`);
        setRestaurant(response.data);
      } catch (err) {
        setError('Failed to load restaurant details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurantData();
  }, [restaurantId]);
  
  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };
  
  const handleCheckboxChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.checked
    });
  };
  
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Phone validation (simple validation for demonstration)
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const reservationData = {
        restaurantId,
        date,
        time,
        partySize: Number(partySize),
        specialRequests: formData.specialRequests,
        contactInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        sendEmail: formData.sendConfirmationEmail,
        sendSMS: formData.sendConfirmationSMS
      };
      
      const response = await axios.post('/api/reservations', reservationData);
      
      setConfirmationCode(response.data.confirmationCode);
      setReservationSuccess(true);
      setActiveStep(2); // Move to confirmation step
    } catch (err) {
      console.error('Reservation failed:', err);
      setError(err.response?.data?.message || 'Failed to create reservation. Please try again.');
    } finally {
      setLoading(false);
    }