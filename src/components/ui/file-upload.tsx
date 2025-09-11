import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { 
  Upload, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Image, 
  Archive,
  Video,
  Music
} from 'lucide-react';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  onFilesRemoved?: (files: File[]) => void;
  acceptedFileTypes?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number; // in bytes
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
}

interface UploadedFile {
  file: File;
  id: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return Image;
  if (fileType.startsWith('video/')) return Video;
  if (fileType.startsWith('audio/')) return Music;
  if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('tar')) return Archive;
  return FileText;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function FileUpload({
  onFilesSelected,
  onFilesRemoved,
  acceptedFileTypes = {
    'All Files': ['*']
  },
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB default
  className,
  disabled = false,
  multiple = true
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      // Handle rejected files
      const errors = rejectedFiles.map(({ file, errors }) => ({
        file,
        errors: errors.map((e: any) => e.message).join(', ')
      }));
      
      // You could show these errors to the user
      console.warn('Rejected files:', errors);
    }

    if (acceptedFiles.length > 0) {
      const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        status: 'completed',
        progress: 100
      }));

      setUploadedFiles(prev => [...prev, ...newFiles]);
      onFilesSelected(acceptedFiles);
    }
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles,
    maxSize,
    disabled,
    multiple,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  });

  const removeFile = (fileId: string) => {
    const fileToRemove = uploadedFiles.find(f => f.id === fileId);
    if (fileToRemove) {
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      if (onFilesRemoved) {
        onFilesRemoved([fileToRemove.file]);
      }
    }
  };

  const clearAllFiles = () => {
    if (onFilesRemoved) {
      onFilesRemoved(uploadedFiles.map(f => f.file));
    }
    setUploadedFiles([]);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Card 
        {...getRootProps()} 
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragActive || dragActive 
            ? "border-primary bg-primary/5" 
            : "border-muted-foreground/25 hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isDragActive ? "Drop files here" : "Drag & drop files here"}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to select files
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Max file size: {formatFileSize(maxSize)}</p>
              <p>Max files: {maxFiles}</p>
              {Object.entries(acceptedFileTypes).map(([label, types]) => (
                <p key={label}>
                  {label}: {types.join(', ')}
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Uploaded Files ({uploadedFiles.length})</h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAllFiles}
              className="text-destructive hover:text-destructive"
            >
              Clear All
            </Button>
          </div>
          
          <div className="space-y-2">
            {uploadedFiles.map((uploadedFile) => {
              const FileIcon = getFileIcon(uploadedFile.file.type);
              const isError = uploadedFile.status === 'error';
              const isCompleted = uploadedFile.status === 'completed';
              
              return (
                <Card key={uploadedFile.id} className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <FileIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {uploadedFile.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>
                      
                      {uploadedFile.status === 'uploading' && (
                        <div className="mt-2">
                          <Progress value={uploadedFile.progress} className="h-1" />
                        </div>
                      )}
                      
                      {isError && uploadedFile.error && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            {uploadedFile.error}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isCompleted && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {isError && (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadedFile.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Specialized file upload components for different tool types
export function HashFileUpload({ onFilesSelected, ...props }: Omit<FileUploadProps, 'acceptedFileTypes'>) {
  return (
    <FileUpload
      {...props}
      acceptedFileTypes={{
        'Hash Files': ['.txt', '.hash', '.md5', '.sha1', '.sha256'],
        'Text Files': ['.txt']
      }}
      onFilesSelected={onFilesSelected}
    />
  );
}

export function WordlistUpload({ onFilesSelected, ...props }: Omit<FileUploadProps, 'acceptedFileTypes'>) {
  return (
    <FileUpload
      {...props}
      acceptedFileTypes={{
        'Wordlist Files': ['.txt', '.wordlist', '.dict'],
        'Text Files': ['.txt']
      }}
      onFilesSelected={onFilesSelected}
    />
  );
}

export function MalwareUpload({ onFilesSelected, ...props }: Omit<FileUploadProps, 'acceptedFileTypes'>) {
  return (
    <FileUpload
      {...props}
      acceptedFileTypes={{
        'Executable Files': ['.exe', '.dll', '.bin'],
        'Archive Files': ['.zip', '.rar', '.7z', '.tar', '.gz'],
        'All Files': ['*']
      }}
      onFilesSelected={onFilesSelected}
    />
  );
}

export function EvidenceUpload({ onFilesSelected, ...props }: Omit<FileUploadProps, 'acceptedFileTypes'>) {
  return (
    <FileUpload
      {...props}
      acceptedFileTypes={{
        'Disk Images': ['.img', '.dd', '.raw', '.vmdk', '.vhd'],
        'Memory Dumps': ['.dmp', '.mem', '.hiberfil'],
        'Log Files': ['.log', '.evt', '.evtx'],
        'Archive Files': ['.zip', '.rar', '.7z', '.tar', '.gz'],
        'All Files': ['*']
      }}
      onFilesSelected={onFilesSelected}
    />
  );
}
