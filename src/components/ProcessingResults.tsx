
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, File, Code2, Loader2 } from 'lucide-react';

interface ProcessingResultsProps {
  file: File;
  processedData: any;
  onBack: () => void;
}

const ProcessingResults = ({ file, processedData, onBack }: ProcessingResultsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading state for demonstration
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-slate-900">Processing Results</h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
            {/* Left Panel - File Preview */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <File className="h-5 w-5" />
                  Uploaded File
                </CardTitle>
                <CardDescription>
                  {file.name} • {(file.size / 1024).toFixed(2)} KB
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <div className="h-full bg-slate-50 rounded-lg p-4 overflow-auto">
                  {file.type.startsWith('image/') ? (
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="Uploaded file"
                      className="max-w-full h-auto rounded-lg shadow-sm"
                    />
                  ) : file.type.startsWith('text/') ? (
                    <div className="font-mono text-sm text-slate-700">
                      <p className="text-slate-500 mb-2">Text file preview:</p>
                      <div className="bg-white p-3 rounded border">
                        {/* This would normally show actual file content */}
                        <p>File content would be displayed here...</p>
                        <p>Type: {file.type}</p>
                        <p>Size: {file.size} bytes</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                      <File className="h-16 w-16 mb-4" />
                      <p className="text-lg font-medium mb-2">File Preview Not Available</p>
                      <p className="text-sm text-center">
                        This file type cannot be previewed.<br />
                        File: {file.name}<br />
                        Type: {file.type || 'Unknown'}<br />
                        Size: {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Right Panel - API Response */}
            <Card className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="h-5 w-5" />
                      API Response
                    </CardTitle>
                    <CardDescription>
                      Processing results from the API
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefresh}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Refresh'
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <div className="h-full">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                        <p className="text-slate-600">Loading API response...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full bg-slate-900 rounded-lg p-4 overflow-auto">
                      <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                        {JSON.stringify(processedData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {processedData?.results?.totalLines || 0}
                </div>
                <p className="text-sm text-slate-600">Total Lines</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {processedData?.results?.wordCount || 0}
                </div>
                <p className="text-sm text-slate-600">Word Count</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {processedData?.results?.characterCount || 0}
                </div>
                <p className="text-sm text-slate-600">Characters</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {processedData?.status === 'success' ? '✓' : '✗'}
                </div>
                <p className="text-sm text-slate-600">Status</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingResults;
