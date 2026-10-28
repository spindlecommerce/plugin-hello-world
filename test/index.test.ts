import { readFile } from "node:fs/promises";
import type { EventHandler, PluginEvent } from "@spindlecommerce/plugin-sdk";
import { describe, expect, it, vi } from "vitest";
import { helloWorld } from "../src/index.ts";

const plugin = helloWorld();
const onOrderPlaced = plugin.events?.["order.placed"] as EventHandler<NonNullable<typeof plugin.settings>>;

const placed = (orderId: string): PluginEvent => ({ id: crypto.randomUUID(), type: "order.placed", aggregateType: "order", aggregateId: orderId, payload: {}, occurredAt: new Date() });

/** The parts of the context the plugin uses. `once` remembers its keys, as the platform's does across retries. */
const context = (greeting: string) => {
  const ran = new Set<string>();
  const addNote = vi.fn(async (_orderId: string, _message: string) => {});
  const ctx = {
    settings: { greeting },
    services: { orders: { addNote } },
    once: async (key: string, fn: () => Promise<void>) => {
      if (ran.has(key)) return false;
      await fn();
      ran.add(key);
      return true;
    },
  };
  return { ctx: ctx as unknown as Parameters<typeof onOrderPlaced>[1], addNote };
};

describe("helloWorld", () => {
  it("adds the greeting to a new order's history", async () => {
    const { ctx, addNote } = context("Thanks for your order!");
    await onOrderPlaced(placed("order-1"), ctx);
    expect(addNote).toHaveBeenCalledWith("order-1", "Thanks for your order!");
  });

  it("adds it once, however often the event is delivered", async () => {
    const { ctx, addNote } = context("Hi");
    await onOrderPlaced(placed("order-1"), ctx);
    await onOrderPlaced(placed("order-1"), ctx);
    expect(addNote).toHaveBeenCalledTimes(1);
  });

  it("greets with a default until staff choose their own", () => {
    expect(plugin.settings?.greeting.default).toBe("Hello from the hello-world plugin");
  });

  it("reports the package's version and the plugin API it was written for", async () => {
    const { version } = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8")) as { version: string };
    expect(plugin.version).toBe(version);
    expect(plugin.apiVersion).toBe(1);
  });
});
