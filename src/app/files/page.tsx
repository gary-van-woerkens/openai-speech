import OpenAI from "openai";
import { revalidatePath } from "next/cache";

import FileList from "./_components/file-list";
import MultipleFileUploader from "./_components/file-upload";

import "./styles.css";

const openai = new OpenAI(); // WTF, no authentication required?

function uploadFile(file: File) {
  return openai.files.create({ file: file, purpose: "assistants" });
}

async function handleUpload(data: FormData) {
  "use server";

  const files = data.getAll("files") as File[];
  const promises = files.map((file) => uploadFile(file));

  await Promise.all(promises);
  revalidatePath("/files");
}

async function handleDeletion(id: string) {
  "use server";

  await openai.files.del(id);
  revalidatePath("/files");
}

export default async function Page() {
  const files = await openai.files.list();

  return (
    <div className="container mx-auto">
      <h1>File Manager</h1>
      <MultipleFileUploader onUpload={handleUpload} />
      <FileList files={files.getPaginatedItems()} onDelete={handleDeletion} />
    </div>
  );
}
