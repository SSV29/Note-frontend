import React, { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Modal from './Modal.jsx';
import NoteCard from './NoteCard.jsx';
import { useNotes } from '../context/NotesContext.jsx';

const NotesList = () => {
  const { notes, loading, error, deleteNote } = useNotes();
  const [confirm, setConfirm] = useState({ open: false, note: null });

  const openDelete = useCallback((note) => setConfirm({ open: true, note }), []);
  const closeDelete = useCallback(() => setConfirm({ open: false, note: null }), []);

  const onDelete = useCallback(async () => {
    if (!confirm.note) return;
    try {
      await deleteNote(confirm.note.id);
    } finally {
      closeDelete();
    }
  }, [confirm.note, deleteNote, closeDelete]);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <p className="text-red-600 font-medium">{error}</p>
        <button onClick={window.location.reload} className="btn-secondary mt-4">Retry</button>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-16 h-16 rounded-2xl grid place-items-center bg-white shadow mb-4">
          <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold">No notes yet</h2>
        <p className="text-gray-600 mt-2">Create your first note to get started.</p>
        <Link to="/new" className="btn-primary mt-6 inline-flex">Create Note</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Your Notes</h2>
        <span className="text-sm text-gray-500">{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onRequestDelete={openDelete} formatDate={formatDate} />
        ))}
      </div>

      <Modal
        isOpen={confirm.open}
        onClose={closeDelete}
        title="Delete note?"
        actions={(
          <>
            <button onClick={closeDelete} className="btn-secondary text-sm">Cancel</button>
            <button onClick={onDelete} className="btn-danger text-sm">Delete</button>
          </>
        )}
      >
        <p>Are you sure you want to delete <span className="font-medium">{confirm.note?.title || 'this note'}</span>? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default NotesList;
