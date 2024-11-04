export async function syncBotSettings(botName: string, accessKey: string) {
  const PROTOCOL_VERSION = "1.0";
  const baseUrl = "https://api.poe.com/bot/fetch_settings";

  await fetch(
    `${baseUrl}/${botName}/${accessKey}/${PROTOCOL_VERSION}`,
    {
      method: "POST",
      cf: {
        cacheTtl: 300, // 5 minutes
        cacheEverything: true,
      },
    },
  );
}
