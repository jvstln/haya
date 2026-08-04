export type TelegramStatus = {
  connected: boolean;
  telegramUsername?: string;
  linkedAt?: string;
  blocked?: boolean;
};

export type TelegramLinkResponse = {
  deepLink: string;
  expiresInSeconds: number;
};
