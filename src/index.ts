import { Hono } from "hono";
import type { Bindings, HonoContext, QueryRequest } from "./types";
import handleSettings from "./handler/settings";
import handleQuery from "./handler/query";

const app = new Hono<{ Bindings: Bindings }>();

function checkAuthorization(c: HonoContext): boolean {
  const authorization = c.req.header().authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return false;
  }

  const keys = c.env.ACCESS_KEY.trim().split(",");

  if (keys.length === 1) {
    return authorization === `Bearer ${keys[0]}`;
  }

  return keys.includes(authorization.replace("Bearer ", ""));
}

app.post("/", async (c) => {
  if (!checkAuthorization(c)) {
    return c.text("Unauthorized", 401);
  }

  const request = await c.req.json() as QueryRequest;

  switch (request.type) {
    case "query":
      return handleQuery(c, request);
    case "settings":
      return handleSettings(c);
    default:
      console.error("Invalid request type: ", request);
      throw new Error("Invalid request type");
  }
});

export default app;