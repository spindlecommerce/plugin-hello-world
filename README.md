# Hello world, a SpindleCommerce plugin

Adds a greeting to the history of every new order. It is a small, complete plugin to start your own
from. It has a setting staff can change under **Settings › Plugins**, an event handler, and a call to
one of the platform's services.

## Install

In your SpindleCommerce installation:

```bash
pnpm add @spindlecommerce/plugin-hello-world
```

```ts
// ecom.config.ts
import { helloWorld } from "@spindlecommerce/plugin-hello-world";

export default defineConfig({ plugins: [email(), stripe(), shippo(), helloWorld()] });
```

Deploy. The plugin starts working straight away, because its only setting has a default. Place an
order and the greeting appears in the order's history. To change the greeting, go to **Settings ›
Plugins › Hello world**.

## Start your own plugin

1. Press **Use this template** on GitHub, or copy this repository.
2. In `package.json`, rename the package. Keep the peer dependency on `@spindlecommerce/plugin-sdk`:
   in an installation it is the platform's own SDK, so your plugin uses the platform's classes.
3. In `src/index.ts`, rename the plugin (`name`: lowercase letters, digits and dashes) and build it.
   Keep `apiVersion` a number.
4. Run `pnpm install`, `pnpm test` and `pnpm build`.

The plugin API, with every extension point (events, the checkout hook, payment and shipping
providers, routes, tasks, migrations, GraphQL), is
[@spindlecommerce/plugin-sdk](https://www.npmjs.com/package/@spindlecommerce/plugin-sdk).

## Develop

```bash
pnpm install
pnpm test
pnpm build
```

## Release

Each version is staged on npm and goes live when a maintainer approves it.

1. Raise `version` in `package.json` and in `src/index.ts`. A test checks they match.
2. Commit, then tag and push, e.g. `git tag v1.0.1 && git push origin main v1.0.1`.
3. The Release workflow tests, builds and stages the version, and creates the GitHub release.
4. Approve it on npmjs.com, under **Staged Packages**, with 2FA.

The workflow publishes with npm's trusted publishing, so it needs no token. Before its first
release, a maintainer links the package to the workflow:

```bash
npm trust github @spindlecommerce/plugin-hello-world --repo spindlecommerce/plugin-hello-world --file release.yml --allow-stage-publish
```

Run it just before tagging: npm drops a link that isn't used within 48 hours.
`--allow-stage-publish` on its own means the workflow can only stage versions, never publish one
directly.

## License

MIT
