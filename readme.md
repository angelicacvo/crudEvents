# Crudevents

**Coder:** Angélica María Cuervo  
**Clan:** Clan Ritchie  
**Correo:** angiemarin0707@gmail.com 
**Documento de identidad:** 1152225348 
**Repositorio GitHub:**   

---

## Descripción del Proyecto

Event crud es una aplicación web desarrollada como una Single Page Application (SPA) que permite a usuarios registrarse, iniciar sesión, visualizar eventos y, según su rol, gestionarlos completamente. Está desarrollada con JavaScript Vanilla, HTML5, CSS3 y `json-server` para la persistencia de datos.

---

## Instrucciones para ejecutar el proyecto

1. Clona el repositorio:
```bash
git clone https://github.com/angelicacvo/crudevents
cd crudevents
```

2. Instala json-server (si no lo tienes instalado globalmente):
```bash
npm install json-server
```

3. Ejecuta el servidor JSON:
```bash
npx json-server db.sjon
```

4. Abre el archivo `index.html` en tu navegador o utiliza Live Server si estás trabajando en VS Code.

---

## Criterios de Aceptación

### Funcionalidad Completa
- Registro e inicio de sesión de usuarios.
- Navegación condicional según el rol del usuario.
- Administradores pueden crear, editar y eliminar eventos.
- Visitantes pueden visualizar y registrarse a eventos.

### Persistencia de Sesión
- La sesión se mantiene activa entre recargas usando sessionStorage.

### Consistencia de Datos
- Todas las operaciones CRUD se sincronizan correctamente con `json-server`.

### Interfaz de Usuario
- Diseño responsivo.
- Navegación fluida entre vistas sin recarga de página.

### Entrega y Documentación
- Archivos organizados.
- Código comentado.

### Tipos de Usuarios

#### a. Administrador
- Usuario por defecto con rol "admin" en `db.json`.
- Puede crear, editar y eliminar eventos.

#### b. Visitante
- Puede registrarse en eventos si hay cupo disponible.
- Puede visualizar eventos en los que ya se registró.

### 7. Lógica de Rutas
- Usuarios no autenticados son redirigidos a `/home` si acceden a rutas privadas.
- Usuarios autenticados no pueden acceder a `/login` o `/register` y son redirigidos a `/dashboard`.

### 8. Vistas Implementadas
- `/home` → Home
- `/admin` → Admin
- `/login` → Login
- `/register` → Register

---

## Estructura del Repositorio

- `/src`: Contiene las vistas, servicios, utilidades y componentes.
- `/db.json`: Archivo de base de datos con usuarios y eventos.
- `/assets`: Imágenes y estilos.
- `index.html`: Punto de entrada de la SPA.

---

## Recursos adicionales

- Archivo `db.json` configurado para `json-server`.

---

## POSTMAN
coleccion de endopoints
search all users: http://localhost:3000/users
search user by id: http://localhost:3000/users/b81b
search by role: http://localhost:3000/users/?role=admin



