import { streamSSE } from "hono/streaming";
import OpenAI from "openai";
import {
  ChatCompletionMessageParam,
  ChatCompletionUserMessageParam,
} from "openai/resources/index.mjs";
import {
  DoneMessage,
  ErrorMessage,
  HonoContext,
  JsonMessage,
  MetaMessage,
  QueryRequest,
  ReplaceMessage,
  SuggestedReplyMessage,
  TextMessage,
} from "../types";
import { fetchPrompt } from "../prompts";

export default async function handleQuery(
  c: HonoContext,
  request: QueryRequest,
) {
  const openai = new OpenAI({
    apiKey: c.env.OPENAI_API_KEY,
    baseURL: c.env.OPENAI_API_URL,
  });

  const model = c.req.query("model") ?? c.env.OPENAI_DEFAULT_MODEL ??
    "gpt-4o-mini";
  const prompt = c.req.query("prompt") ?? "";

  const customSystemMessage = prompt ? await fetchPrompt(prompt) : "";

  const messages: ChatCompletionMessageParam[] = request.query.map((m) => {
    const role = m.role === "bot" ? "assistant" : m.role;

    if (role === "assistant") {
      return ({
        role,
        content: m.content,
      });
    }

    if (role === "system") {
      return ({
        role,
        content: customSystemMessage.length > 0
          ? customSystemMessage
          : m.content,
      });
    }

    const content: ChatCompletionUserMessageParam["content"] = [];

    if (m.content.length > 0) {
      content.push({ type: "text", text: m.content });
    }

    const hasAttentchment = m.attachments.length > 0;

    if (hasAttentchment && role === "user") {
      const attachment = m.attachments[0];
      content.push({
        type: "image_url",
        image_url: {
          url: attachment.url,
        },
      });
    }

    return ({
      role: "user",
      content: content,
    });
  });

  const openAIStream = await openai.chat.completions.create({
    model,
    messages,
    stream: true,
    temperature: request.temperature,
  });

  return streamSSE(c, async (stream) => {
    const writeSSE = async (
      message:
        | MetaMessage
        | TextMessage
        | ReplaceMessage
        | JsonMessage
        | SuggestedReplyMessage
        | ErrorMessage
        | DoneMessage,
    ) => {
      await stream.writeSSE({
        event: message.event,
        data: JSON.stringify(message.data),
      });
    };

    await writeSSE({
      event: "meta",
      data: { content_type: "text/markdown", suggested_replies: true },
    });

    for await (const message of openAIStream) {
      const text = message.choices[0]?.delta.content ?? "";
      await writeSSE({ event: "text", data: { text } });
    }

    await writeSSE({ event: "done", data: {} });
  });
}
