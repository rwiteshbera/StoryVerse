## Full Installation
- Run the `setup.sh` bash script to install all the modules

```bash
bash setup.sh
```

- Copy the .env.example file to .env and update any details required in both `server` and `client` foler.
1. **MONGO_URI** : You will get mongodb uri once you create a database. URI
   helps to define connections between applications and MongoDB instances.For
   testing purposes, you can use `"mongodb://localhost:27017"`
2. **SENDER_EMAIL** : It will be used in nodemailer for email service. 
3. **SENDER_EMAIL_PASS** : Create your own app password inside gmail settings
   and add it here.
4. **CLOUDINARY_NAME**, **CLOUDINARY_API_KEY**, **CLOUDINARY_API_SECRET** :
  Add Cloudinary secret keys.
5. **SERVER_BASE_URL** : Provide the server base url (Ex: `http://localhost:5050`)

- Add SERVER BASE URL in a `.env` file in client folder.
```
VITE_SERVER_BASE_URL=
```

- Now, run the entire project by using `run.sh` bash script

```bash
bash run.sh
```