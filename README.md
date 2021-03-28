# Hexagonal Architecture con NodeJS y TypeScript - Meeting reservation
Una aplicación básica para poder crear reuniónes dependiendo de la disponibilidad de los usuarios convocados.

- Domain: Contiene toda la lógica del negocio.
- Interactors: Casos de uso de nuestro negocio.

Inputs and Outputs
- DataSource: Adaptadores que conectan posibilitan interactuar con diferentes base de datos o otros servicios.
- DataAccess: Conexión que nos permite acceder a esos datos.

## Getting started in dev mode
- Requiere tener instalado `docker y docker-composer`.

- Clonar este repo:
`git clone https://github.com/jordigomper/meeting-room-reservation`

- Crear una instancia docker de la app:
`docker-compose build`

- Levantar la aplicación:
`docker-compose up`

- La app ya está levantada y se puede hacer peticiones mediante `localhost:8081`.

- Dentro del directorio root hay un archivo llamado `postman_collection.json` que se puede importar en postman y contiene un ejemplo de cada uno de los endpoints habilitados.

## Testing
- Abrir una consola
- Lanzar el comando: `docker exec -it meet-api-express bash` para abrir una consola dentro del contenedor.
- Ahora lanzar el comando `npm run test` y se ejecutará la batería de tests.