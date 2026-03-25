// Minimal ambient types for Deno globals used in Edge Functions.
// The actual runtime is Deno — these declarations silence VS Code when
// the Deno Language Server extension is not installed.

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(
    handler: (req: Request) => Response | Promise<Response>,
    options?: { port?: number },
  ): void;
};
