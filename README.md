# Nodepop

The best API for apps that offers the possibility of selling and buying products between their users.

To try this API follow the next steps:

* Download API server to local hard drive;

		git clone https://github.com/iaguilarmartin/Nodepop.git
		cd Nodepop
		
* Install the NodeJS-Express server:

		npm install
		
* Initialize the database *(a MongoDB running on localhost port 27017 is required)*:

		npm run installDB
		
* Run the server:

		npm start
		

The API is now ready to use. You can take a look to the [API documentation](http://localhost:3000/documentation) to learn how to use it


## Practica DevOps

Se ha desplegado Nodepop en una instancia AWS. Las URL para poder realizar las pruebas son las siguintes:

* URL con la documentación del API (servido directamente usando Nginx):  [http://nodepop.iaguilarmartin.com](http://nodepop.iaguilarmartin.com)

* Las URLs del API son servidas directamente por Node.js. Hay ejemplos de todas ellas en la documentación. Aquí un ejemplo sencillo: [http://nodepop.iaguilarmartin.com/api/v1/tags](http://nodepop.iaguilarmartin.com/api/v1/tags)

* URL de acceso a imagenes estaticas servidas directamente por Nginx con cabecera personalizada X-Owner: [http://nodepop.iaguilarmartin.com/images/audi.jpg](http://nodepop.iaguilarmartin.com/images/audi.jpg)

* URL de página web personalizada al acceder por IP al servidor: [http://23.23.16.4](http://23.23.16.4) 