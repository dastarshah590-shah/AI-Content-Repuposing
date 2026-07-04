import { FileAudio, UploadCloud } from "lucide-react";
import { useState } from "react";
import { transcribeMedia, uploadMedia } from "../services/api.js";

export function MediaTranscriptionPanel({ projectId, onTranscript, onUsage, onToast }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [isWorking, setIsWorking] = useState(false);

  async function handleTranscribe() {
    if (!file) return;
    setIsWorking(true);
    setStatus("Uploading media...");
    try {
      const uploaded = await uploadMedia({ file, projectId });
      setStatus("Transcribing...");
      const transcript = await transcribeMedia(uploaded.fileId);
      onUsage?.(transcript.usage);
      onTranscript(transcript.transcript, uploaded.fileName);
      setStatus("Transcript added to source.");
      onToast("Transcript added.");
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <section className="panel media-panel" aria-labelledby="media-heading">
      <div className="section-heading">
        <div>
          <p className="step-label">Media</p>
          <h2 id="media-heading">Transcribe audio/video</h2>
        </div>
        <FileAudio size={20} />
      </div>
      <label className="media-drop">
        <UploadCloud size={22} />
        <span>{file ? file.name : "Choose MP3, WAV, M4A, MP4, or MOV"}</span>
        <input
          type="file"
          accept="audio/*,video/*"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
      </label>
      <button
        className="secondary-button full-button"
        type="button"
        onClick={handleTranscribe}
        disabled={!file || isWorking}
      >
        <UploadCloud size={16} />
        <span>{isWorking ? "Working" : "Upload and transcribe"}</span>
      </button>
      {status && <p className="muted-copy">{status}</p>}
    </section>
  );
}