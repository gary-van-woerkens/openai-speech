"use client";

import { useState } from "react";
import prettyBytes from "pretty-bytes";

import SpinnerIcon from "../_icons/spinner-icon";

const MultipleFileUploader = ({
  onUpload,
}: {
  onUpload: (files: FormData) => void;
}) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState<
    "initial" | "uploading" | "success" | "fail"
  >("initial");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setStatus("initial");
      setFiles(e.target.files);
    }
  };

  function handleUploadButtonClick() {
    if (files) {
      setStatus("uploading");
      const formData = new FormData();

      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });
      onUpload(formData);
    }
  }

  return (
    <>
      <div>
        <input id="file" type="file" multiple onChange={handleFileChange} />
      </div>
      {files && (
        <>
          <table>
            <caption>Files to upload to OpenAI</caption>
            <thead>
              <tr>
                <th>File name</th>
                <th>File type</th>
                <th>File size</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(files).map((file: File, index: number) => (
                <tr key={`file-to-upload-${index + 1}`}>
                  <th align="left">{file.name}</th>
                  <td>{file.type}</td>
                  <td align="right">{prettyBytes(file.size)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center py-3">
            {status === "uploading" ? (
              <div className="w-10 h-10">
                <SpinnerIcon />
              </div>
            ) : (
              <button onClick={handleUploadButtonClick}>Upload</button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default MultipleFileUploader;
