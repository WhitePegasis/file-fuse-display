
import { useCallback, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, File, Cloud } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-all duration-200 shadow-lg">
      <CardHeader className="text-center pb-2">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl">
          <div className="p-2 rounded-lg bg-primary/10">
            <Cloud className="h-6 w-6 text-primary" />
          </div>
          Upload Your File
        </CardTitle>
        <CardDescription className="text-base">
          Drag and drop your file here, or click to browse from your device
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8">
        <div
          className={`relative p-12 rounded-xl border-2 border-dashed transition-all duration-300 ${
            isDragOver 
              ? 'border-primary bg-primary/5 scale-[1.02]' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/40 hover:bg-muted/20'
          }`}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center space-y-6">
            <div className={`transition-all duration-300 ${isDragOver ? 'scale-110' : ''}`}>
              <File className={`mx-auto h-16 w-16 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            
            <div className="space-y-2">
              <p className={`text-lg font-medium ${isDragOver ? 'text-primary' : 'text-foreground'}`}>
                {isDragOver ? 'Drop your file here' : 'Choose a file to upload'}
              </p>
              <p className="text-muted-foreground">
                Supports all file formats • Maximum file size: 50MB
              </p>
            </div>
            
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileInput}
              accept="*/*"
            />
            <Button 
              asChild 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 h-auto text-base"
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mr-2 h-5 w-5" />
                Browse Files
              </label>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
