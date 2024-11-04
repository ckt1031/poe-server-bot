import { Context } from "hono";
import { SettingsResponse } from "../types";

const introductionMessage =
  "Hello, I am a helpful assistant! How can I help you today?";

export default function handleSettings(c: Context) {
  const allow_attachments = c.req.query("allow_attachments") === "true";
  const enable_image_comprehension =
    c.req.query("enable_image_comprehension") === "true";

  const settings: SettingsResponse = {
    allow_attachments,
    enable_image_comprehension,
    introduction_message: introductionMessage,
  };

  return c.json(settings);
}
