import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Loader2, Sparkles, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
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
      <Layout activeItem="processing">
        <ProcessingResults 
          file={selectedFile!} 
          processedData={processedData} 
          onBack={() => setShowResults(false)}
        />
      </Layout>
    );
  }

  return (
    <Layout activeItem="processing">
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
              File Processor
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Upload your files and process them with our advanced API. Get detailed analysis, metadata, and insights in seconds.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* File Upload Section */}
            <FileUpload onFileSelect={handleFileSelect} />
            
            {/* Selected File Card */}
            {selectedFile && (
              <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-lg">File Selected</div>
                      <CardDescription className="text-base">Ready for processing</CardDescription>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-6 bg-card rounded-lg border border-border/50">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground text-lg">{selectedFile.name}</p>
                      <p className="text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(2)} KB • {selectedFile.type || 'Unknown type'}
                      </p>
                    </div>
                    <Button 
                      onClick={handleProcess} 
                      disabled={isProcessing}
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 h-auto"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-5 w-5" />
                          Process File
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features Section */}
            {!selectedFile && (
              <div className="grid md:grid-cols-3 gap-6 mt-16">
                <Card className="text-center p-6 border-border/50 hover:border-primary/30 transition-colors">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 w-fit mx-auto mb-4">
                    <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Easy Upload</h3>
                  <p className="text-sm text-muted-foreground">Drag and drop or click to upload any file format</p>
                </Card>
                
                <Card className="text-center p-6 border-border/50 hover:border-primary/30 transition-colors">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 w-fit mx-auto mb-4">
                    <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Fast Processing</h3>
                  <p className="text-sm text-muted-foreground">Advanced API processing with real-time results</p>
                </Card>
                
                <Card className="text-center p-6 border-border/50 hover:border-primary/30 transition-colors">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 w-fit mx-auto mb-4">
                    <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Detailed Analysis</h3>
                  <p className="text-sm text-muted-foreground">Get comprehensive insights and metadata</p>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
