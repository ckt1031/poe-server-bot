import { Hono } from "hono";
import type { Bindings, QueryRequest } from "./types";
import handleSettings from "./handler/settings";
import handleQuery from "./handler/query";

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", async (c) => {
  const request = await c.req.json() as QueryRequest;

  const model = c.req.query("model");

  if (!model) {
    return c.text('Missing "model" query parameter', 400);
  }

  const authorization = c.req.header().authorization;

  if (authorization !== `Bearer ${c.env.ACCESS_KEY}`) {
    return c.text("Unauthorized", 401);
  }

  switch (request.type) {
    case "query":
      return handleQuery(c, model, request);
    case "settings":
      return handleSettings(c);
    default:
      console.error("Invalid request type: ", request);
      throw new Error("Invalid request type");
  }
});

export default app;
