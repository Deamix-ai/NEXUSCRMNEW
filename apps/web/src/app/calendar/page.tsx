'use client';

import { useState, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useCRM } from '@/contexts/CRMContext';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';



interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    type: 'lead' | 'project' | 'appointment';
    client?: string;
    description?: string;
    status?: string;
    value?: number;
  };
}

export default function CalendarPage() {
  const { leads, projects } = useCRM();
  const calendarRef = useRef<FullCalendar>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // Convert CRM data to calendar events
  const getCalendarEvents = (): CalendarEvent[] => {
    const events: CalendarEvent[] = [];

    // Add lead follow-ups
    leads.forEach(lead => {
      if (lead.lastContact) {
        const followUpDate = new Date(lead.lastContact);
        followUpDate.setDate(followUpDate.getDate() + 7); // Follow up in 7 days
        
        events.push({
          id: `lead-${lead.id}`,
          title: `Follow up: ${lead.name}`,
          start: followUpDate.toISOString().split('T')[0],
          backgroundColor: '#3B82F6',
          borderColor: '#2563EB',
          textColor: '#FFFFFF',
          extendedProps: {
            type: 'lead',
            client: lead.name,
            description: `Follow up on ${lead.projectType} enquiry`,
            status: lead.status,
            value: lead.value
          }
        });
      }
    });

    // Add project deadlines
    projects.forEach(project => {
      if (project.endDate) {
        events.push({
          id: `project-${project.id}`,
          title: `${project.title} - Deadline`,
          start: project.endDate,
          backgroundColor: '#EF4444',
          borderColor: '#DC2626',
          textColor: '#FFFFFF',
          extendedProps: {
            type: 'project',
            client: project.clientName,
            description: project.description,
            status: project.status,
            value: project.value
          }
        });
      }
      
      if (project.startDate) {
        events.push({
          id: `project-start-${project.id}`,
          title: `${project.title} - Start`,
          start: project.startDate,
          backgroundColor: '#10B981',
          borderColor: '#059669',
          textColor: '#FFFFFF',
          extendedProps: {
            type: 'project',
            client: project.clientName,
            description: project.description,
            status: project.status,
            value: project.value
          }
        });
      }
    });

    // Add some example appointments
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    events.push({
      id: 'appointment-1',
      title: 'Site Visit - Kitchen Consultation',
      start: nextWeek.toISOString().split('T')[0] + 'T10:00:00',
      end: nextWeek.toISOString().split('T')[0] + 'T11:30:00',
      backgroundColor: '#8B5CF6',
      borderColor: '#7C3AED',
      textColor: '#FFFFFF',
      extendedProps: {
        type: 'appointment',
        client: 'Sarah Wilson',
        description: 'Initial consultation for kitchen renovation'
      }
    });

    return events;
  };

  const handleEventClick = (info: any) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.start?.toISOString() || '',
      end: info.event.end?.toISOString(),
      backgroundColor: info.event.backgroundColor,
      extendedProps: info.event.extendedProps
    });
    setShowEventModal(true);
  };

  const handleDateClick = (info: any) => {
    // Could open a "create event" modal here

  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(value);
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'lead': return '👤';
      case 'project': return '🔨';
      case 'job': return '🚧';
      case 'appointment': return '📅';
      default: return '📋';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'lead': return 'bg-blue-100 text-blue-800';
      case 'project': return 'bg-purple-100 text-purple-800';
      case 'job': return 'bg-green-100 text-green-800';
      case 'appointment': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900">Calendar</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your schedule, appointments, and project timelines.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              + New Event
            </button>
          </div>
        </div>

        {/* Calendar Stats */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getCalendarEvents().filter(e => {
                        const today = new Date().toISOString().split('T')[0];
                        return e.start.split('T')[0] === today;
                      }).length}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Today</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {getCalendarEvents().filter(e => {
                        const today = new Date().toISOString().split('T')[0];
                        return e.start.split('T')[0] === today;
                      }).length} events
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getCalendarEvents().filter(e => e.extendedProps?.type === 'lead').length}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Follow-ups</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {getCalendarEvents().filter(e => e.extendedProps?.type === 'lead').length} pending
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getCalendarEvents().filter(e => e.extendedProps?.type === 'project').length}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Projects</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {getCalendarEvents().filter(e => e.extendedProps?.type === 'project').length} scheduled
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getCalendarEvents().filter(e => e.extendedProps?.type === 'appointment').length}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Appointments</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {getCalendarEvents().filter(e => e.extendedProps?.type === 'appointment').length} this week
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="calendar-wrapper">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={getCalendarEvents()}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                height="auto"
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                eventDisplay="block"
                eventBackgroundColor="#3B82F6"
                eventBorderColor="#2563EB"
                eventTextColor="#FFFFFF"
              />
            </div>
          </div>
        </div>

        {/* Event Detail Modal */}
        {showEventModal && selectedEvent && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Event Details</h3>
                  <button
                    onClick={() => setShowEventModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedEvent.title}</h4>
                    {selectedEvent.extendedProps?.type && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getEventTypeColor(selectedEvent.extendedProps.type)}`}>
                        {getEventTypeIcon(selectedEvent.extendedProps.type)} {selectedEvent.extendedProps.type.charAt(0).toUpperCase() + selectedEvent.extendedProps.type.slice(1)}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Start</div>
                    <div className="text-sm text-gray-900">
                      {new Date(selectedEvent.start).toLocaleString('en-GB')}
                    </div>
                  </div>
                  
                  {selectedEvent.end && (
                    <div>
                      <div className="text-sm text-gray-500">End</div>
                      <div className="text-sm text-gray-900">
                        {new Date(selectedEvent.end).toLocaleString('en-GB')}
                      </div>
                    </div>
                  )}
                  
                  {selectedEvent.extendedProps?.client && (
                    <div>
                      <div className="text-sm text-gray-500">Account</div>
                      <div className="text-sm text-gray-900">{selectedEvent.extendedProps.client}</div>
                    </div>
                  )}
                  
                  {selectedEvent.extendedProps?.description && (
                    <div>
                      <div className="text-sm text-gray-500">Description</div>
                      <div className="text-sm text-gray-900">{selectedEvent.extendedProps.description}</div>
                    </div>
                  )}
                  
                  {selectedEvent.extendedProps?.value && (
                    <div>
                      <div className="text-sm text-gray-500">Value</div>
                      <div className="text-sm text-gray-900">{formatCurrency(selectedEvent.extendedProps.value)}</div>
                    </div>
                  )}
                  
                  {selectedEvent.extendedProps?.status && (
                    <div>
                      <div className="text-sm text-gray-500">Status</div>
                      <div className="text-sm text-gray-900">{selectedEvent.extendedProps.status}</div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    onClick={() => setShowEventModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Close
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    Edit Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .calendar-wrapper .fc-theme-standard td, .calendar-wrapper .fc-theme-standard th {
          border-color: #e5e7eb;
        }
        .calendar-wrapper .fc-toolbar {
          margin-bottom: 1.5rem;
        }
        .calendar-wrapper .fc-toolbar-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
        }
        .calendar-wrapper .fc-button {
          background-color: #6366f1;
          border-color: #6366f1;
          color: white;
          font-weight: 500;
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
        }
        .calendar-wrapper .fc-button:hover {
          background-color: #4f46e5;
          border-color: #4f46e5;
        }
        .calendar-wrapper .fc-button:focus {
          box-shadow: 0 0 0 2px #c7d2fe;
        }
        .calendar-wrapper .fc-button-active {
          background-color: #4338ca;
          border-color: #4338ca;
        }
        .calendar-wrapper .fc-event {
          border-radius: 0.375rem;
          border: none;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.125rem 0.25rem;
        }
        .calendar-wrapper .fc-daygrid-event {
          margin: 1px 0;
        }
        .calendar-wrapper .fc-day-today {
          background-color: #f8fafc;
        }
        .calendar-wrapper .fc-col-header-cell {
          background-color: #f9fafb;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }
      `}</style>
    </DashboardLayout>
  );
}
