## Server

### Installation

- Run the following command to install dependencies

```bash
npm install
```

- Create a `.env` file and copy the following code
  snippet add all the secret keys.

```js
MONGO_URI=
JWT_SECRET_KEY=
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
2. **JWT_SECRET_KEY** : You can generate your own secret token from here :
   [https://jwt.io/](https://jwt.io/). It will be used for authorization.
3. **SENDER_EMAIL** : It is used in nodemailer for email service. Provide your
   email id.
4. **SENDER_EMAIL_PASS** : Create your own app password inside gmail settings
   and add it here. It will connect nodemailer with your gmail without 2 factor
   authentication. App Passwords aren’t recommended and are unnecessary in most
   cases. So it is important to keep them secret.
5. **CLOUDINARY_NAME**, **CLOUDINARY_API_KEY**, **CLOUDINARY_API_SECRET** :
   Cloudinary will provide you once you register.

- Run the server by `npm run dev`