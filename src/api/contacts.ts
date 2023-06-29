import { matchSorter } from "match-sorter";
import localforage from "localforage";
import sortBy from "sort-by";

import { Contact } from "../types/contact";

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key = "") {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise((res) => {
    setTimeout(res, Math.random() * 800);
  });
}

function set(contacts: Contact[]) {
  return localforage.setItem("contacts", contacts);
}

export async function getContacts(query = "") {
  await fakeNetwork(`getContacts:${query}`);
  let contacts: Contact[] = await localforage.getItem("contacts");

  if (!contacts) {
    contacts = [];
  }

  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}

export async function getContact(id: string) {
  await fakeNetwork(`contact:${id}`);
  let contacts: Contact[] = await localforage.getItem("contacts");
  let contact = contacts?.find((contact) => contact.id === id);
  return contact ?? null;
}

export async function createContact() {
  await fakeNetwork();
  let id = Math.random().toString(36).substring(2, 9);
  let contact = { id, createdAt: Date.now() } as Contact;
  let contacts: Contact[] = await getContacts();
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

export async function updateContact(id: string, updates: { [k: string]: any }) {
  await fakeNetwork();
  let contacts: Contact[] = await localforage.getItem("contacts");
  let contact = contacts?.find((contact) => contact.id === id);

  if (!contact) {
    throw new Error("No contact found for" + id);
  }

  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}

export async function deleteContact(id: string) {
  let contacts: Contact[] = await localforage.getItem("contacts");
  let index = contacts?.findIndex((contact) => contact.id === id) || -1;

  if (index > -1) {
    contacts!.splice(index, 1);
    await set(contacts);
    return true;
  }

  return false;
}
