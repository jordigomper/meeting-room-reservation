# Hexagonal Architecture con NodeJS y TypeScript - Meeting reservation
Una aplicación básica para poder crear reuniónes dependiendo de la disponibilidad de los usuarios convocados.

- domain: Contiene los dominios de nuestro negocio.
- application: Contiene los casos de uso de nuestro negocio.
- infrastructure: contiente las adaptadores que permiten interactuar o guardar datos de la app.

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
- Lanzar `npm run test` desde el directorio principal de la app.