import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";

/** Renders with a fresh QueryClient per test, with retries off so failures show at once. */
export function renderWithQueryClient(ui: ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
}

type MockResponse = { status: number; body: unknown };

/**
 * Replaces fetch with `handler`, which gets the URL and init and returns a
 * status and JSON body. Returns the jest mock for assertions.
 */
export function mockFetch(
  handler: (url: string, init?: RequestInit) => MockResponse,
) {
  const fetchMock = jest.fn(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const { status, body } = handler(String(input), init);
      return {
        ok: status >= 200 && status < 300,
        status,
        json: async () => body,
      } as Response;
    },
  );
  global.fetch = fetchMock;
  return fetchMock;
}
