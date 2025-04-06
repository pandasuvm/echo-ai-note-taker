
import React, { useState, useEffect, useRef } from 'react';
import { useNotes, Note } from '@/context/NotesContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AIToolbar from './AIToolbar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface NoteEditorProps {
  noteId: string;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ noteId }) => {
  const { getNoteById, updateNote, folders } = useNotes();
  const [note, setNote] = useState<Note | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [folder, setFolder] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newFolder, setNewFolder] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    const currentNote = getNoteById(noteId);
    if (currentNote) {
      setNote(currentNote);
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setTags(currentNote.tags);
      setFolder(currentNote.folder);
    }
  }, [noteId, getNoteById]);
  
  // Auto-save when title, content, tags, or folder changes
  useEffect(() => {
    if (note) {
      const timeoutId = setTimeout(() => {
        updateNote(note.id, { title, content, tags, folder });
      }, 500); // Debounce auto-save
      
      return () => clearTimeout(timeoutId);
    }
  }, [title, content, tags, folder, note, updateNote]);
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleCreateFolder = () => {
    if (newFolder.trim() && !folders.includes(newFolder.trim())) {
      setFolder(newFolder.trim());
      setIsAddingFolder(false);
      setNewFolder('');
      toast.success('Folder created');
    }
  };
  
  // Handle insertions from AI toolbar
  const handleInsertText = (text: string) => {
    if (contentRef.current) {
      const start = contentRef.current.selectionStart;
      const end = contentRef.current.selectionEnd;
      const newContent = content.substring(0, start) + text + content.substring(end);
      setContent(newContent);
      
      // Set cursor position after inserted text
      setTimeout(() => {
        contentRef.current?.setSelectionRange(start + text.length, start + text.length);
        contentRef.current?.focus();
      }, 0);
    } else {
      setContent(content + text);
    }
  };

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Note not found</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex flex-col gap-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="text-xl font-semibold border-none px-0 focus-visible:ring-0"
        />
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex-1 sm:max-w-[200px]">
            {isAddingFolder ? (
              <div className="flex">
                <Input
                  value={newFolder}
                  onChange={(e) => setNewFolder(e.target.value)}
                  placeholder="New folder name"
                  className="rounded-r-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                />
                <Button
                  variant="default"
                  size="icon"
                  className="rounded-l-none"
                  onClick={handleCreateFolder}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Select value={folder} onValueChange={setFolder}>
                <SelectTrigger>
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                  <SelectItem value="__new__" onClick={() => setIsAddingFolder(true)}>
                    + Create new folder
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="flex-1 flex gap-2 flex-wrap">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-2 py-0.5">
                {tag}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                />
              </Badge>
            ))}
            <div className="flex items-center">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag..."
                className="h-8 min-w-[100px] w-[100px] text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                onBlur={() => newTag.trim() && handleAddTag()}
              />
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <AIToolbar onInsert={handleInsertText} content={content} />
      
      <div className="flex-1 overflow-y-auto p-4">
        <Textarea
          ref={contentRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="min-h-[300px] h-full w-full resize-none border-none p-0 focus-visible:ring-0 note-editor"
        />
      </div>
    </div>
  );
};

export default NoteEditor;
