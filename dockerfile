FROM node:lts as base
COPY . .
RUN npm ci

FROM base as test
ARG DB_HOST
ENV DB_HOST $DB_HOST

CMD npm run test

FROM base as build
RUN npm run build

FROM node:lts-alpine3.17 as release
COPY --from=build src/dist dist/
COPY --from=build node_modules dist/node_modules
CMD [ "node", "dist/server.js" ]