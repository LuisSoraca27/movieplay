import React, { useRef, useState } from 'react';
import { Button } from "@heroui/react";
import { Upload, X, FileImage, Trash2 } from 'lucide-react';

const FileUpload = ({
    onFileSelect,
    accept = "image/*",
    maxSize = 5000000,
    label = "SELECCIONAR ARCHIVO",
    showPreview = true,
    className = ""
}) => {
    const inputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > maxSize) {
            setError(`El archivo es muy grande. Máximo ${maxSize / 1000000}MB`);
            return;
        }

        setError(null);
        setSelectedFile(file);

        // Create preview for images
        if (showPreview && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }

        onFileSelect?.(file);
    };

    const handleClear = () => {
        setSelectedFile(null);
        setPreview(null);
        setError(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        onFileSelect?.(null);
    };

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
            />

            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="bordered"
                    onPress={handleClick}
                    startContent={<Upload size={16} />}
                    className="font-bold border-slate-200 text-slate-600 uppercase tracking-widest text-[10px]"
                >
                    {label}
                </Button>

                {selectedFile && (
                    <Button
                        type="button"
                        isIconOnly
                        variant="light"
                        color="danger"
                        size="sm"
                        onPress={handleClear}
                        className="text-rose-400 hover:text-rose-600 transition-colors"
                    >
                        <Trash2 size={18} />
                    </Button>
                )}
            </div>

            {selectedFile && (
                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 p-2 rounded-lg w-fit border border-slate-100">
                    <FileImage size={16} className="text-indigo-500" />
                    <span>{selectedFile.name}</span>
                </div>
            )}

            {error && (
                <p className="text-[10px] uppercase font-bold text-rose-500 tracking-wider bg-rose-50 p-2 rounded-lg">{error}</p>
            )}

            {showPreview && preview && (
                <div className="mt-2 relative group w-fit">
                    <img
                        src={preview}
                        alt="Preview"
                        className="max-w-xs max-h-32 rounded-2xl object-cover border border-slate-100 shadow-sm"
                    />
                    <div className="absolute inset-0 bg-black/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            )}
        </div>
    );
};

export default FileUpload;
