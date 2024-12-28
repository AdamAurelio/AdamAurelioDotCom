# AdamAurelioDotCom

The plan is to build this out using React, Python, and Postgres.

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
│   │   ├── Resume.js
│   │   ├── Blog.js
│   │   ├── BlogPost.js
│   │   └── BlogList.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── About.js
│   │   ├── Theology.js
│   │   ├── Technology.js
│   │   └── Family.js
│   ├── App.js
│   ├── index.js
│   └── styles/
│       └── main.css
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── Docker/
│   ├── dev/
│   │   ├── Build/
│   │   │   └── docker-compose_adamaurelio.yml
├── package.json
├── README.md
└── .gitignore
```

## Components

- **Header.js**: Navigation bar with links to different sections.
- **Footer.js**: Footer with contact information and social media links.
- **Resume.js**: Section displaying resume information.
- **Blog.js**: Main blog component that includes BlogList and BlogPost.
- **BlogList.js**: Component to list all blog posts.
- **BlogPost.js**: Component to display a single blog post.

## Pages

- **Home.js**: Main landing page with a brief introduction and links to resume and blog sections.
- **About.js**: Page with detailed information about you.
- **Theology.js**: Blog section for theology-related posts.
- **Technology.js**: Blog section for technology-related posts.
- **Family.js**: Blog section for family-related posts.

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

## Development Plan

1. **Set up the project structure**: Create the necessary directories and files as outlined above.
2. **Develop the components**: Start with the Header, Footer, and Resume components.
3. **Create the pages**: Develop the Home, About, Theology, Technology, and Family pages.
4. **Integrate the blog**: Create the Blog, BlogList, and BlogPost components and integrate them into the respective pages.
5. **Style the application**: Use CSS to style the components and pages.
6. **Set up Docker**: Create the Dockerfile and docker-compose.yml to containerize the application.
7. **Deploy the application**: Deploy the application to a hosting service.
