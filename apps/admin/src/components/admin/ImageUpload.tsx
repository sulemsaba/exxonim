import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { uploadMediaFile } from "../../services/adminMediaService";
import { getAdminErrorMessage } from "../../utils/admin";
import type { ApiMedia } from "../../types/api";

interface ImageUploadProps {
  onUploaded: (media: ApiMedia) => void;
}

export function ImageUpload({ onUploaded }: ImageUploadProps) {
  const [altText, setAltText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: ({ file, altText }: { file: File; altText?: string }) =>
      uploadMediaFile(file, altText),
    onSuccess: (media) => {
      setErrorMessage(null);
      onUploaded(media);
    },
    onError: (error) => {
      setErrorMessage(
        getAdminErrorMessage(error, "Unable to upload the selected file.")
      );
    },
  });

  function validateFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please choose an image file.");
      return false;
    }

    if (file.size > 4 * 1024 * 1024) {
      setErrorMessage("Please choose an image smaller than 4 MB.");
      return false;
    }

    setErrorMessage(null);
    return true;
  }

  function submitFile(file: File) {
    if (!validateFile(file)) {
      return;
    }

    uploadMutation.mutate({ file, altText });
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    submitFile(file);
    event.target.value = "";
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!isDragging) {
      setIsDragging(true);
    }
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }

    setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) {
      return;
    }

    submitFile(file);
  }

  function triggerFilePicker() {
    inputRef.current?.click();
  }

  return (
    <div className="admin-upload">
      <div
        className={`admin-upload__dropzone${isDragging ? " is-dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          className="admin-upload__input"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
        />
        <strong>Drop image here</strong>
        <p>Select from device or drag and drop directly into the editor.</p>
        <div className="admin-upload__actions">
          <button
            className="admin-secondary-button"
            type="button"
            disabled={uploadMutation.isPending}
            onClick={triggerFilePicker}
          >
            Select from device
          </button>
        </div>
      </div>

      <div className="admin-form__field">
        <span>Alt text for uploaded file</span>
        <input
          type="text"
          placeholder="Describe the image for accessibility"
          value={altText}
          onChange={(event) => setAltText(event.target.value)}
        />
      </div>

      <div className="admin-upload__row">
        <span className="admin-upload__status">
          {uploadMutation.isPending
            ? "Uploading image..."
            : "Recommended 1600 x 900 px - JPG / PNG / WebP - up to 4 MB."}
        </span>
      </div>

      {errorMessage ? <p className="admin-form__error">{errorMessage}</p> : null}
    </div>
  );
}
