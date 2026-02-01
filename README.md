# taskboard
Este proyecto es una aplicacion donde los usuarios pueden ver una lista de tareas y añadir las que quieran a su propio workspace. Solo se pueden añadir tareas que no estén finalizadas. Se usa firebase store y pinia para agregar las tareas. Se usa firebase authentication para la autenticación de usuarios. Para la petición a la api se usa axios. Cada usuario tiene su propio espacio, donde se guardan las tareas que ha añadido, y estas se mantienen aunque se recargue la página. En la vista de workspace solo se muestran las tareas que pertenecen a ese usuario.
Para ejecutar en local hay que hacer npm install, npm run format y npm run dev. Antes del run dev hay que instalar firebase, tailwind, axios y dotenv.
La base de datos está organizada en una colección users. Cada documento representa a un usuario de la aplicación y se identifica con su uid. Dentro del documento está el campo llamado tasks, que es una lista de tareas. Cada tarea tiene el id de la tarea, el texto de la tarea y si la tarea está finalizada o no.

enlace a vercel: taskboard-opal.vercel.app


