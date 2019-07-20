<h1 align="center">OnePass</h1>
<p>
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

<hr />

### Vault Architecture

Follows similar architecture like of 1password.com

> Read more in-detail [here](https://1password.com/files/1Password%20for%20Teams%20White%20Paper.pdf)

#### In simple words:

> You have a Master Password & Secret Key with which ONLY you can unlock the vault.

> These 2 items are NEVER send to the server in any manner.

> All encryption / decryption stuff is done on the client device itself.

<hr />

## Contributing

Pull requests are welcome as there are plenty of improvements & features to be worked on.

Open [issues](https://github.com/onepassapp/onepass/issues) for feedback, requesting features, reporting bugs or discussing ideas.

Encryption related functions are under @onepass/core

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

<h4>Android / iOS</hr>

...

<h4>Browser extension</h4>
...
<hr />

## Prerequisites

- node &gt;= 8 &lt;11
- neo4j

## Getting Started

#### Install Monorepo Packages

```sh
yarn install
```

#### Launch Next.js - Express Server

```sh
yarn run dev:web
```

<!-- #### React-Native Android

```sh
yarn run dev:mobile
``` -->

### Install packages

```
yarn workspace @onepass/<core/web/mobile> add <package_name>
```

<hr />

## Author

👤 **abhijithvijayan**

## Show your support

Give a ⭐️ if this you find this project helpful!

Also, help in the development to slay the bugs and making this much awesome and free.
