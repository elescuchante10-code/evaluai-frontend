# EvaluAI Frontend

React frontend para EvaluAI Profesor

## 🚀 Deploy en GitHub Pages (Gratuito)

### Paso 1: Subir a GitHub

```bash
cd frontend
git init
git add .
git commit -m "Frontend v1.0"
git remote add origin https://github.com/elescuchante10-code/evaluai-frontend.git
git push -u origin main
```

### Paso 2: Instalar dependencias y hacer deploy

```bash
# Instalar dependencias
npm install

# Hacer deploy a GitHub Pages
npm run deploy
```

Esto creará automáticamente la rama `gh-pages` y desplegará la app.

### Paso 3: Configurar GitHub Pages

1. Ve a tu repositorio en GitHub: `https://github.com/elescuchante10-code/evaluai-frontend`
2. Ve a **Settings** → **Pages**
3. En "Source", selecciona la rama `gh-pages`
4. Click en **Save**
5. Espera 1-2 minutos y tu app estará en:
   ```
   https://elescuchante10-code.github.io/evaluai-frontend
   ```

### Paso 4: Configurar variable de entorno (Backend)

El backend ya está configurado en `App.js`:
```javascript
const API_URL = 'https://web-production-83f44.up.railway.app';
```

Si necesitas cambiarlo, modifica la línea 4 en `src/App.js`.

---

## 🔄 Actualizar el deploy

Cada vez que hagas cambios:

```bash
# Hacer commit de los cambios
git add .
git commit -m "Descripción de cambios"
git push

# Redeployar
npm run deploy
```

---

## 💻 Desarrollo local

```bash
npm install
npm start
```

Abre http://localhost:3000

---

## 📁 Estructura del proyecto

```
frontend/
├── public/
│   └── index.html          # HTML base
├── src/
│   ├── App.js              # Componente principal
│   └── index.js            # Punto de entrada
├── package.json            # Dependencias y scripts
└── README.md               # Este archivo
```

---

## ⚠️ Notas importantes

- GitHub Pages sirve sitios estáticos, el backend debe estar desplegado por separado (Railway)
- El primer deploy puede tardar 1-2 minutos en estar disponible
- Si ves errores 404, verifica que la URL en `package.json` → `homepage` sea correcta
