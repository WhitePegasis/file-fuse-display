
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/FileUpload';
import ProcessingResults from '@/components/ProcessingResults';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setProcessedData(null);
    setShowResults(false);
    toast({
      title: "File uploaded successfully",
      description: `${file.name} is ready for processing`,
    });
  };

  const handleProcess = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    
    // Simulate API call with delay
    setTimeout(() => {
      const mockApiResponse = {
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        processedAt: new Date().toISOString(),
        status: "success",
        results: {
          totalLines: Math.floor(Math.random() * 1000) + 100,
          wordCount: Math.floor(Math.random() * 5000) + 500,
          characterCount: Math.floor(Math.random() * 20000) + 2000,
          encoding: "UTF-8",
          language: "English",
          sentiment: "Neutral",
          keywords: ["analysis", "processing", "data", "content", "file"],
          metadata: {
            created: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            modified: new Date().toISOString(),
            version: "1.0"
          }
        }
      };

      setProcessedData(mockApiResponse);
      setIsProcessing(false);
      setShowResults(true);
      
      toast({
        title: "Processing completed",
        description: "Your file has been successfully processed",
      });
    }, 2000);
  };

  if (showResults) {
    return (
      <ProcessingResults 
        file={selectedFile!} 
        processedData={processedData} 
        onBack={() => setShowResults(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">File Processor</h1>
          <p className="text-xl text-slate-600">Upload your files and process them with our advanced API</p>
        </div>

        <div className="grid gap-6">
          <FileUpload onFileSelect={handleFileSelect} />
          
          {selectedFile && (
            <Card className="border-2 border-dashed border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Selected File
                </CardTitle>
                <CardDescription>Ready for processing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{selectedFile.name}</p>
                    <p className="text-sm text-slate-500">
                      {(selectedFile.size / 1024).toFixed(2)} KB • {selectedFile.type || 'Unknown type'}
                    </p>
                  </div>
                  <Button 
                    onClick={handleProcess} 
                    disabled={isProcessing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Process File
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
