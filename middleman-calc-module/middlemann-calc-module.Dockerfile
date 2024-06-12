FROM node:20-alpine AS base

WORKDIR /usr/src/app

COPY package*.json .

FROM base AS development

RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/.npm && \
    npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["node", "servis.js" ]


