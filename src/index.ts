import { definePlugin, setting } from "@spindlecommerce/plugin-sdk";

/**
 * Adds a greeting to the history of every new order. A small, complete plugin to start from: a
 * setting staff can change under Settings › Plugins, an event handler, and a platform service.
 */
export const helloWorld = () =>
  definePlugin({
    name: "hello-world",
    // The package's version (a test keeps them equal), shown in the admin.
    version: "1.0.0",
    // The plugin API this was written for, as a number. PLUGIN_API_VERSION would be the
    // installation's own, so it would always match and the platform could not refuse the plugin.
    apiVersion: 1,
    title: "Hello world",
    description: "Adds a greeting to every new order's history.",
    settings: {
      greeting: setting.string({
        label: "Greeting",
        description: "Added to the history of each new order.",
        default: "Hello from the hello-world plugin",
      }),
    },
    events: {
      // An event can be delivered more than once (a retry after a timeout): `once` keeps it to one note.
      "order.placed": async (event, ctx) => {
        await ctx.once(`greeted:${event.aggregateId}`, () => ctx.services.orders.addNote(event.aggregateId, ctx.settings.greeting));
      },
    },
  });
