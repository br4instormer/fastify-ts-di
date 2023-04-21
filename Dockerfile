ARG NODE_VER
ARG node_image=node:$NODE_VER-slim

FROM $node_image as build
ARG npm_cache_path=/var/tmp/.npm
ARG app_path=/app

COPY --chown=node:node . $app_path/

WORKDIR $app_path
USER node

RUN npm ci --include=dev --no-audit --cache "$npm_cache_path"
RUN npm run build

FROM build as dependencies
ARG npm_cache_path=/var/tmp/.npm
ARG app_path=/dependencies

COPY --chown=node:node ./package*.json $app_path/

WORKDIR $app_path
USER node

RUN npm ci --omit=dev --prefer-offline --no-audit --cache "$npm_cache_path"

FROM $node_image

RUN apt-get update -qq \
  && apt-get install -y curl tini \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY --chown=node:node --from=build /app/dist /app/dist
COPY --chown=node:node --from=dependencies /dependencies/node_modules /app/node_modules
COPY --chown=node:node ./package* /app/
COPY --chown=node:node ./.env /app/

WORKDIR /app
USER node

ENTRYPOINT [ "/usr/bin/tini" ]
CMD [ "node", "." ]