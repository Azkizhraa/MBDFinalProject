// src/components/ComputerSchedule.jsx (Final Corrected Version)
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './ComputerSchedule.css';

const ViewComputerSchedule = () => {
    const { computerId } = useParams();
    // This state will hold all the info: computer details and its full schedule
    const [computerData, setComputerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchScheduleData = async () => {
            try {
                // This is the new, correct query that joins the 3 tables
                const { data, error } = await supabase
                    .from('computer')
                    .select(`
                        table_location,
                        computer_schedule (
                            status,
                            schedule (
                                start_time,
                                end_time
                            )
                        )
                    `)
                    .eq('computer_id', computerId)
                    .single(); // Use .single() as we only expect one computer

                if (error) throw error;

                // Sort the schedule by start_time before setting the state
                if (data && data.computer_schedule) {
                    data.computer_schedule.sort((a, b) => {
                        return a.schedule.start_time.localeCompare(b.schedule.start_time);
                    });
                }
                
                setComputerData(data);

            } catch (err) {
                setError(err.message);
                console.error("Error fetching schedule data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchScheduleData();
    }, [computerId]);

    if (loading) return <div className="page-container"><h1 className="page-title">Loading Schedule...</h1></div>;
    if (error) return <div className="page-container"><h1 className="page-title">Error: {error}</h1></div>;

    return (
        <div className="page-container">
            <h1 className="page-title">
                Today's Schedule for PC {computerData?.table_location || ''}
            </h1>
            <div className="schedule-container">
                <table className="schedule-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {computerData?.computer_schedule.map((slot, index) => (
                            <tr key={index}>
                                {/* Format the time to show HH:MM */}
                                <td>
                                    {slot.schedule.start_time.slice(0, 5)} - {slot.schedule.end_time.slice(0, 5)}
                                </td>
                                <td className={`status-${slot.status.toLowerCase()}`}>
                                    {slot.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Link to="/view-computers" className="back-button">BACK</Link>
        </div>
    );
};

// Make sure the export name matches your import in App.jsx
export default ViewComputerSchedule;