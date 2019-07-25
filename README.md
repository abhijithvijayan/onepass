<h1 align="center">OnePass</h1>
<p align="center">
  <img src="https://travis-ci.org/onepassapp/onepass.svg?branch=master" />
  <img src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/node-%3E%3D%208%20%3C11-blue.svg" />
  <img src="https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357&colorA=db748e" />
</p>

> An Open-Source Password Manager (being) build on latest web/native technologies & higher security protocols.

<h3>The WebApp is still in the very development phase.</h3>

You could test out the live progress at

https://onepass.abhijithvijayan.in

Use sample credentials from this paste

https://pastebin.com/raw/4bB7DsxX

## Prerequisites

- node &gt;= 8 &lt;11
- neo4j

## Table of contents

- [Quick Start](#quick-start)
- [NPM Commands](#yarn-commands)
- [Adding New Dependencies](#adding-new-dependencies)
- [How Packages Communicate](#how-packages-communicate)

## Quick Start

1. Run `yarn bootstrap` in order to install all dependencies.
2. Run whichever package you wish to, using specific commands listed below.
3. Enjoy ✨

#### Launch WebApp (Next.js - Express Server)

- Run `yarn run dev:web` to launch webapp at port `4000`

#### Extension

- Run `yarn run dev:extension` to launch create-react-app at `port 3000` and express backend server at `port 4000`

## YARN Commands

### bootstrap

This runs `yarn install` on each package and symlinks local packages.

<!-- ### clean

Deletes all `node_modules` from all packages. Use this first if you see any odd dependency errors and then follow with `yarn bootstrap` -->

## Adding New Dependencies

Adding packages to a `yarn workspaces` project is slightly different than adding to a standard node package. Common `devDependencies` can be added to the top level `package.json` file using `-W --dev` flag.

### Adding Common Dependencies

This is the most likely scenario you'll face.

In the root directory ( `onepass/` ) run the following commands:

```sh
yarn add some-cool-package -W
yarn bootstrap
```

This makes `some-cool-package` available to all packages.

### Adding Individual Dependencies

```
yarn workspace @onepass/<core/web/extension/mobile> add some-cool-package
```

### Creating A Dependency To Another Local Package

To create a dependency to a `foo` package from a `bar` package:

In the `bar` package, add the following entry in the `packages/bar/package.json` file under the dependencies key:

```js
{
  //...other stuff...
  dependencies:{
    //...other dependencies...
    "@onepass/foo": "0.0.1", // this version must be exact otherwise it fetches from npm
  }
}
```

**Important**

The version number must be exact as in the package.json of `foo` to link local packages, otherwise it will (try to) fetch the package from NPM.

<hr />

### Directory Structure

- @onepass/core - Encryption/Decryption related functions
- @onepass/web - Next.js App
- @onepass/extension - Create-React-App Browser-extension
- @onepass/server - Express Server

<hr />

### Vault Architecture

Follows similar architecture like of 1password.com

> Read more in-detail [here](https://1password.com/files/1Password%20for%20Teams%20White%20Paper.pdf)

#### In simple words:

> You have a Master Password & Secret Key with which ONLY you can unlock the vault.

> These 2 items are NEVER send to the server in any manner.

> All encryption / decryption stuff is done on the client device itself.

<hr />

## Stack

<h4>WebApp</h4>

- Node (Web server)
- Express (Web server framework)
- SRP Protocol (Authentication)
- Passport (JWT Authentication)
- React (UI library)
- Next (Universal/server-side rendered React)
- Redux (State management | Ducks Style)
- styled-components (CSS styling solution library)
- Ant-Design (React UI Framework)
- SASS (CSS Preprocessor)
- Neo4j (Graph database)

<h4>Browser extension</h4>
... not fixed yet

  <hr />

<h4>Android / iOS</hr>

...

## Author

👤 **abhijithvijayan**

<hr />

## Contributing

Pull requests are welcome as there are plenty of improvements & features to be worked on.

Open [issues](https://github.com/onepassapp/onepass/issues) for feedback, requesting features, reporting bugs or discussing ideas.

## Show your support

Give a ⭐️ if this you find this project helpful!

Also, help in the development to slay the bugs and making this much awesome and free.
