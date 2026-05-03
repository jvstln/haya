import { PDFDownloadLink } from "@react-pdf/renderer";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import {
  Copy,
  DocumentDownload,
  InfoCircle,
  TickCircle,
} from "iconsax-reactjs";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "@workspace/ui/components/sonner";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { HayaSpinner } from "@workspace/ui/components/spinner";
import type { ParsedAudit } from "../audit.type";
import { AuditPdfDocument } from "./audit-pdf-document";

// Dynamic import for PDFViewer to avoid SSR issues and show loading spinner
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex size-full items-center justify-center">
        <HayaSpinner />
      </div>
    ),
  },
);

export const ShareAuditDialog = ({
  children,
  audit,
  ...props
}: React.ComponentProps<typeof Dialog> & { audit: ParsedAudit }) => {
  const [_, copyToClipboard] = useCopyToClipboard();

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(window.location.href);
    toast.success("Link copied to clipboard");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-full flex-col">
        <DialogHeader>
          <DialogTitle className="text-h1" aria-describedby={undefined}>
            Share audit findings
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1">
          <PDFViewer className="size-full" width="100%" height="100%">
            <AuditPdfDocument audit={audit} />
          </PDFViewer>
        </div>

        <DialogFooter className="flex w-full flex-row items-center justify-between gap-4 border-t bg-background/50 p-4 sm:justify-between">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <InfoCircle
              size={20}
              variant="Bold"
              className="text-muted-foreground"
            />
            <span>
              Sharing link will enable a third-party access to your audit, see
              our{" "}
              <span className="font-medium text-foreground">Usage Policy</span>.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button appearance="soft" size="sm" onClick={handleCopy}>
              {isCopied ? <TickCircle /> : <Copy />}
              {isCopied ? "Copied" : "Copy Link"}
            </Button>
            <PDFDownloadLink
              document={<AuditPdfDocument audit={audit} />}
              fileName={`haya-audit-${audit.url}.pdf`}
            >
              <Button size="sm">
                <DocumentDownload />
                Download
              </Button>
            </PDFDownloadLink>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
