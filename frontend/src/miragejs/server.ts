import { createServer } from "miragejs";

export function makeServer({ environment }) {
  return createServer({
    environment,
    routes() {
      this.namespace = "api";
      this.passthrough();
    },
  });
}
