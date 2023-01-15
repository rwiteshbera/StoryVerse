# Pixby

## A Full Stack Social Media Application

<img src="https://user-images.githubusercontent.com/73098407/194613958-20b79c70-48c0-4d3a-98f8-abbfa6675fe8.png" width="45%"></img> <img src="https://user-images.githubusercontent.com/73098407/201530594-76c0aa3f-facc-4f4e-b362-405457568479.png" width="45%"></img> <img src="https://user-images.githubusercontent.com/73098407/201530540-08a80e66-a830-45bb-b09d-687a7bcb2c00.png" width="45%"></img> <img src="https://user-images.githubusercontent.com/73098407/201530541-7c6457b9-73b3-4158-a111-ec2ef5cd29a5.png" width="45%"></img>

## [More Screenshots](Screenshots.md)


## Built with

1. React
2. Vite
3. Chakra UI
4. NodeJs
5. Express
6. MongoDB
7. Nodemailer
8. Cloudinary

## Prerequisites

- [Docker](https://www.docker.com/)

## Installation
Once you have these prerequisites, you can follow these steps to set up the project:

1. Clone the repository from `https://github.com/rwiteshbera/Pixby`
2. Make sure you have filled the environment variables in the docker-compose.yml file before running docker-compose up 
```js
   MONGO_URI= // mongodb://mongo:27017/pixby
   SENDER_EMAIL= // It will be used in nodemailer for email service. 
   SENDER_EMAIL_PASS= // Create your own app password inside gmail settings and add it here.
   CLOUDINARY_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET= // Add Cloudinary secret keys.
   SERVER_BASE_URL= // http://localhost:5050
```
3. Run `docker-compose build` to build the necessary images for the project.
4. Run `docker-compose up` to start the project.
5. Access the client at `http://localhost:3000` and the server at `http://localhost:5050` (Default PORT)
6. To stop the project, press CTRL + C in the terminal where the project is running and run `docker-compose down` to stop and remove the containers.

## Our Contributors

<a href="https://github.com/rwiteshbera/Pixby/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=rwiteshbera/Pixby" />
</a>
