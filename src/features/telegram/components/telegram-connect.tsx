"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TelegramIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useLinkTelegram,
  useTelegramStatus,
  useUnlinkTelegram,
} from "../telegram.hook";

const POLL_INTERVAL_MS = 2000;
const LINK_TIMEOUT_MS = 30_000;

export const TelegramConnect = () => {
  const [linking, setLinking] = useState(false);

  const status = useTelegramStatus({
    refetchInterval: linking ? POLL_INTERVAL_MS : undefined,
  });
  const link = useLinkTelegram();
  const unlink = useUnlinkTelegram();

  const connected = status.data?.connected ?? false;
  const blocked = status.data?.blocked ?? false;
  const username = status.data?.telegramUsername;

  // Stop linking + celebrate once the backend reports the connection
  useEffect(() => {
    if (linking && connected) {
      setLinking(false);
      toast.success("Telegram connected!");
    }
  }, [linking, connected]);

  // Give up after 30s of waiting for the user to finish in Telegram
  useEffect(() => {
    if (!linking) return;

    const timer = setTimeout(() => {
      setLinking(false);
      if (!connected) {
        toast.error("Telegram link timed out. Please try again.");
      }
    }, LINK_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [linking, connected]);

  const handleConnect = async () => {
    const { deepLink } = await link.mutateAsync();
    setLinking(true);
    window.open(deepLink, "_blank", "noopener,noreferrer");
  };

  const handleDisconnect = () => {
    unlink.mutate();
  };

  return (
    <Card className="h-fit">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <TelegramIcon className="size-6" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold">Telegram notifications</span>
            <span className="text-muted-foreground text-sm">
              {linking
                ? "Waiting for you to open Telegram and tap Start..."
                : connected
                  ? blocked
                    ? "Connected, but you blocked the bot — messages are not being delivered."
                    : username
                      ? `Connected as @${username}`
                      : "Connected"
                  : "Get notified in Telegram when your persona analyses finish."}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          {connected ? (
            <Button
              appearance="outline"
              color="destructive"
              onClick={handleDisconnect}
              isLoading={unlink.isPending}
            >
              Disconnect
            </Button>
          ) : (
            <Button
              color="primary"
              onClick={handleConnect}
              isLoading={linking || link.isPending}
            >
              Connect Telegram
            </Button>
          )}
          {status.data && !connected && (
            <span className="text-muted-foreground text-xs">
              Links expire after 10 minutes.
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
