FROM node:19-slim as build-stage
LABEL authors="rame0"
LABEL org.opencontainers.image.source=https://github.com/rame0/ConversionPro
LABEL org.opencontainers.image.licenses=APACHE-2.0

WORKDIR /app
RUN npm install -g pnpm && rm -rf /root/.npm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --reporter append-only && rm -rf /root/.pnpm

ENV NODE_ENV=production
COPY . .
RUN mv /app/src/server /app/server
RUN pnpm run build && rm -rf /app/src/


# Install --prod
FROM node:19-slim as modules-fetch-stage
WORKDIR /app
RUN npm install -g pnpm && rm -rf /root/.npm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod --no-optional && rm -rf /root/.pnpm

COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/server /app/server


# Runtime
FROM node:19-slim as runtime-stage
WORKDIR /app

COPY --from=modules-fetch-stage /app /app

USER node

CMD [ "node", "server/app.js"]
