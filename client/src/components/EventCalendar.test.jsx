import React from 'react';
import { render, screen } from '@testing-library/react';
import EventFullCalendar from './EventFullCalendar';

const mockEvents = [
  {
    id: '1',
    title: 'Testing Event',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 3600000).toISOString(),
    type: 'Merger',
  },
];

describe('EventFullCalendar', () => {
  it('renders events on the calendar', () => {
    render(<EventFullCalendar events={mockEvents} refreshEvents={() => {}} onEventClick={() => {}} />);

    expect(screen.getByText(/Testing Event/i)).toBeInTheDocument();
    expect(screen.getByText(/Merger/i)).toBeInTheDocument();
  });
});