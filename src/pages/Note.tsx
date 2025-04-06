
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import NoteEditor from '@/components/NoteEditor';
import { useNotes } from '@/context/NotesContext';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

const Note = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const { getNoteById, deleteNote } = useNotes();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  
  const note = noteId ? getNoteById(noteId) : undefined;
  
  useEffect(() => {
    // If note doesn't exist, navigate back to home
    if (noteId && !note) {
      toast.error('Note not found');
      navigate('/');
    }
  }, [noteId, note, navigate]);
  
  const handleDeleteNote = () => {
    if (noteId) {
      deleteNote(noteId);
      toast.success('Note deleted');
      navigate('/');
    }
  };
  
  if (!noteId || !note) {
    return (
      <Layout>
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">Note not found</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="h-full flex flex-col relative">
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
        
        <NoteEditor noteId={noteId} />
        
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the note.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteNote}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default Note;
