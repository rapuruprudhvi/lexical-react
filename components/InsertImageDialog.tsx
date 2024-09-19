"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface InsertImageDialogProps {
  onClose: () => void;
  onInsert: (payload: { urls: string[] }) => void; // Handle multiple URLs
}

export function InsertImageDialog({ onClose, onInsert }: InsertImageDialogProps) {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageURLs, setImageURLs] = useState<string[]>([]);

  // Handle file selection and convert to URLs
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const urls = files.map(file => URL.createObjectURL(file));
    setImageFiles(files);
    setImageURLs(urls);
  };

  const handleInsert = () => {
    if (imageFiles.length > 0) {
      // Pass multiple URLs to the onInsert callback
      onInsert({ urls: imageURLs });
      onClose();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-100">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
          <DialogDescription>
            Upload one or more image files.
          </DialogDescription>
          <DialogClose onClick={onClose} />
        </DialogHeader>
        <div className="p-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            multiple
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
          {imageURLs.length > 0 && (
            <div className="mt-2">
              {imageURLs.map((url, index) => (
                <img key={index} src={url} alt={`Preview ${index}`} className="max-w-full h-auto" />
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleInsert} disabled={imageFiles.length === 0} className="mr-2">
            Insert
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
