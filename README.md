# Sistema de Gestión de Productos

## Requisitos Previos

- Node.js (v14 o superior)
- npm
- MySQL Server
- Elasticsearch (v8.x)

## Instalación

1. Clonar el repositorio
```bash
git clone <url-repositorio>
cd sistema-gestion-productos
```

2. Configurar base de datos MySQL
```sql
CREATE DATABASE integration_db;
USE integration_db;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. Configurar variables de entorno

Crear archivo `.env` en el directorio backend:
```env
MYSQL_HOST=localhost
MYSQL_USER=tu_usuario_mysql
MYSQL_PASSWORD=tu_password_mysql
MYSQL_DATABASE=integration_db
ELASTIC_NODE=https://elastic:123456@localhost:9200
ELASTIC_INDEX=products
PORT=3001
```

4. Instalar dependencias
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

## Ejecución

1. Iniciar MySQL Server y Elasticsearch

2. Iniciar backend
```bash
cd backend
npm run dev
```

3. Iniciar frontend
```bash
cd frontend
npm start
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- API Backend: http://localhost:3001