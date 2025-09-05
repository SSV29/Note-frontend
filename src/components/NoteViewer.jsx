

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useNotes } from '../context/NotesContext.jsx';

const NoteViewer = ({ isShared = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNoteById, getSharedNote, loading, error } = useNotes();
  
  const [note, setNote] = useState(null);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (id) {
      loadNote();
    }
  }, [id]);

  const loadNote = async () => {
    try {
      const noteData = isShared ? await getSharedNote(id) : await getNoteById(id);
      setNote(noteData);
      
      if (!isShared) {
        // Generate share URL for regular notes
        const baseUrl = window.location.origin;
        setShareUrl(`${baseUrl}/share/${id}`);
      }
    } catch (error) {
      console.error('Error loading note:', error);
    }
  };

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy share link');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">Error loading note</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
        {!isShared && (
          <Link to="/" className="btn-primary mt-4">
            Back to Notes
          </Link>
        )}
      </div>
    );
  }

  if (!note) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium text-gray-600">Note not found</p>
        </div>
        {!isShared && (
          <Link to="/" className="btn-primary mt-4">
            Back to Notes
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {isShared && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-blue-800 text-sm">
              This is a shared note. You can view it but cannot edit it.
            </p>
          </div>
        </div>
      )}

      <div className="card p-8">
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {note.title || 'Untitled Note'}
            </h1>
            {!isShared && (
              <div className="flex space-x-2 ml-4">
                <Link
                  to={`/edit/${note.id}`}
                  className="btn-secondary text-sm"
                >
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Link>
                <button
                  onClick={copyShareUrl}
                  className="btn-primary text-sm"
                >
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span>Created: {formatDate(note.createdAt)}</span>
            {note.updatedAt !== note.createdAt && (
              <span>Updated: {formatDate(note.updatedAt)}</span>
            )}
          </div>
        </div>

        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {note.content || 'No content available.'}
          </div>
        </div>
      </div>

      {!isShared && shareUrl && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Share this note</h3>
          <div className="flex">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-white text-sm"
            />
            <button
              onClick={copyShareUrl}
              className="px-4 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors duration-200 text-sm"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-start">
        <Link
          to={isShared ? "/" : "/"}
          className="btn-secondary"
        >
          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {isShared ? 'Back to Home' : 'Back to Notes'}
        </Link>
      </div>
    </div>
  );
};

export default NoteViewer;
NoteViewer.propTypes = {
  isShared: PropTypes.bool,
};
