import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap() {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    console.log({ PUBLISHABLE_API_KEY })
    // Déclarer response en dehors du bloc try pour qu'il soit accessible partout
    let response: { regions?: HttpTypes.StoreRegion[] } = {};
    
    try {
      // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
      response = await fetch(`${BACKEND_URL}/store/regions`, {
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY!,
        },
        next: {
          revalidate: 3600,
          tags: ["regions"],
        },
      }).then((res) => res.json())
      
      const regions = response.regions

      if (!regions?.length) {
        // Utiliser des régions par défaut si aucune région n'est trouvée
        console.warn("No regions found in Medusa, using default regions")
        const defaultRegions = [
          {
            id: "reg_france",
            name: "France",
            currency_code: "eur",
            countries: [{ id: "fr", iso_2: "fr", display_name: "France" }],
          },
          {
            id: "reg_usa",
            name: "United States",
            currency_code: "usd",
            countries: [{ id: "us", iso_2: "us", display_name: "United States" }],
          },
          {
            id: "reg_australia",
            name: "Australia",
            currency_code: "aud",
            countries: [{ id: "au", iso_2: "au", display_name: "Australia" }],
          },
          {
            id: "reg_austria",
            name: "Austria",
            currency_code: "eur",
            countries: [{ id: "at", iso_2: "at", display_name: "Austria" }],
          },
        ]
        
        defaultRegions.forEach((region) => {
          region.countries?.forEach((c) => {
            regionMapCache.regionMap.set(c.iso_2 ?? "", region)
          })
        })
        
        regionMapCache.regionMapUpdated = Date.now()
        return regionMapCache.regionMap
      }
    } catch (error) {
      console.error("Error fetching regions:", error)
      // En cas d'erreur, utiliser les régions par défaut
      const defaultRegions = [
        {
          id: "reg_france",
          name: "France",
          currency_code: "eur",
          countries: [{ id: "fr", iso_2: "fr", display_name: "France" }],
        },
        {
          id: "reg_usa",
          name: "United States",
          currency_code: "usd",
          countries: [{ id: "us", iso_2: "us", display_name: "United States" }],
        },
      ]
      
      defaultRegions.forEach((region) => {
        region.countries?.forEach((c) => {
          regionMapCache.regionMap.set(c.iso_2 ?? "", region)
        })
      })
      
      regionMapCache.regionMapUpdated = Date.now()
      return regionMapCache.regionMap
    }

    // Create a map of country codes to regions.
    if (response && response.regions) {
      response.regions.forEach((region: HttpTypes.StoreRegion) => {
        region.countries?.forEach((c) => {
          regionMapCache.regionMap.set(c.iso_2 ?? "", region)
        })
      })
    }

    regionMapCache.regionMapUpdated = Date.now()
  }

  return regionMapCache.regionMap
}

/**
 * Fetches regions from Medusa and sets the region cookie.
 * @param request
 * @param response
 */
async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value
    }

    return countryCode
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a NEXT_PUBLIC_MEDUSA_BACKEND_URL environment variable?"
      )
    }
  }
}

/**
 * Middleware to handle region selection and onboarding status.
 */
export async function middleware(request: NextRequest) {
  const regionMap = await getRegionMap()
  const countryCode = regionMap && (await getCountryCode(request, regionMap))

  const urlHasCountryCode =
    countryCode && request.nextUrl.pathname.split("/")[1].includes(countryCode)

  // check if one of the country codes is in the url
  if (urlHasCountryCode) {
    return NextResponse.next()
  }

  const redirectPath =
    request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname

  const queryString = request.nextUrl.search ? request.nextUrl.search : ""

  let redirectUrl = request.nextUrl.href

  let response = NextResponse.redirect(redirectUrl, 307)

  // If no country code is set, we redirect to the relevant region.
  if (!urlHasCountryCode && countryCode) {
    redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`
    response = NextResponse.redirect(`${redirectUrl}`, 307)
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|favicon.ico|_next/image|images|robots.txt).*)",
  ],
}
