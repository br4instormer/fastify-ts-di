# Base snapshot for nodejs backend using fastify + inversify

Debug via VSCode

Plugins:

* JWT + Cookies (Twin tokens)
* CORS
* .env
* logging

## Using

### Install dependencies

```bash
npm i
```

### Development mode (watch for changes)

```bash
npm run dev
```

### Debug mode

```bash
npm run dev:inspect
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Lint fix

```bash
npm run lint:fix
```

### Build Docker image

```bash
docker build --pull --build-arg "NODE_VER=18.16" -t backend .
```

### Run Docker container

```bash
docker run --rm -d  --cpus=2 -m 150m -p 8282:8282 -u node:node --name backend backend
```

### Stop Docker container

```bash
docker container stop backend
```
