
import React, { useState } from 'react';
import { useNotes } from '@/context/NotesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import NoteCard from './NoteCard';
import { Plus, Search, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { notes, folders, createNote, filterNotes } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const filteredNotes = filterNotes(searchQuery, activeFolder || undefined);
  
  const handleCreateNote = () => {
    const newNote = createNote();
    navigate(`/note/${newNote.id}`);
    if (onClose) onClose();
  };
  
  const handleNoteClick = (noteId: string) => {
    navigate(`/note/${noteId}`);
    if (onClose) onClose();
  };

  const handleFolderClick = (folder: string) => {
    setActiveFolder(activeFolder === folder ? null : folder);
  };

  return (
    <div className="h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold">Echo Notes</h1>
          </div>
        </div>
      </div>
      
      <div className="flex px-3 pb-3 pt-1">
        <Button 
          onClick={handleCreateNote} 
          className="w-full bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" /> New Note
        </Button>
      </div>
      
      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Separator className="my-2" />
      
      {/* Folders */}
      <div className="px-3">
        <h2 className="mb-2 px-1 text-sm font-semibold tracking-tight">Folders</h2>
        <div className="space-y-1">
          {folders.map((folder) => (
            <Button
              key={folder}
              variant={activeFolder === folder ? "secondary" : "ghost"}
              className="w-full justify-start text-left font-normal"
              onClick={() => handleFolderClick(folder)}
            >
              {folder}
              <span className="ml-auto text-xs text-muted-foreground">
                {notes.filter(n => n.folder === folder).length}
              </span>
            </Button>
          ))}
        </div>
      </div>
      
      <Separator className="my-2" />
      
      {/* Notes List */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 pb-4">
          {filteredNotes.length > 0 ? (
            filteredNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => handleNoteClick(note.id)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground mb-2">No notes found</p>
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  className="text-xs"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
