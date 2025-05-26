import * as React from "react"
import { HttpTypes } from "@medusajs/types"
import { listRegions } from "@lib/data/regions"
import { SearchField } from "@/components/SearchField"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { HeaderDrawer } from "@/components/HeaderDrawer"
import { RegionSwitcher } from "@/components/RegionSwitcher"
import { HeaderWrapper } from "@/components/HeaderWrapper"

import dynamic from "next/dynamic"

const LoginLink = dynamic(
  () => import("@modules/header/components/LoginLink"),
  { loading: () => <></> }
)

const CartDrawer = dynamic(
  () => import("@/components/CartDrawer").then((mod) => mod.CartDrawer),
  { loading: () => <></> }
)

export const Header: React.FC = async () => {
  // Récupérer les régions et gérer les erreurs
  let regions: HttpTypes.StoreRegion[] = []
  let countryOptions: Array<{ country: string; region: string; label: string }> = []
  
  try {
    regions = await listRegions()
    
    countryOptions = regions
      .map((r: HttpTypes.StoreRegion) => {
        return (r.countries ?? []).map((c: HttpTypes.StoreRegionCountry) => ({
          country: c.iso_2 || "",  // Garantir que country n'est jamais undefined
          region: r.id,
          label: c.display_name || "",  // Garantir que label n'est jamais undefined
        }))
      })
      .flat()
      .sort((a, b) => (a.label).localeCompare(b.label))
  } catch (error) {
    console.error("Erreur lors de la récupération des régions:", error)
    // Utiliser des options par défaut en cas d'erreur
    countryOptions = [
      { country: "fr", region: "reg_france", label: "France" },
      { country: "us", region: "reg_usa", label: "United States" },
      { country: "at", region: "reg_austria", label: "Austria" },
      { country: "au", region: "reg_australia", label: "Australia" }
    ]
  }

  return (
    <>
      <HeaderWrapper>
        <Layout>
          <LayoutColumn>
            <div className="flex justify-between items-center h-18 md:h-21">
              <h1 className="font-medium text-md">
                <LocalizedLink href="/">SofaSocietyCo.</LocalizedLink>
              </h1>
              <div className="flex items-center gap-8 max-md:hidden">
                <LocalizedLink href="/about">About</LocalizedLink>
                <LocalizedLink href="/inspiration">Inspiration</LocalizedLink>
                <LocalizedLink href="/store">Shop</LocalizedLink>
              </div>
              <div className="flex items-center gap-3 lg:gap-6 max-md:hidden">
                <RegionSwitcher
                  countryOptions={countryOptions}
                  className="w-16"
                  selectButtonClassName="h-auto !gap-0 !p-1 transition-none"
                  selectIconClassName="text-current"
                />
                <React.Suspense>
                  <SearchField countryOptions={countryOptions} />
                </React.Suspense>
                <LoginLink className="p-1 group-data-[light=true]:md:text-white group-data-[sticky=true]:md:text-black" />
                <CartDrawer />
              </div>
              <div className="flex items-center gap-4 md:hidden">
                <LoginLink className="p-1 group-data-[light=true]:md:text-white" />
                <CartDrawer />
                <React.Suspense>
                  <HeaderDrawer countryOptions={countryOptions} />
                </React.Suspense>
              </div>
            </div>
          </LayoutColumn>
        </Layout>
      </HeaderWrapper>
    </>
  )
}
