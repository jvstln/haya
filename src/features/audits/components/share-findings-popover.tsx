import { Check } from "lucide-react";
import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useCopyToClipboard } from "@/hooks/use-clipboard";
import { useUpdateAuditShareStatus } from "../audit.hook";
import type { Audit } from "../audit.type";

export const ShareFindingsPopover = ({
  audit,
  children,
}: {
  audit?: Audit;
  children?: ReactElement;
}) => {
  const updateAuditShareStatus = useUpdateAuditShareStatus();

  const { copy, copyState } = useCopyToClipboard();

  const sharedUrl = `${window.location.origin}/shared/audits/${audit?._id}?token=${updateAuditShareStatus.data?.shareToken}`;

  return (
    <Popover>
      <PopoverTrigger render={children} />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Share Findings</PopoverTitle>
          <PopoverDescription>
            Get a public accessible link to this report
          </PopoverDescription>
        </PopoverHeader>

        <Field orientation={"horizontal"}>
          <Switch
            disabled={updateAuditShareStatus.isPending}
            checked={updateAuditShareStatus.data?.isShared}
            onCheckedChange={(checked) => {
              if (!audit) return;

              updateAuditShareStatus.mutate({
                auditId: audit._id,
                enabled: checked,
              });
            }}
          />
          <FieldContent>
            <FieldLabel>
              Enable access {updateAuditShareStatus.isPending && <Spinner />}
            </FieldLabel>
            <FieldDescription>
              Anyone can view the content of this report
            </FieldDescription>
          </FieldContent>
        </Field>

        {updateAuditShareStatus.data?.isShared && (
          <InputGroup disabled={updateAuditShareStatus.isPending}>
            <InputGroupInput value={sharedUrl} readOnly />
            <InputGroupAddon align={"inline-end"}>
              <Button
                appearance={"solid"}
                size="sm"
                color="primary"
                onClick={() => copy(sharedUrl)}
              >
                Copy {copyState === "copied" && <Check />}
              </Button>
            </InputGroupAddon>
          </InputGroup>
        )}
      </PopoverContent>
    </Popover>
  );
};
