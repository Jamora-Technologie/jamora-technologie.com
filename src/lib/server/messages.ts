import "server-only";
import { randomUUID } from "node:crypto";
import { readCollection, updateCollection } from "@/lib/server/store";

/**
 * Demandes reçues par le formulaire de contact.
 *
 * La demande est enregistrée AVANT toute tentative d'alerte e-mail : si le
 * serveur SMTP est en panne ou mal configuré, rien n'est perdu, et le
 * back-office signale simplement que l'alerte n'a pas pu partir.
 */

export type MessageStatus = "new" | "read" | "archived";

/** `disabled` : SMTP non configuré. `failed` : l'envoi a échoué. */
export type NotifyState = "sent" | "failed" | "disabled";

export type Message = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  status: MessageStatus;
  notified: NotifyState;
  notifyError?: string;
};

const FILE = "messages.json";

export type NewMessage = Pick<
  Message,
  "name" | "email" | "company" | "subject" | "message"
>;

export async function addMessage(input: NewMessage): Promise<Message> {
  const entry: Message = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
    status: "new",
    notified: "disabled",
  };
  await updateCollection<Message[]>(FILE, [], (all) => ({
    /* Les plus récentes d'abord : c'est l'ordre d'affichage. */
    next: [entry, ...all],
    result: undefined,
  }));
  return entry;
}

export function listMessages(): Promise<Message[]> {
  return readCollection<Message[]>(FILE, []);
}

export async function getMessage(id: string): Promise<Message | null> {
  const all = await listMessages();
  return all.find((m) => m.id === id) ?? null;
}

export async function countNew(): Promise<number> {
  const all = await listMessages();
  return all.filter((m) => m.status === "new").length;
}

export function setStatus(id: string, status: MessageStatus): Promise<boolean> {
  return updateCollection<Message[], boolean>(FILE, [], (all) => {
    const found = all.some((m) => m.id === id);
    return {
      next: all.map((m) => (m.id === id ? { ...m, status } : m)),
      result: found,
    };
  });
}

export function setNotified(
  id: string,
  notified: NotifyState,
  notifyError?: string,
): Promise<void> {
  return updateCollection<Message[]>(FILE, [], (all) => ({
    next: all.map((m) =>
      m.id === id ? { ...m, notified, notifyError } : m,
    ),
    result: undefined,
  }));
}

export function deleteMessage(id: string): Promise<boolean> {
  return updateCollection<Message[], boolean>(FILE, [], (all) => ({
    next: all.filter((m) => m.id !== id),
    result: all.some((m) => m.id === id),
  }));
}
