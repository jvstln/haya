import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAudit, useAudits } from "../audits/audit.hook";
import { createCanvaStore } from "./canva.store";
import type { CanvaSection } from "./canva.type";

export const useCanvaEditor = (auditId?: string) => {
  // Fetch the specific audit content
  const audit = useAudit(auditId ?? "");

  const searchParams = useSearchParams();
  const pageUrl = searchParams.get("pageUrl");

  const [store] = useState(() => createCanvaStore());

  useEffect(() => {
    if (audit.data) {
      store.getState().actions.hydrate({
        audit: audit.data,
        pageUrl: pageUrl ?? "",
      });
    }
  }, [audit.data, store, pageUrl]);

  const isPending = !!auditId && audit.isPending;
  const error = audit.error;

  return {
    auditQuery: audit,
    isPending,
    error,
    isError: !!error,
    editor: store,
  };
};
