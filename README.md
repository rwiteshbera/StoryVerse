# Pixby

## A Full Stack Social Media Application

<img src="https://user-images.githubusercontent.com/73098407/194613958-20b79c70-48c0-4d3a-98f8-abbfa6675fe8.png" width="45%"></img> <img src="https://user-images.githubusercontent.com/73098407/201530594-76c0aa3f-facc-4f4e-b362-405457568479.png" width="45%"></img> <img src="https://user-images.githubusercontent.com/73098407/201530540-08a80e66-a830-45bb-b09d-687a7bcb2c00.png" width="45%"></img> <img src="https://user-images.githubusercontent.com/73098407/201530541-7c6457b9-73b3-4158-a111-ec2ef5cd29a5.png" width="45%"></img>

### [More Screenshots](Screenshots.md)


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

- Create a `.env` file inside `server` folder. Copy the following code
  snippet add all the secret keys.

```js
MONGO_URI=
SENDER_EMAIL=
SENDER_EMAIL_PASS=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SERVER_BASE_URL=
```

1. **MONGO_URI** : You will get mongodb uri once you create a database. URI
   helps to define connections between applications and MongoDB instances.For
   testing purposes, you can use `"mongodb://localhost:27017"`
2. **SENDER_EMAIL** : It is used in nodemailer for email service. Provide your
   email id.
3. **SENDER_EMAIL_PASS** : Create your own app password inside gmail settings
   and add it here. It will connect nodemailer with your gmail without 2 factor
   authentication. App Passwords aren’t recommended and are unnecessary in most
   cases. So it is important to keep them secret.
4. **CLOUDINARY_NAME**, **CLOUDINARY_API_KEY**, **CLOUDINARY_API_SECRET** :
   Cloudinary will provide you once you register.

- Add SERVER BASE URL in a `.env` file in client folder.
```
VITE_SERVER_BASE_URL=
```

- Now, run the entire project by using `run.sh` bash script

```bash
bash run.sh
```

## Our Contributors

<a href="https://github.com/rwiteshbera/Pixby/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=rwiteshbera/Pixby" />
</a>
