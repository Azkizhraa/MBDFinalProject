// src/components/BookingConfirmation.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './BookingConfirmation.css';

const HOURLY_RATE = 10000;

const BookingConfirmation = () => {
    const { computerId } = useParams();
    const navigate = useNavigate();

    const [computer, setComputer] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data: computerData, error: computerError } = await supabase
                    .from('computer')
                    .select('*, specs(*), computer_schedule(*, schedule(*))')
                    .eq('computer_id', computerId)
                    .single();
                if (computerError) throw computerError;
                setComputer(computerData);

                if (computerData && computerData.computer_schedule) {
                    const available = computerData.computer_schedule
                        .filter(slot => slot.status === 'available')
                        .sort((a, b) => a.schedule.start_time.localeCompare(b.schedule.start_time));
                    setAvailableSlots(available);
                }
                
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("User not found");

                const { data: customerData, error: customerError } = await supabase
                    .from('customer')
                    .select('customer_name')
                    .eq('customer_id', user.id)
                    .maybeSingle(); // Use maybeSingle for robustness
                
                if (customerError) throw customerError;
                setCustomer(customerData);

            } catch (err) {
                setError(err.message);
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [computerId]);

    useEffect(() => {
        setTotalCost(selectedSlots.length * HOURLY_RATE);
    }, [selectedSlots]);

    const handleSlotChange = (event) => {
        const chosenSlotId = event.target.value;
        const startSlot = availableSlots.find(slot => slot.schedule.schedule_id === chosenSlotId);
        
        if (startSlot) {
            setSelectedSlots([startSlot]);
        } else {
            setSelectedSlots([]);
        }
    };

    const handleAddHour = () => {
        if (selectedSlots.length === 0) {
            alert("Please choose a start time from the dropdown first.");
            return;
        }

        const lastSelectedSlot = selectedSlots[selectedSlots.length - 1];
        const lastEndTime = lastSelectedSlot.schedule.end_time;
        const nextSlot = availableSlots.find(slot => slot.schedule.start_time === lastEndTime);

        if (nextSlot) {
            setSelectedSlots(prevSlots => [...prevSlots, nextSlot]);
        } else {
            alert("No more consecutive hours available.");
        }
    };

    const handleDecreaseHour = () => {
        // Prevent decreasing below 1 hour
        if (selectedSlots.length <= 1) {
            return; 
        }
        // Create a new array containing all but the last slot
        setSelectedSlots(prevSlots => prevSlots.slice(0, -1));
    };

    const handleConfirmBooking = async () => {
        if (selectedSlots.length === 0) {
            alert("Please select a time slot.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("You must be logged in to book.");

            // ⚠️ IMPORTANT: Replace this placeholder with a real Employee UUID from your database
            const placeholderEmployeeId = '12345678-1234-1234-1234-1234567890ab';

            const { data: transactionData, error: transactionError } = await supabase
                .from('transaction')
                .insert({
                    hourly_cost: HOURLY_RATE,
                    duration: `${selectedSlots.length}:00:00`, 
                    total_cost: totalCost,
                    customer_customer_id: user.id,
                    employee_employee_id: placeholderEmployeeId,
                    status: 'confirmed', 
                })
                .select('transaction_id')
                .single();

            if (transactionError) throw transactionError;

            const newTransactionId = transactionData.transaction_id;

            const slotIdsToUpdate = selectedSlots.map(slot => slot.schedule.schedule_id);
            
            const { error: scheduleUpdateError } = await supabase
                .from('computer_schedule')
                .update({ status: 'booked' })
                .in('schedule_schedule_id', slotIdsToUpdate);
                
            if (scheduleUpdateError) throw scheduleUpdateError;
                
            const { error: transactionComputerError } = await supabase
                .from('transaction_computer')
                .insert({
                    transaction_transaction_id: newTransactionId,
                    computer_computer_id: computerId,
                });

            if (transactionComputerError) throw transactionComputerError;

            alert('Booking successful!');
            navigate('/my-bookings'); // Redirect user after successful booking

        } catch (err) {
            setError(`Booking failed: ${err.message}`);
            console.error("Error during booking confirmation:", err);
        } finally {
            setLoading(false);
        }
    };

    const getSelectedTimeRange = () => {
        if (selectedSlots.length === 0) return "--";
        const startTime = selectedSlots[0].schedule.start_time.slice(0, 5);
        const endTime = selectedSlots[selectedSlots.length - 1].schedule.end_time.slice(0, 5);
        return `${startTime} - ${endTime}`;
    };

    if (loading) return <div className="page-container"><h1 className="page-title">Loading Confirmation...</h1></div>;
    if (error) return <div className="page-container"><h1 className="page-title">{error}</h1></div>;

    return (
        <div className="page-container">
            <h1 className="page-title">Confirm Booking</h1>
            <div className="confirmation-window">
                <p>Hello, <strong>{customer?.customer_name || 'Customer'}</strong>!</p>
                <p>You are about to book:</p>
                <div className="computer-summary">
                    <strong>PC {computer?.table_location}</strong> - {computer?.specs?.brand || 'N/A'}
                    <br/><small>{computer?.specs?.cpu || 'N/A'} | {computer?.specs?.graphics_card || 'N/A'} | {computer?.specs?.ram || 'N/A'} RAM</small>
                </div>

                <div className="duration-selector">
                    <p>Select Start Time:</p>
                    <select className="slot-dropdown" onChange={handleSlotChange} defaultValue="">
                        <option value="">-- Choose a start time --</option>
                        {availableSlots.map(({ schedule }) => (
                            <option key={schedule.schedule_id} value={schedule.schedule_id}>
                                {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                            </option>
                        ))}
                    </select>

                    {selectedSlots.length > 0 && (
                        <div className="add-hour-section">
                            <div className="duration-controls">
                                <button 
                                    onClick={handleDecreaseHour} 
                                    className="remove-hour-button"
                                    disabled={selectedSlots.length <= 1}
                                >
                                    -
                                </button>
                                <button onClick={handleAddHour} className="add-hour-button">+</button>
                            </div>
                            <div className="selection-summary">
                                <p>Selected: <strong>{getSelectedTimeRange()}</strong></p>
                                <p>Duration: <strong>{selectedSlots.length} hour(s)</strong></p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="cost-summary">
                    <p>Total Cost</p>
                    <h2>Rp {totalCost.toLocaleString('id-ID')}</h2>
                </div>

                <button onClick={handleConfirmBooking} className="confirm-button" disabled={selectedSlots.length === 0}>
                    Confirm & Pay
                </button>
            </div>
            <Link to="/book" className="back-button">CANCEL</Link>
        </div>
    );
};

export default BookingConfirmation;