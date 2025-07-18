import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, File, Code2, Loader2, FileText, Image, Video, Music, FileType, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProcessingResultsProps {
  file: File;
  processedData: any;
  onBack: () => void;
}

const ProcessingResults = ({ file, processedData, onBack }: ProcessingResultsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Create preview for the uploaded file
    if (file) {
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        setFilePreview(imageUrl);
        
        // Cleanup URL when component unmounts
        return () => URL.revokeObjectURL(imageUrl);
      } else if (file.type.startsWith('text/') || file.type === 'application/json') {
        // For text files, read the content
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsText(file);
      } else if (file.type === 'application/pdf') {
        // For PDF files, create object URL for iframe
        const pdfUrl = URL.createObjectURL(file);
        setFilePreview(pdfUrl);
        
        // Cleanup URL when component unmounts
        return () => URL.revokeObjectURL(pdfUrl);
      }
    }
  }, [file]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleDownloadJson = () => {
    const dataStr = JSON.stringify(processedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${file.name.split('.')[0]}_processed.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "JSON file has been downloaded successfully",
    });
  };

  const getFileIcon = () => {
    if (file.type.startsWith('image/')) return <Image className="h-6 w-6" />;
    if (file.type.startsWith('video/')) return <Video className="h-6 w-6" />;
    if (file.type.startsWith('audio/')) return <Music className="h-6 w-6" />;
    if (file.type.startsWith('text/') || file.type === 'application/json') return <FileText className="h-6 w-6" />;
    if (file.type === 'application/pdf') return <FileType className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };

  const renderFilePreview = () => {
    if (file.type.startsWith('image/') && filePreview) {
      return (
        <div className="flex items-center justify-center h-full p-4">
          <img 
            src={filePreview} 
            alt="Uploaded file preview"
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg border border-border"
          />
        </div>
      );
    } else if ((file.type.startsWith('text/') || file.type === 'application/json') && filePreview) {
      return (
        <div className="p-4 h-full overflow-auto">
          <div className="bg-muted rounded-lg p-4 font-mono text-sm">
            <div className="text-muted-foreground mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Text file content:
            </div>
            <pre className="whitespace-pre-wrap text-foreground">
              {filePreview.slice(0, 2000)}{filePreview.length > 2000 ? '...\n\n[Content truncated]' : ''}
            </pre>
          </div>
        </div>
      );
    } else if (file.type === 'application/pdf' && filePreview) {
      return (
        <div className="h-full p-4">
          <div className="h-full bg-muted rounded-lg overflow-hidden border border-border">
            <iframe
              src={filePreview}
              className="w-full h-full"
              title="PDF Preview"
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
          {getFileIcon()}
          <h3 className="text-lg font-semibold mt-4 mb-2">
            {file.type === 'application/pdf' ? 'PDF Document' : 'Preview Not Available'}
          </h3>
          <div className="text-center space-y-1">
            <p className="font-medium text-foreground">{file.name}</p>
            <p className="text-sm">Type: {file.type || 'Unknown'}</p>
            <p className="text-sm">Size: {(file.size / 1024).toFixed(2)} KB</p>
            {file.type === 'application/pdf' && (
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                PDF preview should load above
              </p>
            )}
          </div>
        </div>
      );
    }
  };

  const renderTabContent = (tab: string) => {
    switch (tab) {
      case 'json':
        return (
          <div className="h-[500px] bg-slate-900 overflow-auto">
            <pre className="p-6 text-green-400 font-mono text-sm whitespace-pre-wrap leading-relaxed">
              {JSON.stringify(processedData, null, 2)}
            </pre>
          </div>
        );
      case 'raw':
        return (
          <div className="h-[500px] bg-muted/30 overflow-auto p-6">
            <div className="font-mono text-sm">
              <p className="text-muted-foreground mb-4">Raw text content extracted from the file:</p>
              <div className="bg-background p-4 rounded-lg border">
                {processedData?.results?.extractedText || "No raw text available"}
              </div>
            </div>
          </div>
        );
      case 'annotated':
        return (
          <div className="h-[500px] bg-muted/30 overflow-auto p-6">
            <div className="font-mono text-sm">
              <p className="text-muted-foreground mb-4">Annotated content with highlights:</p>
              <div className="bg-background p-4 rounded-lg border">
                <span className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">Highlighted text</span> and 
                <span className="bg-blue-200 dark:bg-blue-800 px-1 rounded ml-1">important sections</span> 
                would appear here based on analysis results.
              </div>
            </div>
          </div>
        );
      case 'entities':
        return (
          <div className="h-[500px] bg-muted/30 overflow-auto p-6">
            <div className="space-y-4">
              <p className="text-muted-foreground mb-4">Named entities and key information:</p>
              <div className="grid gap-2">
                {['Person', 'Organization', 'Location', 'Date'].map((type) => (
                  <div key={type} className="bg-background p-3 rounded-lg border">
                    <span className="font-semibold text-sm">{type}:</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {type === 'Person' ? 'John Doe, Jane Smith' : 
                       type === 'Organization' ? 'ACME Corp, Tech Solutions' :
                       type === 'Location' ? 'New York, California' :
                       '2024-01-15, 2024-02-20'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'metadata':
        return (
          <div className="h-[500px] bg-muted/30 overflow-auto p-6">
            <div className="space-y-4">
              <p className="text-muted-foreground mb-4">File metadata and processing details:</p>
              <div className="grid gap-3">
                <div className="bg-background p-3 rounded-lg border">
                  <div className="text-sm font-semibold">File Information</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Name: {file.name}<br/>
                    Size: {(file.size / 1024).toFixed(2)} KB<br/>
                    Type: {file.type}
                  </div>
                </div>
                <div className="bg-background p-3 rounded-lg border">
                  <div className="text-sm font-semibold">Processing Details</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Status: {processedData?.status}<br/>
                    Processed At: {new Date(processedData?.processedAt).toLocaleString()}<br/>
                    Version: {processedData?.results?.metadata?.version}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={onBack}
                className="flex items-center gap-2 hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Upload
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Processing Results</h1>
                <p className="text-muted-foreground mt-1">Analysis complete for your uploaded file</p>
              </div>
            </div>
            
            <Button 
              onClick={handleDownloadJson}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download JSON
            </Button>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Left Panel - File Preview */}
            <Card className="border-2 border-border/50 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  {getFileIcon()}
                  <div>
                    <div className="text-lg">Uploaded File</div>
                    <CardDescription className="mt-1">
                      {file.name} • {(file.size / 1024).toFixed(2)} KB
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[500px] bg-muted/30 border-t border-border">
                  {renderFilePreview()}
                </div>
              </CardContent>
            </Card>

            {/* Right Panel - Tabbed Analysis Results */}
            <Card className="border-2 border-border/50 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <Code2 className="h-6 w-6" />
                    <div>
                      <div className="text-lg">Analysis Results</div>
                      <CardDescription className="mt-1">
                        Comprehensive processing results and insights
                      </CardDescription>
                    </div>
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="hover:bg-muted"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Refresh'
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border-t border-border">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-[500px] bg-muted/30">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-muted-foreground">Loading analysis results...</p>
                      </div>
                    </div>
                  ) : (
                    <Tabs defaultValue="json" className="w-full">
                      <TabsList className="grid w-full grid-cols-5 rounded-none border-b">
                        <TabsTrigger value="json" className="text-xs">JSON</TabsTrigger>
                        <TabsTrigger value="raw" className="text-xs">Raw Text</TabsTrigger>
                        <TabsTrigger value="annotated" className="text-xs">Annotated</TabsTrigger>
                        <TabsTrigger value="entities" className="text-xs">Entities</TabsTrigger>
                        <TabsTrigger value="metadata" className="text-xs">Metadata</TabsTrigger>
                      </TabsList>
                      {['json', 'raw', 'annotated', 'entities', 'metadata'].map((tab) => (
                        <TabsContent key={tab} value={tab} className="mt-0">
                          {renderTabContent(tab)}
                        </TabsContent>
                      ))}
                    </Tabs>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950 dark:to-blue-900 dark:border-blue-800">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {processedData?.results?.totalLines || 0}
                </div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Lines</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-950 dark:to-green-900 dark:border-green-800">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {processedData?.results?.wordCount || 0}
                </div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Word Count</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-950 dark:to-purple-900 dark:border-purple-800">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {processedData?.results?.characterCount || 0}
                </div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Characters</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-950 dark:to-orange-900 dark:border-orange-800">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  {processedData?.status === 'success' ? '✓' : '✗'}
                </div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Status</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingResults;
