import React from "react";
import PropTypes from "prop-types";

/**
 * PUBLIC_INTERFACE
 * Single note card component.
 * Handles click to edit and exposes delete icon with tooltip/aria-label.
 */
export default function NoteCard({ note, onEdit, onDelete }) {
  return (
    <article
      tabIndex={0}
      className="note-card"
      style={{
        "--note-accent": note.color || "var(--primary)",
      }}
      onClick={() => onEdit(note)}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") { onEdit(note); }
      }}
      aria-label={`Open note titled "${note.title}"`}
      role="button"
      aria-pressed="false"
    >
      <div className="note-card-content">
        <header className="note-card-header">
          <h3 className="note-title">{note.title}</h3>
          <button
            className="note-delete-btn"
            tabIndex={0}
            aria-label={`Delete note titled "${note.title}"`}
            title="Delete"
            onClick={e => { e.stopPropagation(); onDelete(note); }}
          >
            <span aria-hidden="true">🗑️</span>
          </button>
        </header>
        <p className="note-body">{note.content}</p>
      </div>
      <footer className="note-card-footer">
        <span className="note-meta">
          {note.updatedAt
            ? `Edited: ${formatDate(note.updatedAt)}` :
              `Created: ${formatDate(note.createdAt)}`}
        </span>
      </footer>
    </article>
  );
}

// Helper to format dates
function formatDate(date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
}

NoteCard.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    updatedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    color: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
