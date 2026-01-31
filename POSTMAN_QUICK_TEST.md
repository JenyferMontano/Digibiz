# Postman - Pruebas Rápidas

## Configuración: `.env.local`

Crea un archivo `.env.local` en la raíz del proyecto con todas las variables de entorno necesarias (ver SETUP.md para el formato completo).

---

## 🚀 Requests para Probar

### 1. Start Mission (POST)

**URL:**
```
http://localhost:3000/api/start
```

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "businessId": "test-123",
  "businessDescription": "I want to improve my grocery store. We have long waiting times during inventory restocking, and customers complain about delays."
}
```

**Qué hace:** Llama a Assessment Agent → Lean Coach Agent → Execution Agent

---

### 2. Get Progress (GET)

**URL:**
```
http://localhost:3000/api/progress?businessId=test-123
```

**Method:** `GET`

**No Body**

**Qué hace:** Obtiene el estado del negocio desde Cloudant

---

### 3. Validate Evidence (POST)

**URL:**
```
http://localhost:3000/api/validate
```

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "businessId": "test-123",
  "missionId": "mission_map_process",
  "evidenceData": {
    "type": "process_map",
    "description": "We mapped our inventory restocking process",
    "file_url": "https://example.com/process-map.pdf"
  }
}
```

**Qué hace:** Llama al Validation Agent para validar la evidencia

---

## 📋 Flujo de Prueba Recomendado

1. **POST /api/start** → Debe ejecutar los 3 agentes
2. **GET /api/progress** → Debe mostrar el negocio con `activeMission` y `steps`
3. **POST /api/validate** → Debe validar y actualizar `completedMissions`
4. **GET /api/progress** → Debe mostrar la misión completada

---

## 🔍 Qué Revisar

- **Consola del servidor:** Debe mostrar logs de cada agente llamado
- **Respuesta de Postman:** Debe tener `success: true` y los datos del agente
- **Cloudant:** Los documentos deben actualizarse con `steps`, `assessment`, `mission`, `execution`

---

## ⚠️ Si hay errores

- **404:** Verifica que los agentes estén deployados
- **401:** Verifica que `.env.local` tenga las credenciales correctas
- **500:** Revisa la consola del servidor para ver el error específico

