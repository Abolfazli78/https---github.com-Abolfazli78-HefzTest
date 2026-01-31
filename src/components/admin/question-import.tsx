"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface QuestionImportProps {
    onUpload: (files: File[]) => Promise<void>;
    isUploading: boolean;
    progress: number;
}

export function QuestionImport({ onUpload, isUploading, progress }: QuestionImportProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Filter for Word and Excel files
        const validFiles = acceptedFiles.filter(
            (file) =>
                file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        if (validFiles.length !== acceptedFiles.length) {
            setError("فقط فایل‌های Word (.docx) و Excel (.xlsx) پشتیبانی می‌شوند.");
        } else {
            setError(null);
        }

        setFiles(validFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
        },
        disabled: isUploading,
    });

    const handleUpload = async () => {
        if (files.length === 0) return;
        try {
            await onUpload(files);
            setFiles([]);
        } catch (_err) {
            setError("خطا در آپلود فایل‌ها. لطفا مجددا تلاش کنید.");
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div
                {...getRootProps()}
                className={cn(
                    "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all cursor-pointer",
                    isDragActive
                        ? "border-primary bg-primary/5 scale-[1.02]"
                        : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
                    isUploading && "pointer-events-none opacity-50"
                )}
            >
                <input {...getInputProps()} />
                <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                    <Upload className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">فایل‌ها را اینجا رها کنید</h3>
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                    یا کلیک کنید تا فایل‌های Word (.docx) و Excel (.xlsx) را انتخاب کنید
                </p>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>خطا</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {files.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium">فایل‌های انتخاب شده:</h4>
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className="rounded bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{file.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </span>
                                </div>
                            </div>
                            {!isUploading && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(index);
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}

                    {isUploading && (
                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>در حال پردازش...</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <Button onClick={handleUpload} disabled={isUploading} className="w-full sm:w-auto">
                            {isUploading ? "در حال آپلود..." : "آپلود و پردازش"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
