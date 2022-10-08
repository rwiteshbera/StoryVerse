# Pixby

## A Full Stack Social Media Application

![image](https://user-images.githubusercontent.com/73098407/194613958-20b79c70-48c0-4d3a-98f8-abbfa6675fe8.png)

### Built with

1. React
2. Vite
3. Chakra UI
4. NodeJs
5. Express
6. MongoDB
7. Nodemailer
8. Cloudinary

### Installation

- Run the `setup.sh` bash script to install all the modules

```bash
bash setup.sh
```

- Create a `keys.js` file inside `server` folder. Copy the following code snippet add all the secret keys.

```js
module.exports = {
  MONGO_URI: "",
  JWT_SECRET_KEY: "",
  SENDER_EMAIL: "",
  SENDER_EMAIL_PASS: "",
  CLIENT_PORT_ID: 5050,
  CLOUDINARY_NAME: "",
  CLOUDINARY_API_KEY: ,
  CLOUDINARY_API_SECRET: "",
};
```

1. **MONGO_URI** : You will get mongodb uri once you create a database. URI helps to define connections between applications and MongoDB instances.For testing purposes, you can use "mongodb://localhost:27017"
2. **JWT_SECRET_KEY** : You can generate your own secret token from here : [https://jwt.io/](https://jwt.io/). It will be used for authorization.
3. **SENDER_EMAIL** : It is used in nodemailer for email service. Provide your email id.
4. **SENDER_EMAIL_PASS** : Create your own app password inside gmail settings and add it here. It will connect nodemailer with your gmail without 2 factor authentication. _App Passwords aren’t recommended and are unnecessary in most cases. So it is important to keep them secret._
5. **CLOUDINARY_NAME**, **CLOUDINARY_API_KEY**, **CLOUDINARY_API_SECRET** : Cloudinary will provide you once you register.

- Now, run the entire project by using `run.sh` bash script

```bash
bash run.sh
```
