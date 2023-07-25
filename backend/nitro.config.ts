import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  // Nitro options
  routeRules: {
    "/**": {
        cors: true
    }
  }, rollupConfig: {
    onwarn(warning, rollupWarn) {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      rollupWarn(warning)
    }
  }
})