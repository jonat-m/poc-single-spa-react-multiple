import { Form, useFetcher, useLoaderData } from "react-router-dom";

import { getContact, updateContact } from "../api/contacts";
import { Contact as ContactType } from "../types/contact";

type ObjectContact = { contact: ContactType };
type ActionType = {
  request: Request;
  params: { [key: string]: string };
};

export async function action({ request, params }: ActionType) {
  let formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

export async function loader({ params }) {
  const contact = await getContact(params.contactId);
  return { contact };
}

function Favorite({ contact }) {
  let favorite = contact.favorite;
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}

export default function Contact() {
  const { contact } = useLoaderData() as ObjectContact;
  if (!contact) {
    return <div />;
  }

  return (
    <div id="contact">
      <div>
        <img key={contact.avatar_url} src={contact.avatar_url || null} />
      </div>

      <div>
        <h1>
          {contact.first_name || contact.last_name ? (
            <>
              {contact.first_name} {contact.last_name}
            </>
          ) : (
            <i>No Name</i>
          )}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}
