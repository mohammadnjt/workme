import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
})

// import { defineConfig, loadEnv } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'
// import dynamicImport from 'vite-plugin-dynamic-import'

// // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => {
//     const env = loadEnv(mode, path.join(process.cwd(), ''))

//     return {
//         plugins: [react(), dynamicImport()],
//         assetsInclude: ['**/*.md'],
//         resolve: {
//             alias: {
//                 '@': path.join(__dirname, 'src'),
//             },
//         },
//         server: {
//             proxy: {
//                 '/api': {
//                     secure: false,
//                     changeOrigin: true,
//                     target: env.VITE_API_BASE_URL,
//                     rewrite: (path) => path.replace('/api', ''),
//                 },
//                 '/brsapi': {
//                     secure: false,
//                     changeOrigin: true,
//                     target: env.VITE_BRS_API_BASE_URL,
//                     rewrite: (path) => path.replace('/brsapi', ''),
//                 },
//             },
//         },
//         build: {
//             outDir: 'build',
//         },
//     }
// })
