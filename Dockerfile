FROM node:16 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package*.json ./
RUN npm install
RUN npm run migrate
RUN npm run seed
COPY . .
CMD ["npm", "run", "dev"]