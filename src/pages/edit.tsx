import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";

import { updateContact } from "../api/contacts";
import { Contact } from "../types/contact";

type ActionType = {
  request: Request;
  params: any;
};

export async function action({ request, params }: ActionType) {
  const formData = await request.formData();
  const updates = formData.entries();

  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact() {
  const { contact } = useLoaderData() as { contact: Contact };
  const navigate = useNavigate();

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first_name"
          defaultValue={contact.first_name}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last_name"
          defaultValue={contact.last_name}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact.avatar_url}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="notes" defaultValue={contact.notes} rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </button>
      </p>
    </Form>
  );
}
