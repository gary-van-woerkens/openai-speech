import OpenAI from "openai";

import { revalidatePath } from "next/cache";
import { format, fromUnixTime } from "date-fns";
import { type FileObject } from "openai/resources/files.mjs";

import "./styles.css";

const openai = new OpenAI();

async function createAssistant(
  name: string,
  description: string,
  instructions: string,
  file_ids: string[],
) {
  await openai.beta.assistants.create({
    name,
    file_ids,
    description,
    instructions,
    model: "gpt-3.5-turbo-1106",
    tools: [{ type: "retrieval" }],
  });
}

async function handleSubmit(formData: FormData) {
  "use server";

  const list = await openai.files.list();

  await createAssistant(
    formData.get("name") as string,
    formData.get("description") as string,
    formData.get("instructions") as string,
    list.getPaginatedItems().map((file: FileObject) => file.id),
  );

  revalidatePath("/assistants");
}

export default async function Page() {
  const assistants = await openai.beta.assistants.list({
    limit: 20,
    order: "desc",
  });

  return (
    <div className="container mx-auto">
      <h1>Assistants Manager</h1>
      <form action={handleSubmit} className="flex-col flex gap-y-3">
        <input name="name" placeholder="Name" />
        <input name="description" placeholder="Description" />
        <textarea name="instructions" placeholder="Instructions"></textarea>
        <div className="flex justify-center">
          <button type="submit">Create Assistant</button>
        </div>
      </form>
      <table>
        <caption>List of all OpenAI assistants</caption>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Instructions</th>
            <th>Model</th>
            <th>Files</th>
            {/* <th>ID</th> */}
            <th>Creation Date</th>
          </tr>
        </thead>
        <tbody>
          {assistants.getPaginatedItems().map((assistant) => (
            <tr key={assistant.id}>
              <th>{assistant.name}</th>
              <td>{assistant.description}</td>
              <td>{assistant.instructions}</td>
              <td>{assistant.model}</td>
              <td>{assistant.file_ids.join(" ")}</td>
              {/* <td>{assistant.id}</td> */}
              <td>{format(fromUnixTime(assistant.created_at), "P")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
