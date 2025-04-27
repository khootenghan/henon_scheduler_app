import React from 'react';
import moment from 'moment';
import lodash from 'lodash';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'; // for drag-n-drop
import { Modal, Button, message, Popconfirm } from 'antd';
import { deleteEvent, updateEvent } from '../services/event';

const EventFullCalendar = ({ events, refreshEvents, onEventClick }) => {
  const formatEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.startDate,
    end: event.endDate,
    type: event.type,
    eventTime: [moment(event.startDate), moment(event.endDate)],
    backgroundColor: getColorByType(event.type),
  }));

  function getColorByType(type) {
    switch (type) {
      case 'Merger':
        return '#FF9F1C';
      case 'Dividends':
        return '#2EC4B6';
      case 'New Capital':
        return '#E71D36';
      case 'Hire':
        return '#011627';
      default:
        return '#888';
    }
  }

  // Drag and drop update event time
  const handleEventDrop = async (info) => {
    const updatedEvent = {
      id: info.event.id,
      eventTime: [info.event.start.toISOString(), info.event.end.toISOString()]
    };

    try {
      const updated = await updateEvent(updatedEvent)
      if (updated) {
        message.success(<b>{info.event.title}: Time updated!</b>)
      }
    } catch (error) {
      message.error(<b>Could not update event! Please try again later.</b>)
    }

    refreshEvents();
  };

  // Query data based on calendar view/date range
  const handleDatesSet = async (dateInfo) => {
    refreshEvents([dateInfo.start, dateInfo.end])
  }

  // Edit/delete event with double confirmation on delete
  const handleItemClick = (item) => {
    if (item?.event && onEventClick) {
      const { type, eventTime } = item.event.extendedProps
      const modal = Modal.confirm()
      modal.update({
        title: 'Event Information',
        content: <div>
          <div>Title: <b>{item.event.title}</b></div>
          <div>Type: {type}</div>
          <div>Start At: {new Date(eventTime[0]).toLocaleString()}</div>
          <div>End At: {new Date(eventTime[1]).toLocaleString()}</div>
        </div>,
        onOk: () => onEventClick(item),
        okText: 'Edit Event',
        footer: (_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={async () => {
                await deleteEvent(item.event.id);
                modal.destroy();
                refreshEvents();
              }}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="primary"
                danger
              >
                Delete Event
              </Button>
            </Popconfirm>
            <OkBtn/>
          </>
        ),
      });
    }
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h2>Calendar View</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'dayGridMonth,timeGridWeek,listWeek',
          center: 'title'
        }}
        editable={true}
        droppable={true}
        events={formatEvents}
        eventDrop={handleEventDrop}
        eventClick={handleItemClick}
        datesSet={lodash.debounce(handleDatesSet, 200)}
        height="75vh"
        eventContent={(e) => {
          // Display type & event time according to views
          const display = [
            <span>{e.event?.title}</span>
          ]
          if (e.event?.extendedProps) {
            const { type, eventTime } = e.event?.extendedProps
            display.push(<span style={{ marginLeft: 2 }}>({type})</span>)
            if (['timeGridWeek', 'dayGridMonth'].includes(e.view?.type)) {
              display.push(<div>
                {new Date(eventTime[0]).toLocaleString()} - {new Date(eventTime[1]).toLocaleString()}
              </div>)
            }
          }
          return display
        }}
      />
    </div>
  );
};

export default EventFullCalendar;
