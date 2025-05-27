import Medusa from "@medusajs/js-sdk"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

// Clé API par défaut à utiliser si celle de l'environnement n'est pas disponible
const DEFAULT_KEY = "pk_bdb1857e9b7e180acb8086db2960e101f153e097a194c7145dae051c28f9ecee"

// Utiliser la clé API de l'environnement ou la clé par défaut
const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || DEFAULT_KEY

// Afficher des informations de débogage
console.log("Medusa configuration:")
console.log("- Backend URL:", MEDUSA_BACKEND_URL)
console.log("- Using publishable key:", publishableKey ? "Key is set" : "No key found")

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: true, // Activer le débogage pour voir les requêtes API
  publishableKey: publishableKey,
})
