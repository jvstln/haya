import { XIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  fieldLabelClassName,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Textarea } from "@/components/ui/textarea";
import { getInitials, truncate } from "@/lib/utils";

const allTeams = [
  {
    name: "Chiemerie Stanly",
    handle: "emerie",
    wallet: "0x1234567890123456789012345678901234567890",
  },
  {
    name: "Chinedu Okwu",
    handle: "chinedu",
    wallet: "0x1234567890123456789012345678901234567890",
  },
  {
    name: "Chinedu Okwu",
    handle: "okwu",
    wallet: "0x1234567890123456789012345678901234567890",
  },
];

const SettingsPage = () => {
  return (
    <div className="p-4">
      <div className="-mt-4 -mx-4 h-56 bg-card" />
      <Avatar className="-translate-y-1/2 size-33 bg-yellow-400 text-6xl">
        <AvatarFallback>EM</AvatarFallback>
      </Avatar>

      <Card>
        <CardContent className="flex gap-4 max-lg:flex-col [&_:is(input,textarea)]:border-foreground">
          <div className="flex flex-1 flex-col gap-4">
            <Field>
              <FieldLabel>Username</FieldLabel>
              <Input placeholder="Enter username" />
            </Field>

            <span className={fieldLabelClassName}>Link accounts</span>
            <FieldGroup>
              <Field>
                <Input placeholder="LinkedIn profile" />
              </Field>
              <Field>
                <Input placeholder="X profile" />
              </Field>
              <Field>
                <Input placeholder="Github profile" />
              </Field>
              <Field>
                <Input placeholder="Other profile" />
              </Field>
            </FieldGroup>
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <Field>
              <FieldLabel>About me</FieldLabel>
              <Textarea placeholder="Write briefly about yourself" />
            </Field>

            <div>All teams</div>
            <div className="flex flex-col">
              {allTeams.map((team) => (
                <Item key={team.handle} className="p-1">
                  <ItemMedia className="self-center!">
                    <Avatar>
                      <AvatarFallback>{getInitials(team.name)}</AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{team.handle}</ItemTitle>
                    <ItemDescription>
                      {truncate(team.wallet, 5, 3)}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button variant="destructive-outline" size="icon-sm">
                      <XIcon />
                    </Button>
                  </ItemActions>
                </Item>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
