"use client";

import { useState } from "react";
import prettyBytes from "pretty-bytes";
import { format, fromUnixTime } from "date-fns";
import { type FileObject } from "openai/resources/files.mjs";

import TrashIcon from "../_icons/trash-icon";
import SpinnerIcon from "../_icons/spinner-icon";

export default function FileList({
  files,
  onDelete,
}: {
  files: FileObject[];
  onDelete: (id: string) => void;
}) {
  const [isLoading, setIsLoading] = useState("");

  function handleClick(id: string) {
    setIsLoading(id);
    onDelete(id);
  }

  return (
    <table>
      <caption>All files uploaded to OpenAI Files API</caption>
      <thead>
        <tr>
          <th>File name</th>
          <th>ID</th>
          <th>File size</th>
          <th>Upload date</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file: FileObject) => (
          <tr key={file.id}>
            <th align="left">{file.filename}</th>
            <td style={{ whiteSpace: "nowrap" }}>{file.id}</td>
            <td align="right">{prettyBytes(file.bytes)}</td>
            <td align="right">{format(fromUnixTime(file.created_at), "P")}</td>
            <td align="center">
              <button onClick={() => handleClick(file.id)}>
                {isLoading === file.id ? <SpinnerIcon /> : <TrashIcon />}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
