import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import "./Customer.css";

interface NotesProps {
  customerData: {
    notes: Array<{
      id: string;
      content: string;
      timestamp: string;
    }>;
  };
}

const Notes: React.FC = () => {
  const { customerData } = useOutletContext<NotesProps>();
  const [newNote, setNewNote] = useState("");

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would make an API call to add the note
    console.log("Adding note:", newNote);
    setNewNote("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="notes-container"
    >
      <form onSubmit={handleAddNote} className="add-note-form">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a new note..."
          className="note-input"
        />
        <button
          type="submit"
          disabled={!newNote.trim()}
          className="add-note-button"
        >
          Add Note
        </button>
      </form>

      {customerData.notes.length === 0 ? (
        <div className="no-notes">No notes available for this customer.</div>
      ) : (
        <div className="notes-list">
          {customerData.notes.map((note) => (
            <div key={note.id} className="note-item">
              <div className="note-header">
                <span className="note-timestamp">
                  {formatDate(note.timestamp)}
                </span>
              </div>
              <div className="note-content">{note.content}</div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Notes;
