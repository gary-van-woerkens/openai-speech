FROM node:18-alpine as builder

ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

COPY . ./

RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:18-alpine as runner

WORKDIR /app

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
