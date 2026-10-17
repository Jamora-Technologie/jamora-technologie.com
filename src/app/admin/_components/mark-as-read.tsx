"use client";

import { useEffect, useTransition } from "react";
import { changeStatus } from "@/app/admin/actions";

/**
 * Passe la demande en « lue » à l'ouverture de sa fiche.
 *
 * Une action serveur ne peut pas être déclenchée pendant le rendu : on la
 * lance depuis un effet. La page ne monte ce composant que si la demande est
 * encore « nouvelle », donc l'effet ne se rejoue pas après la mise à jour.
 */
export function MarkAsRead({ id }: { id: string }) {
  const [, startTransition] = useTransition();

  useEffect(() => {
    const data = new FormData();
    data.set("id", id);
    data.set("status", "read");
    startTransition(() => {
      void changeStatus(data);
    });
  }, [id]);

  return null;
}
