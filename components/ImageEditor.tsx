
import React, { useState, useCallback } from 'react';
import { editImageWithGemini } from '../services/geminiService';
import { UploadIcon, SparklesIcon } from './Icons';

export const ImageEditor: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setOriginalImage(file);
            setOriginalImageUrl(URL.createObjectURL(file));
            setEditedImageUrl(null);
            setError(null);
        }
    };

    const handleSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        if (!originalImage || !prompt) {
            setError("Please upload an image and enter a prompt.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setEditedImageUrl(null);

        try {
            const result = await editImageWithGemini(originalImage, prompt);
            setEditedImageUrl(result);
        } catch (err) {
            setError("Failed to edit image. Please check the console for details.");
        } finally {
            setIsLoading(false);
        }
    }, [originalImage, prompt]);
    
    const examplePrompts = ["Add a retro filter", "Make the background blurry", "Change the color to blue", "Add sunglasses to the person"];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">AI Image Editor</h2>
                <p className="text-gray-600 mb-6">Use text prompts to edit your images with Gemini AI.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input Area */}
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                        {originalImageUrl ? (
                            <img src={originalImageUrl} alt="Original" className="max-h-80 w-auto rounded-md shadow-md" />
                        ) : (
                            <div className="text-center text-gray-500">
                                <UploadIcon className="mx-auto h-12 w-12" />
                                <p className="mt-2">Upload an image to start</p>
                            </div>
                        )}
                        <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        <label htmlFor="image-upload" className="mt-4 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors">
                            {originalImage ? 'Change Image' : 'Upload Image'}
                        </label>
                    </div>

                    {/* Output Area */}
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                        {isLoading ? (
                           <div className="flex flex-col items-center text-blue-600">
                               <SparklesIcon className="h-12 w-12 animate-pulse" />
                               <p className="mt-4 font-semibold">Generating your image...</p>
                           </div>
                        ) : editedImageUrl ? (
                            <img src={editedImageUrl} alt="Edited" className="max-h-80 w-auto rounded-md shadow-md" />
                        ) : (
                            <div className="text-center text-gray-500">
                                 <SparklesIcon className="mx-auto h-12 w-12" />
                                <p className="mt-2">Your edited image will appear here</p>
                            </div>
                        )}
                         {editedImageUrl && !isLoading && (
                            <a href={editedImageUrl} download="edited-image.png" className="mt-4 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                                Download Image
                            </a>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-8">
                    <label htmlFor="prompt" className="block text-lg font-medium text-gray-700">
                        Editing Prompt
                    </label>
                    <textarea
                        id="prompt"
                        rows={3}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., Add a retro filter"
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3"
                        disabled={!originalImage || isLoading}
                    />
                     <div className="mt-2 flex flex-wrap gap-2">
                        {examplePrompts.map(p => (
                            <button key={p} type="button" onClick={() => setPrompt(p)} disabled={!originalImage || isLoading} className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-200 disabled:opacity-50">
                                {p}
                            </button>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={!originalImage || !prompt || isLoading}
                        className="mt-6 w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        <SparklesIcon className="w-6 h-6 mr-2" />
                        {isLoading ? 'Generating...' : 'Generate with AI'}
                    </button>

                    {error && <p className="mt-4 text-center text-red-600">{error}</p>}
                </form>
            </div>
        </div>
    );
};
