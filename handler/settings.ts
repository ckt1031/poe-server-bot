import { Context } from "hono";
import { SettingsResponse } from "../types";

export default function handleSettings(c: Context) {
  const settings: SettingsResponse = {
    allow_attachments: true,
    enable_multi_bot_chat_prompting: true,
    introduction_message:
      "Hello, I am a helpful assistant! How can I help you today?",
  };

  return c.json(settings);
}
