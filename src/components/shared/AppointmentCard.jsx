import React, { useState } from 'react';
import { format } from 'date-fns';
import { updateAppointment } from '../../apis/services';

const AppointmentCard = ({ appointment, onAction, isDentist }) => {
    const [isLoading, setIsLoading] = useState(false);

    const getStatusColor = (status) => {
        switch (status) {
            case 'P':
                return 'bg-warning';
            case 'C':
                return 'bg-success';
            case 'D':
                return 'bg-primary';
            case 'X':
                return 'bg-danger';
            default:
                return 'bg-secondary';
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
                return 'Unknown';
        }
    };

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        return {
            date: format(date, 'MMMM d, yyyy'),
            time: format(date, 'h:mm a')
        };
    };

    const handleAction = async (action) => {
        setIsLoading(true);
        try {
            await onAction(appointment.appointmentId, action, appointment.patient.userId, appointment.dentist.userId, appointment.appointmentDate);
        } catch (error) {
            console.error('Error handling appointment action:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const { date, time } = formatDateTime(appointment.appointmentDate);

    return (
        <div className="card border-0 shadow-sm rounded-4 mb-3">
            <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h5 className="fw-bold mb-1">
                            {isDentist ? (
                                `${appointment.patient.firstName} ${appointment.patient.lastName}`
                            ) : (
                                `Dr. ${appointment.dentist.firstName} ${appointment.dentist.lastName}`
                            )}
                        </h5>
                        <p className="text-muted mb-0">{appointment.service.Description}</p>
                    </div>
                    <span className={`badge ${getStatusColor(appointment.status)} rounded-pill px-3 py-2`}>
                        {getStatusText(appointment.status)}
                    </span>
                </div>

                <div className="d-flex align-items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar me-2" viewBox="0 0 16 16">
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                    </svg>
                    <span className="me-3">{date}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock me-2" viewBox="0 0 16 16">
                        <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
                    </svg>
                    <span>{time}</span>
                </div>


                <div className="mb-3">
                    <p className="text-muted mb-0">{appointment.service.description}</p>
                </div>


                <div className="d-flex gap-2">
                    {appointment.status === 'P' && (
                        <>
                            {isDentist && (
                                <button
                                    className="btn btn-success btn-sm rounded-pill px-3"
                                    onClick={() => handleAction('confirm')}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Confirming...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg me-1" viewBox="0 0 16 16">
                                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                                            </svg>
                                            Confirm
                                        </>
                                    )}
                                </button>
                            )}
                            <button
                                className="btn btn-danger btn-sm rounded-pill px-3"
                                onClick={() => handleAction('cancel')}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Cancelling...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg me-1" viewBox="0 0 16 16">
                                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                                        </svg>
                                        Cancel
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentCard;