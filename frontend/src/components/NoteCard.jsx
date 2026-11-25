import "./NoteCard.css";

const NoteCard = ({ title, description, onUpdate, onDelete, isDeleting }) => (
  <article className="note-card">
    <div className="note-card-accent" aria-hidden="true" />
    <div className="note-card-content">
      <p className="note-card-label">NOTE</p>
      <h2 className="note-card-title">{title}</h2>
      <p className="note-card-description">{description}</p>

      <div className="note-card-actions">
        <button
          className="update-note-button"
          type="button"
          onClick={onUpdate}
        >
          Edit
        </button>
        <button
          className="delete-note-button"
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </article>
);

export default NoteCard;
