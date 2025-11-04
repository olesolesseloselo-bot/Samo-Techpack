import React, { useRef } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
    onImageUpload: (base64: string | null) => void;
    imageUrl: string | null;
    className?: string;
    aspectRatio?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imageUrl, className = '', aspectRatio = 'aspect-square' }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageUpload(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onImageUpload(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    return (
        <div 
            className={`relative w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-all group overflow-hidden ${aspectRatio} ${className}`}
            onClick={handleClick}
        >
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />
            {imageUrl ? (
                <>
                    <img src={imageUrl} alt="Uploaded preview" className="object-contain max-w-full max-h-full p-2" />
                    <button 
                        onClick={handleClear} 
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Clear image"
                    >
                        X
                    </button>
                </>
            ) : (
                <div className="text-center">
                    <UploadIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium">Click to upload</span>
                </div>
            )}
        </div>
    );
};