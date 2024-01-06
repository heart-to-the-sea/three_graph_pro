import { defineConfig, loadEnv } from "vite";
import NodeGlobal from '@esbuild-plugins/node-globals-polyfill'
import NodeModules from '@esbuild-plugins/node-modules-polyfill'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
export default defineConfig(({mode}) => {
  loadEnv(mode,process.cwd())
  return {
    optimizeDeps:{
      esbuildOptions: {
        define:{
          global:'globalThis'
        },
        plugins:[
          NodeGlobal({}),
          NodeModules()
        ]
      }
    },
    build:{
      minify:false,
      rollupOptions:{
        plugins:[
          rollupNodePolyFill()
        ]
      }
    }
  }
})