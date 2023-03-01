import { useQuery } from "@tanstack/react-query";
import { env } from "../../env.mjs";
const wsServerUrl = env.NEXT_PUBLIC_WS_SERVER || "ws://localhost:4444";

// get http url from ws url
const wsUrl = new URL(wsServerUrl);
const httpServerUrl = `${wsUrl.protocol === "ws:" ? "http://" : "https://"}${
  wsUrl.host
}`;

/*
 * Ping health check to wake up server
 */
const HealthCheck = () => {
  useQuery(["healthcheck"], async () => {
    const res = await fetch(`${httpServerUrl}/health`);
    return res.json();
  });

  return null;
};

export default HealthCheck;
