# 🍽️ Eatsy - Mobile App

**Eatsy** es una aplicación móvil desarrollada con **React Native** y **Expo**, pensada para ofrecer una experiencia intuitiva, rápida y multiplataforma. Utiliza **Bun** como gestor de paquetes moderno y eficiente.

---

## ✨ Requisitos Previos

1. Tener instalado [Bun](https://bun.sh/)
2. (Opcional) Tener configurado un emulador Android o iOS 
   👉 Consulta la guía oficial de Expo para configurar tu entorno:  
   [Configurar entornos de desarrollo en Expo](https://docs.expo.dev/workflow/android-studio-emulator/)

---

## 📦 Instalación

```bash
bun install
```

---

## ▶️ Ejecución

### Iniciar la app:

```bash
bun run start
```

### Ejecutar en emuladores (requiere configuración previa):

```bash
bun run android     # Android
bun run ios         # iOS
bun run web         # Web
```

> 📱 Alternativa rápida: Escanea el código QR con la app **Expo Go** en tu dispositivo móvil para ver la app sin emulador.

---

## 🩹 Comandos Útiles

```bash
bun run lint        # Ejecuta ESLint para verificar errores de estilo y sintaxis
```

---

## 👨‍💻 Scripts disponibles

```json
"scripts": {
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "lint": "eslint ."
}
```

---

## 📂 Estructura del Proyecto

La estructura de directorios y archivos de tu proyecto se muestra a continuación:

```
/src
  /app
    / (tabs)           # Vistas principales de la app
      index.tsx        # Vista principal de la app
    / (screen)         # Ejemplo de otras vistas agrupadas por contexto
    _layout.tsx        # Layout general de la app
    not-found.tsx      # Pantalla para rutas no encontradas

  /assets
    /images
    /icons
    ...

  /components
    /ui                # Componentes reutilizables de interfaz
    /svg               # Iconos SVG personalizados
    ...

  /hooks               # Custom hooks
```

<!-- podrías hacer una sección de las reglas de estilo de la estructura de directorios -->

> 📝 Reglas de estilo
> - Nombres de archivos y directorios en kebab-case, separados por guiones (**-**).

---

## 📲 Tecnologías Usadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Bun](https://bun.sh/)
- [TypeScript](https://www.typescriptlang.org/) (opcional)
- [ESLint](https://eslint.org/)

---

## 📌 Notas

- Asegúrate de tener tu emulador funcionando antes de usar `bun run android` o `bun run ios`.
- Usa **Expo Go** para probar rápidamente en dispositivos reales.

