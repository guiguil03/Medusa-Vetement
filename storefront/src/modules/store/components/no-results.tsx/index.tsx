"use client"

import { LayoutColumn } from "@/components/Layout"
import { Link } from "@/components/Link"
import { usePathname } from "next/navigation"

export const NoResults = ({ error }: { error?: string }) => {
  const pathname = usePathname()

  return (
    <LayoutColumn className="pt-28">
      <div className="flex justify-center flex-col items-center">
        <div className="text-center">
          <p className="text-xl font-medium mb-2">Aucun produit trouvé!</p>
          <p className="text-sm text-gray-500 mb-4">
            Essayez d&apos;ajuster les filtres ou vérifiez que vous avez ajouté des produits dans l&apos;administration Medusa.
          </p>
        </div>
        
        {error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mt-4 max-w-md text-left">
            <p className="font-medium">Erreur lors du chargement des produits:</p>
            <p className="text-sm">{error}</p>
            <p className="text-sm mt-2">
              Vérifiez que votre serveur Medusa est en cours d&apos;exécution sur le port 9000 et que vous avez ajouté des produits dans l&apos;administration Medusa.
            </p>
          </div>
        ) : (
          <Link
            scroll={false}
            href={pathname}
            variant="underline"
            className="inline-flex md:pb-0"
          >
            Effacer les filtres
          </Link>
        )}
      </div>
    </LayoutColumn>
  )
}
