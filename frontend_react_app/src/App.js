import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import "./index.css";
import NotesList from "./components/NotesList";
import NoteModal from "./components/NoteModal";
import NoNotesPlaceholder from "./components/NoNotesPlaceholder";

// Util to make unique IDs
function makeId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// Sample seed notes for demonstration (Ocean color accents)
const sampleNotes = [
  {
    id: makeId(),
    title: "Welcome to Ocean Notes",
    content: "This is an example note. Click me to edit or use the + button to create a new one.",
    createdAt: new Date(Date.now() - 1860000).toISOString(),
    updatedAt: null,
    color: "#2563EB",
  },
  {
    id: makeId(),
    title: "Try Editing & Deleting",
    content: "Click the trash icon to delete a note. An undo appears briefly.",
    createdAt: new Date(Date.now() - 900000).toISOString(),
    updatedAt: null,
    color: "#F59E0B",
  },
  {
    id: makeId(),
    title: "Ocean Professional Theme",
    content: "This UI uses the Ocean Professional palette for a clean, modern experience.",
    createdAt: new Date(Date.now() - 200000).toISOString(),
    updatedAt: null,
    color: "#EF4444",
  },
];

// PUBLIC_INTERFACE
function App() {
  // Theme Support (optional): provide a button to toggle theme for demonstration
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Notes state for app
  const [notes, setNotes] = useState(() => [...sampleNotes]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [modalNote, setModalNote] = useState(null);

  // Deletion/undo state
  const [deletePending, setDeletePending] = useState(null); // {note, timer}
  const undoTimeout = useRef(null);

  // Modal open/close handlers
  const openCreateModal = useCallback(() => {
    setModalMode("create");
    setModalNote(null);
    setModalOpen(true);
  }, []);
  const openEditModal = useCallback((note) => {
    setModalMode("edit");
    setModalNote(note);
    setModalOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalNote(null);
  }, []);

  // Handle save (add/edit)
  const handleSaveNote = useCallback(
    (newNote) => {
      if (modalMode === "create") {
        setNotes((prev) => [
          {
            ...newNote,
            id: makeId(),
            createdAt: new Date().toISOString(),
            updatedAt: null,
            color: pickAccentColor(),
          },
          ...prev,
        ]);
      } else if (modalMode === "edit" && modalNote) {
        setNotes((prev) =>
          prev.map((n) =>
            n.id === modalNote.id
              ? {
                  ...n,
                  title: newNote.title,
                  content: newNote.content,
                  updatedAt: new Date().toISOString(),
                }
              : n
          )
        );
      }
      closeModal();
    },
    [modalMode, modalNote, closeModal]
  );

  // Pick a color for new notes, cycling through theme colors
  function pickAccentColor() {
    const palette = ["#2563EB", "#F59E0B", "#EF4444"];
    const idx = notes.length % palette.length;
    return palette[idx];
  }

  // Delete with confirm/undo
  const handleDeleteNote = useCallback(
    (note) => {
      // Native confirm OR lightweight undo toast confirm (chose lightweight for Ocean Professional)
      setDeletePending({ note });
      undoTimeout.current = setTimeout(() => {
        setNotes((prev) => prev.filter((n) => n.id !== note.id));
        setDeletePending(null);
      }, 3500); // 3.5s undo window
    },
    [setNotes]
  );
  // Undo delete handler
  const handleUndoDelete = () => {
    clearTimeout(undoTimeout.current);
    setDeletePending(null);
  };

  // Remove timer on unmount
  useEffect(() => () => clearTimeout(undoTimeout.current), []);

  return (
    <div className="App ocean-theme">
      {/* Ocean style gradient header */}
      <header className="ocean-header">
        <div className="ocean-header-gradient" />
        <div className="ocean-header-content">
          <h1 className="ocean-title">
            <span role="img" aria-label="Wave">🌊</span> Ocean Notes
          </h1>
          <button
            className="ocean-btn ocean-btn-primary add-note-btn"
            onClick={openCreateModal}
            aria-label="Add new note"
          >
            <span aria-hidden="true">+</span> New Note
          </button>
          <button
            className="theme-toggle"
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </header>

      <main className="ocean-main">
        <NotesList
          notes={notes}
          onEdit={openEditModal}
          onDelete={handleDeleteNote}
          emptyPlaceholder={false}
        />
        {notes.length === 0 && (
          <NoNotesPlaceholder onAdd={openCreateModal} />
        )}
      </main>

      <NoteModal
        open={modalOpen}
        mode={modalMode}
        initialNote={modalNote}
        onSave={handleSaveNote}
        onCancel={closeModal}
      />

      {/* Undo Delete Toast */}
      {deletePending && (
        <UndoToast
          message={`Note "${deletePending.note.title}" deleted`}
          onUndo={handleUndoDelete}
        />
      )}

      <footer className="ocean-footer">
        <span>
          &copy; {new Date().getFullYear()} Ocean Notes &mdash; Modern notes app UI demo
        </span>
      </footer>
    </div>
  );
}

// Undo toast lightweight inline for user experience
function UndoToast({ message, onUndo }) {
  return (
    <div className="undo-toast" role="alert" aria-live="polite">
      {message}
      <button className="undo-toast-btn" onClick={onUndo} tabIndex={0} aria-label="Undo delete">
        Undo
      </button>
    </div>
  );
}

export default App;
