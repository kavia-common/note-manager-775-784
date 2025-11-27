import React from "react";

/**
 * PUBLIC_INTERFACE
 * Renders a friendly placeholder when there are no notes.
 */
export default function NoNotesPlaceholder({ onAdd }) {
  return (
    <div className="notes-empty-container">
      <div className="notes-empty-hero">
        <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="notes-empty-hero-icon" aria-hidden="true">
          <rect width="64" height="64" rx="18" fill="#2563EB" fillOpacity={0.13}/>
          <path d="M19 21a4 4 0 0 1 4-4h13.1a4 4 0 0 1 2.83 1.17l6.9 6.9A4 4 0 0 1 47 27.9V43a4 4 0 0 1-4 4H23a4 4 0 0 1-4-4V21Zm18 2v4a2 2 0 0 0 2 2h4" stroke="#2563EB" strokeWidth="2"/>
        </svg>
        <h2>No notes yet</h2>
        <p className="notes-empty-desc">
          Start by creating your first note!
        </p>
        <button
          className="notes-empty-btn"
          onClick={e => { e.preventDefault(); onAdd && onAdd(); }}
        >
          <span aria-hidden="true">+</span> New Note
        </button>
      </div>
    </div>
  );
}
