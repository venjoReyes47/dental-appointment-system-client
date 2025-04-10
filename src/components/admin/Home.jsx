import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDentistAppointment } from '../../apis/services';
import axios from 'axios';
import { format } from 'date-fns';

const Home = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await getDentistAppointment(user.userId);
                setAppointments(response.data);
            } catch (error) {
                console.error('Failed to fetch appointments:', error);
            } finally {
                setLoading(false);
            }
        };


        fetchAppointments();

    }, []);



    const getStatusColor = (status) => {
        switch (status) {
            case 'P':
                return 'text-warning';
            case 'C':
                return 'text-success';
            case 'D':
                return 'text-primary';
            case 'X':
                return 'text-danger';
            default:
                return 'text-muted';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'P':
                return 'Pending';
            case 'C':
                return 'Confirmed';
            case 'D':
                return 'Completed';
            case 'X':
                return 'Cancelled';
            default:
                return status;
        }
    };


    const AppointmentCard = ({ appointment }) => (
        <div className="card border-0 shadow-sm rounded-4 mb-3">
            <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h5 className="fw-bold mb-1">
                            {appointment.patient.firstName} {appointment.patient.lastName}
                        </h5>
                        <p className="text-muted mb-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope me-1" viewBox="0 0 16 16">
                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                            </svg>
                            {appointment.patient.email}
                        </p>
                    </div>
                    <span className={`badge rounded-pill bg-light ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                    </span>
                </div>
                <div className="d-flex align-items-center gap-4">
                    <div className="d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar me-2" viewBox="0 0 16 16">
                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                        </svg>
                        <span className="text-muted">
                            {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                    <div className="d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock me-2" viewBox="0 0 16 16">
                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
                        </svg>
                        <span className="text-muted">
                            {new Date(appointment.appointmentDate).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    const DentistDashboard = () => {
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointments.filter(a =>
            new Date(a.appointmentDate).toISOString().split('T')[0] === today
        );
        const pendingAppointments = appointments.filter(a => a.status === 'P');
        const completedAppointments = appointments.filter(a => a.status === 'D');
        const upcomingAppointments = appointments.filter(a =>
            new Date(a.appointmentDate) > new Date() && a.status !== 'D' && a.status !== 'X'
        );

        return (
            <div className="container py-4">
                {/* Welcome Section */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h2 className="h4 fw-bold mb-1">Welcome, Dr. {user?.firstName}</h2>
                                        <p className="text-muted mb-0">Here's your daily overview</p>
                                    </div>
                                    <Link to="/appointments" className="btn btn-dark rounded-pill px-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-check me-2" viewBox="0 0 16 16">
                                            <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                        </svg>
                                        View Appointments
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="row g-4 mb-4">
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-calendar-check text-primary" viewBox="0 0 16 16">
                                            <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Today's Appointments</h6>
                                        <h3 className="h4 fw-bold mb-0">{todayAppointments.length}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-clock text-warning" viewBox="0 0 16 16">
                                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Pending</h6>
                                        <h3 className="h4 fw-bold mb-0 text-warning">{pendingAppointments.length}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-check-circle text-success" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                            <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Completed</h6>
                                        <h3 className="h4 fw-bold mb-0 text-success">{completedAppointments.length}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-calendar-week text-info" viewBox="0 0 16 16">
                                            <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Upcoming</h6>
                                        <h3 className="h4 fw-bold mb-0 text-info">{upcomingAppointments.length}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Today's Schedule */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h3 className="h5 fw-bold mb-0">Today's Schedule</h3>
                                    <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3">
                                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                                {todayAppointments.length > 0 ? (
                                    <div className="row">
                                        {todayAppointments.map(appointment => (
                                            <div key={appointment.appointmentId} className="col-md-6 mb-3">
                                                <AppointmentCard appointment={appointment} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-muted mb-0">No appointments scheduled for today</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const PatientDashboard = () => {
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointments.filter(a =>
            new Date(a.appointmentDate).toISOString().split('T')[0] === today
        );
        const pendingAppointments = appointments.filter(a => a.status === 'P');
        const completedAppointments = appointments.filter(a => a.status === 'D');
        const upcomingAppointments = appointments.filter(a =>
            new Date(a.appointmentDate) > new Date() && a.status !== 'D' && a.status !== 'X'
        );

        return (
            <div className="container py-4">
                {/* Welcome Section */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h2 className="h4 fw-bold mb-1">Welcome, {user?.firstName}</h2>
                                        <p className="text-muted mb-0">Here's your appointment overview</p>
                                    </div>
                                    <Link to="/schedule" className="btn btn-dark rounded-pill px-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-plus me-2" viewBox="0 0 16 16">
                                            <path d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z" />
                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                        </svg>
                                        Schedule Appointment
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="row g-4 mb-4">
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-calendar-check text-primary" viewBox="0 0 16 16">
                                            <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Today's Appointments</h6>
                                        <h3 className="h4 fw-bold mb-0">{todayAppointments.length}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-clock text-warning" viewBox="0 0 16 16">
                                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Pending</h6>
                                        <h3 className="h4 fw-bold mb-0 text-warning">{pendingAppointments.length}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-check-circle text-success" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                            <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Completed</h6>
                                        <h3 className="h4 fw-bold mb-0 text-success">{completedAppointments.length}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-calendar-week text-info" viewBox="0 0 16 16">
                                            <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1">Upcoming</h6>
                                        <h3 className="h4 fw-bold mb-0 text-info">{upcomingAppointments.length}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Today's Schedule */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h3 className="h5 fw-bold mb-0">Today's Schedule</h3>
                                    <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3">
                                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                                {todayAppointments.length > 0 ? (
                                    <div className="row">
                                        {todayAppointments.map(appointment => (
                                            <div key={appointment.appointmentId} className="col-md-6 mb-3">
                                                <div className="card border-0 shadow-sm">
                                                    <div className="card-body p-4">
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <div>
                                                                <h5 className="card-title mb-2">
                                                                    {format(new Date(appointment.appointmentDate), 'h:mm a')}
                                                                </h5>
                                                                <p className="mb-0">
                                                                    <strong>Dentist:</strong> Dr. {appointment.dentist.firstName} {appointment.dentist.lastName}
                                                                </p>
                                                            </div>
                                                            <div className="text-end">
                                                                <span className={`badge ${getStatusColor(appointment.status)} rounded-pill px-3 py-2`}>
                                                                    {getStatusText(appointment.status)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-muted mb-0">No appointments scheduled for today</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-vh-100">
            {user?.roleId === 2 && <PatientDashboard />}
            {user?.roleId === 1 && <DentistDashboard />}
            {!user && (
                <>
                    <section className="py-5">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <h1 className="display-4 fw-bold mb-4">Your Smile Deserves the Best Care</h1>
                                    <p className="lead mb-4 text-muted">
                                        Experience world-class dental care with our team of expert dentists.
                                        Book your appointment today and take the first step towards a healthier smile.
                                    </p>
                                    <div className="d-flex gap-3">
                                        {!user && (
                                            <>
                                                <Link to="/register" className="btn btn-dark btn-lg rounded-pill px-4 fw-semibold">
                                                    Get Started
                                                </Link>

                                            </>
                                        )}
                                        {user && (
                                            <Link to="/schedule" className="btn btn-dark btn-lg rounded-pill px-4 fw-semibold">
                                                Book Appointment
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <img
                                        src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800"
                                        alt="Modern Dental Office"
                                        className="img-fluid rounded-4 shadow-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="py-5 bg-light">
                        <div className="container">
                            <div className="row g-4">
                                <div className="col-md-4">
                                    <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                                        <div className="d-inline-block bg-dark rounded-circle p-3 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-calendar-check" viewBox="0 0 16 16">
                                                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                            </svg>
                                        </div>
                                        <h3 className="h5 fw-bold mb-3">Easy Scheduling</h3>
                                        <p className="text-muted mb-0">Book your appointments online at your convenience, 24/7.</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                                        <div className="d-inline-block bg-dark rounded-circle p-3 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-shield-check" viewBox="0 0 16 16">
                                                <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z" />
                                                <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="h5 fw-bold mb-3">Expert Care</h3>
                                        <p className="text-muted mb-0">Our experienced dentists provide top-quality dental care services.</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                                        <div className="d-inline-block bg-dark rounded-circle p-3 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-heart-pulse" viewBox="0 0 16 16">
                                                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053.918 3.995.78 5.323 1.508 7H.43c-2.128-5.697 4.165-8.83 7.394-5.857.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17c3.23-2.974 9.522.159 7.394 5.856h-1.078c.728-1.677.59-3.005.108-3.947C13.486.878 10.4.28 8.717 2.01L8 2.748ZM2.212 10h1.315C4.593 11.183 6.05 12.458 8 13.795c1.949-1.337 3.407-2.612 4.473-3.795h1.315c-1.265 1.566-3.14 3.25-5.788 5-2.648-1.75-4.523-3.434-5.788-5Z" />
                                                <path d="M10.464 3.314a.5.5 0 0 0-.945.049L7.921 8.956 6.464 5.314a.5.5 0 0 0-.88-.091L3.732 8H.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 .416-.223l1.473-2.209 1.647 4.118a.5.5 0 0 0 .945-.049l1.598-5.593 1.457 3.642A.5.5 0 0 0 12.5 9h3a.5.5 0 0 0 0-1h-2.732l-1.304-3.265Z" />
                                            </svg>
                                        </div>
                                        <h3 className="h5 fw-bold mb-3">Modern Technology</h3>
                                        <p className="text-muted mb-0">State-of-the-art equipment and advanced dental procedures.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </>

            )}




        </div>
    );
};

export default Home; 