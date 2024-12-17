# AdamAurelioDotCom

The plan is to build this out using react, python, and postgres

## File Structure

```
AdamAurelioDotCom/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   └── Resume.js
│   ├── pages/
│   │   ├── Home.js
│   │   └── About.js
│   ├── App.js
│   ├── index.js
│   └── styles/
│       └── main.css
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── package.json
├── README.md
└── .gitignore
```

## Docker Setup

1. Create a `Dockerfile` in the `docker/` directory:

   ```Dockerfile
   // filepath: /c:/Users/adama/OneDrive/Apps/Developer/Web/Personal Apps/AdamAurelioDotCom/docker/Dockerfile
   FROM node:14

   WORKDIR /app

   COPY package.json ./
   RUN npm install

   COPY . ./

   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. Create a `docker-compose.yml` file in the `docker/` directory:

   ```yaml
   // filepath: /c:/Users/adama/OneDrive/Apps/Developer/Web/Personal Apps/AdamAurelioDotCom/docker/docker-compose.yml
   version: "3"
   services:
     web:
       build: .
       ports:
         - "3000:3000"
       volumes:
         - .:/app
       command: npm start
   ```

3. Build and run the Docker container:
   ```sh
   docker-compose up --build
   ```
