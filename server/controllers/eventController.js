const { Op } = require('sequelize');
const Event = require('../models/eventModel');

// Get all events in a date range
const getEvents = async (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Missing required query parameters' });
    }
    const events = await Event.findAll({
      where: {
        startDate: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });
    res.json(events);
};

// Create a new event
const createEvent = async (req, res) => {
    const { title, type, eventTime } = req.body;
    const [startDate, endDate] = eventTime

    if (!title || !type || !startDate || !endDate) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    if (new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({ message: 'Start date must be before end date' });
    }

    const newEvent = await Event.create({ title, type, startDate, endDate });
    res.status(201).json(newEvent);
};

// Update an event
const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, type, eventTime } = req.body;
    const [startDate, endDate] = eventTime

    const event = await Event.findByPk(id);
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    if (new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({ message: 'Start date must be before end date' });
    }
    
    const updateBody = {}
    if (title) updateBody.title = title;
    if (type) updateBody.type = type;
    if (startDate) updateBody.startDate = startDate;
    if (endDate) updateBody.endDate = endDate;

    await event.update(updateBody);
    res.json(event);
};

// Delete an event
const deleteEvent = async (req, res) => {
    const { id } = req.params;

    const event = await Event.findByPk(id);
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    await event.destroy();
    res.json({ message: 'Event deleted successfully' });
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};