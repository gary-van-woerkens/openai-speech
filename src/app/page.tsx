"use client";

import { chat } from "@/app/actions";
import { useFormState, useFormStatus } from "react-dom";

const initialState = { message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" aria-disabled={pending}>
      Send
    </button>
  );
}

export default function Page() {
  const [state, formAction] = useFormState(chat, initialState);

  return (
    <form action={formAction}>
      <input type="text" name="todo" required placeholder="say something..." />
      <SubmitButton />
      <p aria-live="polite" className="sr-only">
        {state?.message}
      </p>
    </form>
  );
}
