import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image } from "lucide-react";
import { Button } from "./button";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export function FileUpload({ onFileSelect, accept = "image/*", maxSize = 5 * 1024 * 1024, className }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      setError("Invalid file type or size");
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept === "image/*" ? { 
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] 
    } : { [accept]: [] },
    maxSize,
    multiple: false,
  });

  const clearPreview = () => {
    setPreview(null);
    setError(null);
  };

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 hover:border-blue-500"
        }`}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full max-h-48 mx-auto rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                clearPreview();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-8 w-8 text-slate-400 mx-auto" />
            <p className="text-slate-600">
              {isDragActive
                ? "Drop the image here..."
                : "Drag & drop an image here, or click to select"}
            </p>
            <p className="text-sm text-slate-500">
              {accept.includes("image") ? "PNG, JPG, GIF" : "Select file"} (Max {Math.round(maxSize / 1024 / 1024)}MB)
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
