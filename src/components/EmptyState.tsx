
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNotes } from '@/context/NotesContext';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No notes yet",
  description = "Create your first note to get started",
  action = "Create Note",
}) => {
  const { createNote } = useNotes();
  const navigate = useNavigate();
  
  const handleCreateNote = () => {
    const newNote = createNote();
    navigate(`/note/${newNote.id}`);
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 px-4 text-center">
      <div className="bg-primary/10 p-6 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
          <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path>
          <line x1="9" y1="9" x2="10" y2="9"></line>
          <line x1="9" y1="13" x2="15" y2="13"></line>
          <line x1="9" y1="17" x2="15" y2="17"></line>
        </svg>
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground max-w-sm">{description}</p>
      <Button onClick={handleCreateNote}>{action}</Button>
    </div>
  );
};

export default EmptyState;
