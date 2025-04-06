
import React from 'react';
import Layout from '@/components/Layout';
import { useNotes } from '@/context/NotesContext';
import EmptyState from '@/components/EmptyState';
import NoteCard from '@/components/NoteCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { notes, createNote } = useNotes();
  const navigate = useNavigate();
  
  const handleCreateNote = () => {
    const newNote = createNote();
    if (newNote) {
      navigate(`/note/${newNote.id}`);
    }
  };
  
  const handleNoteClick = (noteId: string) => {
    navigate(`/note/${noteId}`);
  };
  
  // If there are no notes, show the empty state
  if (notes.length === 0) {
    return (
      <Layout>
        <EmptyState />
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="h-full overflow-y-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">All Notes</h1>
          <Button onClick={handleCreateNote}>Create Note</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard 
              key={note.id} 
              note={note} 
              isCompact={false}
              onClick={() => handleNoteClick(note.id)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
