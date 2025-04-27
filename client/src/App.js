import './App.css';
import React, { useState, useRef } from 'react';
import { getEvents } from './services/event';
import EventForm from './components/EventForm';
import EventTimeline from './components/EventFullCalendar';

const App = () => {
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState({});
  const [currentDates, setCurrentDates] = useState([]);
  const formRef = useRef(null); // to trigger the ModalForm

  const fetchEvents = async (dates = []) => {
    const query = {
      startDate: currentDates[0] ? currentDates[0].toISOString() : null,
      endDate: currentDates[1] ? currentDates[1].toISOString() : null
    }
    if (dates.length) {
      query.startDate = dates[0].toISOString();
      query.endDate = dates[1].toISOString();
    }
    const { data } = await getEvents(query);
    setCurrentDates(dates);
    setEvents(data);
  };

  const handleEventClick = (item) => {
    const clickedEvent = {
      id: item.event.id,
      title: item.event.title,
      ...item.event.extendedProps
    };

    setCurrentEvent(clickedEvent);

    // Open form
    if (formRef.current) {
      formRef.current.openModal();
    }
  };

  const clearCurrentEvent = () => {
    setCurrentEvent({});
  };

  return (
    <div className="App">
      <h1>Event Planner</h1>
      <EventForm ref={formRef} refreshEvents={fetchEvents} current={currentEvent} clearCurrentEvent={clearCurrentEvent} />
      <EventTimeline events={events} refreshEvents={fetchEvents} onEventClick={handleEventClick} />
    </div>
  );
};

export default App;
