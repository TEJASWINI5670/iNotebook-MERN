import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import "./Home.css";
import { toast,Toaster } from "react-hot-toast";


const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8400";

const Home = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const [newNote, setNewNote] = useState({
    title: "",
    description: "",
  });

  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [error, setError] = useState("");

  // Close modal and reset form
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);

    setNewNote({
      title: "",
      description: "",
    });

    setError("");
  };

  const openCreateModal = () => {
    setError("");
    setSelectedNote(null);
    setNewNote({ title: "", description: "" });
    setIsModalOpen(true);
  };

  const openUpdateModal = (note) => {
    setError("");
    setSelectedNote(note);
    setNewNote({ title: note.title, description: note.description });
    setIsModalOpen(true);
  };

  // Handle input changes
  const handleNoteChange = (event) => {
    const { name, value } = event.target;

    setNewNote((currentNote) => ({
      ...currentNote,
      [name]: value,
    }));
  };

  // Fetch user's notes
  const fetchMyNotes = async () => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    navigate("/login", { replace: true });
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/notes/fetch-user-notes`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      }
    );

    const json = await response.json();

    console.log("FETCH NOTES RESPONSE:", json);

    if(json.success && Array.isArray(json.notes)){
      setData(json.notes);
    }
  } catch (error) {
    console.error("Unable to load notes:", error);
  }
};

  // Fetch notes when Home page loads
  useEffect(() => {
    fetchMyNotes();
  }, []);

  // Create new note
const handleAddNote = async (event) => {
  event.preventDefault();

  setError("");

  const token = sessionStorage.getItem("token");

  if (!token) {
    navigate("/login", { replace: true });
    return;
  }

  if (newNote.title.trim().length < 10) {
    setError("Title must be at least 10 characters.");
    return;
  }

  if (newNote.description.trim().length < 10) {
    setError("Description must be at least 10 characters.");
    return;
  }

  setIsCreating(true);

  try {
    const response = await fetch(
      `${API_URL}/api/notes/create-new-note`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          title: newNote.title,
          description: newNote.description,
        }),
      }
    );

    const json = await response.json();

    console.log("CREATE NOTE RESPONSE:", json);

    if (json.status) {
      // Show success toast
      toast.success("Note created successfully!");
console.log(json);

      // Close modal
      closeModal();

      // Refresh notes
      await fetchMyNotes();
    } else {
      toast.error(json.message || "Unable to create note.");
    }
  } catch (error) {
    console.error("Unable to create note:", error);

    toast.error("Something went wrong. Please try again.");
  } finally {
    setIsCreating(false);
  }
};

  const handleUpdateNote = async (event) => {
    event.preventDefault();
    setError("");

    if (newNote.title.trim().length < 10 || newNote.description.trim().length < 10) {
      setError("Title and description must each be at least 10 characters.");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token || !selectedNote) return;

    setIsCreating(true);
    try {
      const response = await fetch(`${API_URL}/api/notes/update-my-specific-note`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ _id: selectedNote._id, ...newNote }),
      });
      const json = await response.json();

      if (json.success) {
        toast.success("Note updated successfully!");
        closeModal();
        await fetchMyNotes();
      } else {
        toast.error(json.message || "Unable to update note.");
      }
    } catch (error) {
      console.error("Unable to update note:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteNote = async (note) => {
    if (!window.confirm(`Delete "${note.title}"? This cannot be undone.`)) return;

    const token = sessionStorage.getItem("token");
    if (!token) return;

    setIsDeleting(note._id);
    try {
      const response = await fetch(`${API_URL}/api/notes/delete-specific-note`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ _id: note._id }),
      });
      const json = await response.json();

      if (response.ok && json.success !== false) {
        setData((notes) => notes.filter(({ _id }) => _id !== note._id));
        toast.success("Note deleted successfully!");
      } else {
        toast.error(json.message || "Unable to delete note.");
      }
    } catch (error) {
      console.error("Unable to delete note:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <>
    <Toaster/>
      <Navbar />

      <main className="notes-page">
        {/* Page heading */}
        <div className="notes-heading">
          <div>
            <p className="notes-eyebrow">MY WORKSPACE</p>

            <h1>My notes</h1>
          </div>

          <button
            className="add-note-button"
            type="button"
            onClick={openCreateModal}
          >
            <span aria-hidden="true">+</span>

            Add note
          </button>
        </div>

        {/* Notes */}
        <section
          className="notes-grid"
          aria-label="Your notes"
        >
          {data.length === 0 ? (
            <div
              className="empty-notes"
              role="status"
            >
              <div
                className="empty-notes-icon"
                aria-hidden="true"
              >
                ✦
              </div>

              <h2>No notes yet</h2>

              <p>
                Your workspace is ready. Create a note to
                start capturing your ideas.
              </p>
            </div>
          ) : (
            data.map((note) => (
              <NoteCard
                key={note._id}
                title={note.title}
                description={note.description}
                onUpdate={() => openUpdateModal(note)}
                onDelete={() => handleDeleteNote(note)}
                isDeleting={isDeleting === note._id}
              />
            ))
          )}
        </section>
      </main>

      {/* Create or update note modal */}
      {isModalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={closeModal}
        >
          <section
            className="note-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="note-modal-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            {/* Modal heading */}
            <div className="modal-heading">
              <div>
                <p className="notes-eyebrow">
                  {selectedNote ? "UPDATE NOTE" : "NEW NOTE"}
                </p>

                <h2 id="note-modal-title">
                  {selectedNote ? "Update your note" : "Create a note"}
                </h2>
              </div>

              <button
                className="modal-close"
                type="button"
                onClick={closeModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* Create form */}
            <form
              className="note-form"
              onSubmit={selectedNote ? handleUpdateNote : handleAddNote}
            >
              <label htmlFor="note-title">
                Title
              </label>

              <input
                id="note-title"
                name="title"
                value={newNote.title}
                onChange={handleNoteChange}
                placeholder="Give your note a title"
                minLength={10}
                maxLength={150}
                required
                autoFocus
              />

              <label htmlFor="note-description">
                Description
              </label>

              <textarea
                id="note-description"
                name="description"
                value={newNote.description}
                onChange={handleNoteChange}
                placeholder="Write your note here..."
                rows="6"
                minLength={10}
                required
              />

              {/* Error */}
              {error && (
                <p className="note-error">
                  {error}
                </p>
              )}

              {/* Buttons */}
              <div className="modal-actions">
                <button
                  className="cancel-note-button"
                  type="button"
                  onClick={closeModal}
                  disabled={isCreating}
                >
                  Cancel
                </button>

                <button
                  className="save-note-button"
                  type="submit"
                  disabled={isCreating}
                >
                  {isCreating
                    ? "Saving..."
                    : selectedNote ? "Update note" : "Save note"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
};

export default Home;
