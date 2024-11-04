/**
 * Reference: https://creator.poe.com/docs/poe-protocol-specification
 */

import { Context } from "hono";

export type HonoContext = Context<{ Bindings: Bindings }>;

export interface SettingsResponse {
  allow_attachments?: boolean;
  introduction_message?: string;
  expand_text_attachments?: boolean;
  server_bot_dependencies?: Record<string, number>;
  enable_image_comprehension?: boolean;
  enforce_author_role_alternation?: boolean;
  enable_multi_bot_chat_prompting?: boolean;
}

export type Identifier = string;
export type ContentType = "text/markdown" | "text/plain";
export type FeedbackType = "like" | "dislike";

export interface MessageFeedback {
  type: FeedbackType;
  reason?: string;
}

export interface Attachment {
  url: string;
  content_type: string;
  name: string;
  parsed_content?: string;
}

export interface ProtocolMessage {
  role: "system" | "user" | "bot";
  content: string;
  content_type: ContentType;
  timestamp: number;
  message_id: Identifier;
  feedback: MessageFeedback[];
  attachments: Attachment[];
}

export interface QueryRequest {
  query: ProtocolMessage[];
  user_id: Identifier;
  conversation_id: Identifier;
  message_id: Identifier;
  access_key: string;
  temperature?: number;
  skip_system_prompt?: boolean;
  logit_bias?: Record<string, number>;
  stop_sequences?: string[];
  language_code?: string;
  type: "query" | "settings" | "report_error" | "report_feedback";
}

export interface MetaMessage {
  event: "meta";
  data: {
    content_type?: "text/markdown" | "text/plain";
    suggested_replies?: boolean;
  };
}

export interface TextMessage {
  event: "text";
  data: {
    text: string;
  };
}

export interface ReplaceMessage {
  event: "replace_response";
  data: {
    text: string;
  };
}

export interface JsonMessage {
  event: "json";
  data: Record<string, any>;
}

export interface SuggestedReplyMessage {
  event: "suggested_reply";
  data: {
    text: string;
  };
}

export interface ErrorMessage {
  event: "error";
  data: {
    allow_retry: boolean;
    text: string;
    raw_response: string;
    error_type: string;
  };
}

export interface DoneMessage {
  event: "done";
  data: {};
}

export type Bindings = {
  TOKEN?: string;
  BOT_NAME?: string;
  ACCESS_KEY: string;
  OPENAI_API_KEY: string;
  OPENAI_API_URL: string;
  OPENAI_DEFAULT_MODEL?: string;
};
