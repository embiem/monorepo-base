FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/apps/webapp2/.next ./.next
COPY --from=builder /app/apps/webapp2/package.json ./package.json
COPY --from=builder /app/apps/webapp2/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]