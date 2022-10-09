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

- Create a `keys.js` file inside `server` folder. Copy the following code
  snippet add all the secret keys.

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

1. **MONGO_URI** : You will get mongodb uri once you create a database. URI
   helps to define connections between applications and MongoDB instances.For
   testing purposes, you can use `"mongodb://localhost:27017"`
2. **JWT_SECRET_KEY** : You can generate your own secret token from here :
   [https://jwt.io/](https://jwt.io/). It will be used for authorization.
3. **SENDER_EMAIL** : It is used in nodemailer for email service. Provide your
   email id.
4. **SENDER_EMAIL_PASS** : Create your own app password inside gmail settings
   and add it here. It will connect nodemailer with your gmail without 2 factor
   authentication. _App Passwords aren’t recommended and are unnecessary in most
   cases. So it is important to keep them secret._
5. **CLOUDINARY_NAME**, **CLOUDINARY_API_KEY**, **CLOUDINARY_API_SECRET** :
   Cloudinary will provide you once you register.

- Now, run the entire project by using `run.sh` bash script

```bash
bash run.sh
```


<div align="center">

# Contributing Guidelines 📜
</div>


***
<p>If you are new to open-source and would like to make your first contribution, please participate in this project.<p>
<p>Follow the steps below :- </p>

## Git Setup Guide
***
### To initialise Git, write
```bash
git init
```

### 1. Configure your local Git
---
```bash
git config --global user.name "github username"
```

```bash
git config --global user.email "email address"
```

### 2.  Go to the first-contribution repository and Fork it.
---
* The term fork refers to a rough copy of a repository. When you fork a repository, you are able to test and debug changes without affecting the original project. In addition to proposing changes to resolve bugs, forking is also used excessively for this purpose.

* Click on Code Button and copy the URL of your forked Repository

### 3. Switch to your Git bash window, and enter the following :
---
* Clone the Forked project on your local system 

```bash
git clone https://github.com/rwiteshbera/Pixby.git
```



**Note: Do not fill this detail twice or more than that.**
### 4. Choose your Stack
---
* Web(HTML, CSS, JS)
* Python GUI Application(tkinter, Pygame, PyQT)
* Python Automation Tool
* Data Structure & Algorithms
* Designs/Sketches<br/>


### 5. Creating a Pull request
---
#### Create a branch

* A branch is designed to encapsulate a group of changes. These changes might be thrown away, entirely rewritten or in the majority of cases they’ll be promoted into the main history of the codebase - via a merge.


* For creating a branch

```bash
git branch branch_name
```

* Checkout to the created branch

```bash
git checkout branch_name
```


* Now add the files using the git command

```bash
git add .
```
* Commit the changes to the local project

```bash
git commit -m "Added my data"
```

* Push the changes to your forked github repo
```bash
git push origin branch_name
```

### 6. Final Steps
---
* Open your forked git repository, you will get a message like as shown in the figure (if not then refresh the page).

**Click on "Contribute 👆🏻**


* Now click on "Open pull request"

* Click on "Create pull request"

* Click on "Create pull request"
 You may add a Comment to your Pull Request








## Our Contributors

<a href="https://github.com/rwiteshbera/Pixby/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=rwiteshbera/Pixby" />
</a>
