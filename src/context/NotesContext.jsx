import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { notesAPI, getErrorMessage } from '../services/api';

const NotesContext = createContext();

const initialState = { notes: [], loading: false, error: null, selectedNote: null };

const notesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'SET_ERROR': return { ...state, error: action.payload, loading: false };
    case 'SET_NOTES': return { ...state, notes: action.payload, loading: false, error: null };
    case 'ADD_NOTE': return { ...state, notes: [action.payload, ...state.notes], loading: false, error: null };
    case 'UPDATE_NOTE': return { ...state, notes: state.notes.map(n => String(n.id) === String(action.payload.id) ? action.payload : n), loading: false, error: null };
    case 'DELETE_NOTE': return { ...state, notes: state.notes.filter(n => String(n.id) !== String(action.payload)), selectedNote: String(state.selectedNote?.id) === String(action.payload) ? null : state.selectedNote, loading: false, error: null };
    case 'SET_SELECTED_NOTE': return { ...state, selectedNote: action.payload };
    case 'CLEAR_ERROR': return { ...state, error: null };
    default: return state;
  }
};

export const NotesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  useEffect(() => { loadNotes(); }, []);

  const loadNotes = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await notesAPI.getAllNotes();
      dispatch({ type: 'SET_NOTES', payload: res.data });
    } catch (error) {
      const msg = getErrorMessage(error) || 'Failed to load notes';
      dispatch({ type: 'SET_ERROR', payload: msg });
      toast.error(msg);
    }
  };

  const createNote = async (data) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await notesAPI.createNote(data);
      dispatch({ type: 'ADD_NOTE', payload: res.data });
      toast.success('Note created successfully!');
      return res.data;
    } catch (error) {
      const msg = getErrorMessage(error) || 'Failed to create note';
      dispatch({ type: 'SET_ERROR', payload: msg });
      toast.error(msg);
      throw error;
    }
  };

  const updateNote = async (id, data) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await notesAPI.updateNote(id, data);
      dispatch({ type: 'UPDATE_NOTE', payload: res.data });
      toast.success('Note updated successfully!');
      return res.data;
    } catch (error) {
      const msg = getErrorMessage(error) || 'Failed to update note';
      dispatch({ type: 'SET_ERROR', payload: msg });
      toast.error(msg);
      throw error;
    }
  };

  const deleteNote = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await notesAPI.deleteNote(id);
      dispatch({ type: 'DELETE_NOTE', payload: id });
      toast.success('Note deleted successfully!');
    } catch (error) {
      const msg = getErrorMessage(error) || 'Failed to delete note';
      dispatch({ type: 'SET_ERROR', payload: msg });
      toast.error(msg);
      throw error;
    }
  };

  const getNoteById = async (id) => {
    try {
      const res = await notesAPI.getNoteById(id);
      dispatch({ type: 'SET_SELECTED_NOTE', payload: res.data });
      return res.data;
    } catch (error) {
      const msg = getErrorMessage(error) || 'Failed to load note';
      dispatch({ type: 'SET_ERROR', payload: msg });
      toast.error(msg);
      throw error;
    }
  };

  const getSharedNote = async (id) => {
    try {
      const res = await notesAPI.getSharedNote(id);
      return res.data;
    } catch (error) {
      const msg = getErrorMessage(error) || 'Failed to load shared note';
      dispatch({ type: 'SET_ERROR', payload: msg });
      toast.error(msg);
      throw error;
    }
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  const value = useMemo(() => ({
    ...state,
    loadNotes,
    createNote,
    updateNote,
    deleteNote,
    getNoteById,
    getSharedNote,
    clearError,
  }), [state]);

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export const useNotes = () => {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within a NotesProvider');
  return ctx;
};

NotesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
