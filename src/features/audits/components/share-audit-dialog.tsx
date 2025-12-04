import { Copy, DocumentDownload, InfoCircle } from "iconsax-reactjs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const ShareAuditDialog = ({
  children,
  ...props
}: React.ComponentProps<typeof Dialog>) => {
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-full flex-col">
        <DialogHeader>
          <DialogTitle className="text-h1" aria-describedby={undefined}>
            Share analysis findings
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1">
          <embed
            src="/mocks/audit-template.pdf"
            type="application/pdf"
            width="100%"
            height="100%"
          />
        </div>

        <DialogFooter className="flex w-full flex-row items-center justify-between gap-4 border-t bg-background/50 p-4 sm:justify-between">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <InfoCircle
              size={20}
              variant="Bold"
              className="text-muted-foreground"
            />
            <span>
              Sharing link will enable a third-party access to your analysis,
              see our{" "}
              <span className="font-medium text-foreground">Usage Policy</span>.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="glass-primary" size="sm">
              <Copy />
              Copy Link
            </Button>
            <Button size="sm">
              <DocumentDownload />
              Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
