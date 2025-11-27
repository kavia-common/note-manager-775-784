import React from "react";
import NoteCard from "./NoteCard";
import NoNotesPlaceholder from "./NoNotesPlaceholder";
import PropTypes from "prop-types";

/**
 * PUBLIC_INTERFACE
 * The main container for the notes grid/list.
 * Renders notes in a responsive grid layout.
 */
export default function NotesList({
  notes,
  onEdit,
  onDelete,
  emptyPlaceholder = true,
  ...props
}) {
  return (
    <section
      className="notes-list-container"
      aria-label="Notes list"
      {...props}
    >
      {notes && notes.length > 0 ? (
        <div className="notes-grid">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        emptyPlaceholder && <NoNotesPlaceholder />
      )}
    </section>
  );
}

NotesList.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      content: PropTypes.string,
      createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      updatedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      color: PropTypes.string,
    })
  ),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  emptyPlaceholder: PropTypes.bool,
};
