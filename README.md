# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## OMDB API Key

This project uses the [OMDB API](https://www.omdbapi.com/) to fetch movie data. The free key included in the code may quickly hit usage limits or return 401 Unauthorized errors. To avoid this:

1. Register for your own key at https://www.omdbapi.com/apikey.aspx
2. Create a `.env` file in the project root containing:
   ```
   VITE_OMDB_KEY=your_new_api_key_here
   ```
3. Restart the development server (`npm run dev`).

If you continue seeing `401` responses, your key is invalid or expired. Keep your key private and do not commit `.env` to version control.
