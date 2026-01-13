import React, { ChangeEvent, useRef, useState } from 'react';
import { UploadCloud, FileType } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onError: (message: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onError }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const validateAndSelect = (file: File) => {
    if (file.type === 'application/pdf') {
      onFileSelect(file);
    } else {
      onError("Invalid file type. Please upload a PDF.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative group cursor-pointer
        border border-dashed rounded-2xl p-10 md:p-12
        flex flex-col items-center justify-center text-center
        transition-all duration-300 ease-out
        ${isDragOver 
          ? 'border-neutral-500 bg-neutral-900' 
          : 'border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleChange}
        className="hidden"
      />
      
      <div className={`
        w-14 h-14 rounded-xl flex items-center justify-center mb-5
        transition-all duration-300
        ${isDragOver 
          ? 'bg-white text-black shadow-lg shadow-white/10 scale-105' 
          : 'bg-neutral-900 text-neutral-400 group-hover:text-white group-hover:bg-neutral-800'
        }
      `}>
        {isDragOver ? <FileType className="w-7 h-7" /> : <UploadCloud className="w-7 h-7" />}
      </div>

      <h3 className="text-lg font-bold text-white mb-1.5 tracking-tight">
        {isDragOver ? 'Drop PDF here' : 'Select PDF'}
      </h3>
      <p className="text-neutral-500 text-sm font-medium tracking-wide">
        Secure local processing
      </p>
    </div>
  );
};