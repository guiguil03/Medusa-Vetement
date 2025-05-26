import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"

export const listRegions = async function () {
  try {
    return await sdk.client
      .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
        method: "GET",
        next: { tags: ["regions"] },
        cache: "force-cache",
      })
      .then(({ regions }) => regions)
  } catch (error) {
    console.error("Erreur lors de la récupération des régions:", error)
    // Retourner un tableau avec les régions configurées dans Medusa
    return [
      {
        id: "reg_france",
        name: "France",
        currency_code: "eur",
        countries: [{ 
          id: "fr_country",
          iso_2: "fr", 
          display_name: "France"
        }]
      },
      {
        id: "reg_usa",
        name: "United States",
        currency_code: "usd",
        countries: [{ 
          id: "us_country",
          iso_2: "us", 
          display_name: "United States"
        }]
      },
      {
        id: "reg_australia",
        name: "Australia",
        currency_code: "aud",
        countries: [{ 
          id: "au_country",
          iso_2: "au", 
          display_name: "Australia"
        }]
      },
      {
        id: "reg_austria",
        name: "Austria",
        currency_code: "eur",
        countries: [{ 
          id: "at_country",
          iso_2: "at", 
          display_name: "Austria"
        }]
      }
    ] as HttpTypes.StoreRegion[]
  }
}

export const retrieveRegion = async function (id: string) {
  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next: { tags: [`regions`] },
      cache: "force-cache",
    })
    .then(({ region }) => region)
    .catch(medusaError)
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = async function (countryCode: string) {
  try {
    if (regionMap.has(countryCode)) {
      return regionMap.get(countryCode)
    }

    const regions = await listRegions()

    if (!regions) {
      return null
    }

    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        regionMap.set(c?.iso_2 ?? "", region)
      })
    })

    const region = countryCode
      ? regionMap.get(countryCode)
      : regionMap.get("us")

    return region
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return null
  }
}
