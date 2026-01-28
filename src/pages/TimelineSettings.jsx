import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import TimelineEventForm from '../components/admin/TimelineEventForm';
import {
  getExhibitionDate,
  updateExhibitionDate,
  getTimelineEvents,
  addTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent
} from '../services/timelineService';

const TimelineSettings = () => {
  const navigate = useNavigate();
  const [exhibitionDate, setExhibitionDate] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [savingDate, setSavingDate] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [date, eventsData] = await Promise.all([
        getExhibitionDate(),
        getTimelineEvents()
      ]);
      setExhibitionDate(date);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading timeline data:', error);
      showMessage('error', 'Failed to load timeline data');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleDateSave = async () => {
    try {
      setSavingDate(true);
      await updateExhibitionDate(exhibitionDate);
      showMessage('success', 'Exhibition date updated successfully');
    } catch (error) {
      console.error('Error updating date:', error);
      showMessage('error', 'Failed to update exhibition date');
    } finally {
      setSavingDate(false);
    }
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingEvent) {
        await updateTimelineEvent(editingEvent.id, formData);
        showMessage('success', 'Event updated successfully');
      } else {
        await addTimelineEvent(formData);
        showMessage('success', 'Event added successfully');
      }
      setShowForm(false);
      setEditingEvent(null);
      await loadData();
    } catch (error) {
      console.error('Error saving event:', error);
      showMessage('error', 'Failed to save event');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await deleteTimelineEvent(id);
      showMessage('success', 'Event deleted successfully');
      await loadData();
    } catch (error) {
      console.error('Error deleting event:', error);
      showMessage('error', 'Failed to delete event');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600 mx-auto mb-4"></div>
            <p className="text-brown-600">Loading timeline settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-brown-900">
            Exhibition Timeline Settings
          </h1>
          <p className="text-brown-600 mt-2">
            Manage exhibition date and timeline events
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Exhibition Date */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-brown-900 mb-4">Exhibition Date</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={exhibitionDate}
              onChange={(e) => setExhibitionDate(e.target.value)}
              placeholder="9 January 2026"
              className="flex-1 px-4 py-2 border border-brown-300 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent"
            />
            <button
              onClick={handleDateSave}
              disabled={savingDate}
              className="bg-brown-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brown-700 hover:scale-105 transition-all duration-200 disabled:bg-brown-400 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {savingDate ? 'Saving...' : 'Save Date'}
            </button>
          </div>
        </div>

        {/* Timeline Events */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-brown-900">Timeline Events</h2>
            <button
              onClick={handleAddEvent}
              className="flex items-center gap-2 bg-brown-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brown-700 hover:scale-105 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Event
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="mb-6 p-6 bg-brown-50 rounded-lg border border-brown-200">
              <h3 className="text-lg font-semibold text-brown-900 mb-4">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h3>
              <TimelineEventForm
                event={editingEvent}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          )}

          {/* Events List */}
          {events.length === 0 ? (
            <div className="text-center py-12 text-brown-600">
              <svg className="w-16 h-16 mx-auto mb-4 text-brown-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">No timeline events yet</p>
              <p className="text-sm mt-1">Click "Add Event" to create your first timeline event</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-4 bg-brown-50 rounded-lg border border-brown-200 hover:border-brown-300 transition-colors"
                >
                  <div className="flex-shrink-0 w-20 text-right">
                    <span className="text-lg font-bold text-brown-800">{event.time}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-brown-900 mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-brown-700">{event.description}</p>
                    <p className="text-xs text-brown-500 mt-1">Order: {event.order}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="p-2 text-brown-600 hover:bg-brown-200 hover:scale-110 rounded-lg transition-all duration-200"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2 text-red-600 hover:bg-red-100 hover:scale-110 rounded-lg transition-all duration-200"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default TimelineSettings;
