
import React from 'react';
import { Note } from '@/context/NotesContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: Note;
  onClick?: () => void;
  isCompact?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onClick, isCompact = true }) => {
  // Format the date to a readable string (e.g., "5 minutes ago")
  const formattedDate = formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true });
  
  // Extract a preview from the content
  const contentPreview = note.content
    .replace(/#+\s/g, '') // Remove markdown headers
    .replace(/\*\*/g, '') // Remove bold markers
    .replace(/\*/g, '') // Remove italic markers
    .replace(/\[|\]\(.*?\)/g, '') // Remove markdown links
    .trim();
  
  if (isCompact) {
    return (
      <Card 
        className="cursor-pointer hover:bg-accent transition-colors border-none shadow-none"
        onClick={onClick}
      >
        <CardContent className="p-3">
          <div className="space-y-1">
            <h3 className="font-medium leading-none">{note.title}</h3>
            {note.content && (
              <p className="text-sm text-muted-foreground line-clamp-1">{contentPreview}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card 
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <h3 className="text-lg font-medium">{note.title}</h3>
          {note.content && (
            <p className="text-sm text-muted-foreground line-clamp-3 note-content">{contentPreview}</p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {note.tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
              ))}
              {note.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">+{note.tags.length - 3}</Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
