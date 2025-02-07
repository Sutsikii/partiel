
## Project setup

Faire docker compose up -d --build 

Pour l'api : http://localhost:3000
Pour le front : http://localhost:3001

Pour avoir un compte admin pour faire les tests je recommande de faire avec thunder client ou post man : 

{
  "email": "admin@example.com",
  "password": "securepassword",
  "role": "admin"
}

sur la route : http://localhost:3000/auth/register

## Pourquoi nextjs à la place d'angular ?

Nous avons appris au dernier moment que le partiel était sur Angular, étant appeler juste "node.js" sur le site de l'école
j'ai donc décidé pour fournir un front de prendre une stack que je connais bien, avec angular j'aurai pas eu le temps d'apprendre et de faire un front correcte. 


## Les routes 


GET http://localhost:3000/products (Récupérer tous les produits)

### Créer un produit

POST http://localhost:3000/products 

exemple de data : {
  "name": "T-shirt blanc",
  "description": "Un t-shirt confortable en coton",
  "price": 19.99,
  "stock": 100,
  "imageUrl": "https://example.com/tshirt.jpg"
}

### Récupérer un produit

GET http://localhost:3000/products/1 

### Modifier un produit

PUT http://localhost:3000/products/1 

### Supprimer un produit

DELETE http://localhost:3000/products/1 

### Créer un compte

http://localhost:3000/auth/register

{
  "email": "admin@example.com",
  "password": "securepassword",
  "role": "admin"
}

### Se connecter

http://localhost:3000/auth/login

{
  "email": "admin@example.com",
  "password": "securepassword",
}