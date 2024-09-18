// InsertImageDialog.tsx
import React, { useState } from 'react';

export interface InsertImageDialogProps {
  onClose: () => void;
  onInsert: (payload: { url: string }) => void;
}

export const InsertImageDialog: React.FC<InsertImageDialogProps> = ({ onClose, onInsert }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleInsert = () => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        onInsert({ url }); // Pass URL here
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="dialog fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 w-full mb-2"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={handleInsert} className="bg-blue-500 text-white px-4 py-2 rounded" disabled={!file}>
            Insert
          </button>
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
