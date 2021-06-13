# MyWebSite(Backend)

Proyecto que funcionara para gestionar la parte del BACKEND del proyecto MyWebSite_Fronend y funcionara como una API que sera consumida por el proyecto.



## NODEJS(EXPRESS)
Para la creación del servidor utilizamos NodeJs con el framework de express que nos permite crear el servidor de una manera más sencilla y de manera mucho más flexible. Ya que espress nos permite realizar la configuración de una manera muy sencilla y crear las diferentes rutas que necesitamos para nuestro servidor. Por otra parte tiene una muy buena integración con otros recursos de NodeJs.



## NODEMAILER
Para el formulario de contacto utilizamos el modulo NodeMailer por el cual lo podemos enviar correos a un correo personalizado en NameCheap el cual se redirige a mi correo personal.



## JSONWEBTOKEN
Para poder crear la parte de administración del sitio web y poder subir nuevo o actualizar el contenido se crearon páginas que nos permiten realizar estas operaciones y para controlar la seguridad de la página web y autentificar al administrador utilizamos JsonWebToken este modulo lo que nos permite hacer es crear un token de identificación el cual sera solicitado para cada operación que tenga que ver con la creación o modificación del contenido de la pagina web.



## DOTENV
En la parte seguridad igual de importante que comprobar la identidad del administrador es no poner tus credenciales directamente en el código y para esta tarea una de las mejores soluciones es utilizar variables de entorno para poder hacer esto con NodeJs utilizamos DotEnv que nos permite establecer nuestras variables de entorno en un fichero .env que por motivos de seguridad no se subirá nunca al github.



## JSDOC
Como todo proyecto es necesario mantener una documentación del mismo ya que mientras más vas desarrollando el código mas complicado se hace estar al tanto de todos los recursos y implementaciónes vas haciendo, para esta tarea utilizamos JsDoc que por medio de los comentarios que se van realizando mientras desarrollamos el código nos permite generar la documentación con un simple comando.



## OTROS MODULOS


Hay otros módulos que si bien su uso no es tan remarcable los utilizamos para mejorar el proceso de desarrollo como Morgan que nos permite ver las peticiones que se hacen al servidor NodeJs, Nodemon que nos permite reiniciar el servidor cada vez que hay un cambio en el código que para los que desarrollaron alguna vez en NodeJs sabrán lo útil que puede resultar , cookie-parser que es un middleware que nos permite procesar las cookies que se mande al servidor, Path que nos permite crear rutas que sean validas sin importar el sistema en el que se corra el servidor.



## MONGODB
Utilizando el MongoDb Atlas que nos permite crear una base de datos en Cloud-Hosted para guardar los registros de los proyectos y las publicaciones.

Para crear conexión de la base de datos se utiliza el modulo mongoose que nos permite realizar la conexión con el MongoDb Attlas.

Como un extra para desarrollar el proyecto en un entorno de desarrollo no es correcto utilizar la base de datos principal ya que pueden surgir problemas o se añadirán muchos registros basura que no es correcto mostrar en la pagina en producción, para solventar este problema utilizamos una base de datos en local que se corre en un contenedor docker de esta forma cuando la página web se corre en desarrollo se conecta con esta base de datos.



## CLOUDYNARY
Para almacenar las imagenes esta integrado el servicio de cloudynary para almacenar imágenes en la nube. 

Para poder subir las imagenes al servidor NodeJs utilizamos el modulo de Multer que nos permite subir las imágenes y guardarlas en el servidor, las imágenes se cargan al servidor NodeJs en Base64 donde Multer nos ayuda a procesar los formularios y con otro modulo Streamifier los cargamos directamente a los servidores de Cloudinary.



## BOOTSTRAP
Utilizamos bootstrap para poder darle un estilo base a la pagina web y principalmente para añadir un diseño responsive para la página.



## VERCEL 
Y para su desplegué de la pagina web aprovechando los servicios gratuitos estoy utilizando Vercel. 
