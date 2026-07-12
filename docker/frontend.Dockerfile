FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY tsconfig.base.json ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json
COPY shared/package.json ./shared/package.json

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "-w", "frontend"]
