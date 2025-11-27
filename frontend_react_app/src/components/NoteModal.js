import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

/**
 * PUBLIC_INTERFACE
 * NoteModal: Modal dialog for creating or editing a note.
 * Focus trap, ESC/overlay/cancel close, ARIA attributes, animation, validation.
 */
export default function NoteModal({
  open,
  mode = "create", // "edit" | "create"
  initialNote,
  onSave,
  onCancel,
}) {
  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || "");
  const [error, setError] = useState("");
  const modalRef = useRef(null);
  const firstFieldRef = useRef(null);

  // Reset state on open
  useEffect(() => {
    if (open) {
      setTitle(initialNote?.title || "");
      setContent(initialNote?.content || "");
      setError("");
      setTimeout(() => {
        firstFieldRef.current?.focus();
      }, 80);
    }
  }, [open, initialNote]);

  // Close on ESC/key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Tab") {
        // Focus trap logic
        const focusable = modalRef.current.querySelectorAll("button, [tabindex]:not([tabindex='-1']), textarea, input");
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  // Click outside overlay closes
  function handleOverlayClick(e) {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onCancel();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      firstFieldRef.current?.focus();
      return;
    }
    onSave({
      ...initialNote,
      title: title.trim(),
      content,
    });
  }

  // Trap focus when modal is open
  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const origOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    return () => { body.style.overflow = origOverflow; };
  }, [open]);

  if (!open) return null;
  return (
    <div
      className="modal-overlay"
      onMouseDown={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      aria-labelledby="note-modal-title"
      aria-describedby="note-modal-desc"
    >
      <div
        className="modal-panel"
        ref={modalRef}
        style={{ animation: "modal-in 220ms cubic-bezier(.2,.6,.4,1)" }}
        onMouseDown={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <h2 id="note-modal-title" className="modal-title">
            {mode === "edit" ? "Edit Note" : "Create Note"}
          </h2>
          <div className="modal-form-group">
            <label htmlFor="note-title" className="modal-label">
              Title<span className="modal-required">*</span>
            </label>
            <input
              ref={firstFieldRef}
              type="text"
              id="note-title"
              className="modal-input"
              value={title}
              maxLength={64}
              autoComplete="off"
              onChange={e => {
                setTitle(e.target.value); setError("");
              }}
              required
              aria-invalid={!!error}
              aria-describedby={error ? "note-title-err" : undefined}
            />
            {error && (
              <span className="modal-error" id="note-title-err">
                {error}
              </span>
            )}
          </div>
          <div className="modal-form-group">
            <label htmlFor="note-content" className="modal-label">
              Content
            </label>
            <textarea
              id="note-content"
              className="modal-input"
              value={content}
              rows={5}
              maxLength={2048}
              autoComplete="off"
              onChange={e => setContent(e.target.value)}
            />
          </div>
          <footer className="modal-footer">
            <button
              type="button"
              className="modal-btn modal-btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn-primary"
              aria-disabled={!title.trim()}
            >
              Save
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

NoteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(["create", "edit"]),
  initialNote: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
