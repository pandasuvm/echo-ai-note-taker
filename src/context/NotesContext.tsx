
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  folder: string;
}

interface NotesContextType {
  notes: Note[];
  folders: string[];
  activeNote: Note | null;
  setActiveNote: (note: Note | null) => void;
  createNote: () => void;
  updateNote: (id: string, data: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
  filterNotes: (query: string, folder?: string) => Note[];
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

const DEFAULT_NOTE = {
  title: 'Untitled Note',
  content: '',
  tags: [],
  folder: 'Personal',
};

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  // Load notes from localStorage on initial render
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      // Create a sample note if no notes exist
      const sampleNote = {
        id: generateId(),
        title: 'Welcome to Echo',
        content: '# Welcome to Echo Notes\n\nEcho is your AI-powered note-taking companion. Here are some things you can do:\n\n- Create and organize notes\n- Use AI to summarize your notes\n- Get writing suggestions\n- Generate content based on prompts\n- Organize with tags and folders\n\nTo get started, create a new note using the + button in the sidebar.',
        tags: ['welcome', 'getting-started'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        folder: 'Getting Started',
      };
      setNotes([sampleNote]);
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes]);

  // Get unique folders from notes
  const folders = Array.from(new Set(notes.map(note => note.folder)));

  // Generate a unique ID
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Create a new note
  const createNote = () => {
    const newNote: Note = {
      id: generateId(),
      ...DEFAULT_NOTE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNote(newNote);
    return newNote;
  };

  // Update an existing note
  const updateNote = (id: string, data: Partial<Note>) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === id 
          ? { 
              ...note, 
              ...data, 
              updatedAt: new Date().toISOString() 
            } 
          : note
      )
    );
    
    // Update active note if it's the one being edited
    if (activeNote && activeNote.id === id) {
      setActiveNote(prev => prev ? { ...prev, ...data, updatedAt: new Date().toISOString() } : null);
    }
  };

  // Delete a note
  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    
    // Clear active note if it's the one being deleted
    if (activeNote && activeNote.id === id) {
      setActiveNote(null);
    }
  };

  // Get note by ID
  const getNoteById = (id: string): Note | undefined => {
    return notes.find(note => note.id === id);
  };

  // Filter notes by search query and folder
  const filterNotes = (query: string, folder?: string): Note[] => {
    return notes.filter(note => {
      const matchesQuery = query === '' || 
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      const matchesFolder = !folder || note.folder === folder;
      
      return matchesQuery && matchesFolder;
    });
  };

  return (
    <NotesContext.Provider value={{
      notes,
      folders,
      activeNote,
      setActiveNote,
      createNote,
      updateNote,
      deleteNote,
      getNoteById,
      filterNotes,
    }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
