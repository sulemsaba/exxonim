import { useState } from "react";
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

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    uploadMutation.mutate({ file, altText });
    event.target.value = "";
  }

  return (
    <div className="admin-upload">
      <div className="admin-form__field">
        <span>Upload image</span>
        <input type="file" accept="image/*" onChange={handleFileChange} />
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
            : "Supported: local image uploads to the backend media library."}
        </span>
      </div>

      {errorMessage ? <p className="admin-form__error">{errorMessage}</p> : null}
    </div>
  );
}
