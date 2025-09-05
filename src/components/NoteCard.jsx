import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const NoteCard = ({ note, onRequestDelete, formatDate }) => {
  const handleDelete = useCallback(() => onRequestDelete(note), [note, onRequestDelete]);

  return (
    <div className="card p-6 hover:shadow-xl transition-shadow will-change-transform">
      <div className="flex justify-between items-start gap-3">
        <h3 className="text-lg font-semibold line-clamp-2">
          {note.title?.trim() || "Untitled Note"}
        </h3>

        <div className="flex items-center gap-1 ml-2">
          <Link to={`/edit/${note.id}`} className="icon-btn" title="Edit note">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <button onClick={handleDelete} className="icon-btn" title="Delete note">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {note.content ? (
        <p className="text-gray-600 text-sm mt-2 line-clamp-3">
          {note.content.slice(0, 200)}
          {note.content.length > 200 && "…"}
        </p>
      ) : (
        <p className="text-gray-400 text-sm mt-2 italic">No content</p>
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        {note.createdAt && <span>Created: {formatDate(note.createdAt)}</span>}
        {note.updatedAt && note.updatedAt !== note.createdAt && (
          <span>Updated: {formatDate(note.updatedAt)}</span>
        )}
      </div>

      <div className="mt-5 flex gap-2">
        <Link to={`/note/${note.id}`} className="btn-secondary flex-1 text-center text-sm">
          View
        </Link>
        <Link to={`/share/${note.id}`} className="btn-primary flex-1 text-center text-sm">
          Share
        </Link>
      </div>
    </div>
  );
};

NoteCard.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    content: PropTypes.string,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
    updatedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
  }).isRequired,
  onRequestDelete: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
};

export default React.memo(NoteCard);
