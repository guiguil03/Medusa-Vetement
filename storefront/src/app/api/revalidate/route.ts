import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// Fonction GET pour la revalidation manuelle à partir du navigateur
export async function GET() {
  try {
    // Revalider tous les tags importants
    await revalidateTag("products");
    await revalidateTag("collections");
    await revalidateTag("regions");
    
    // Revalider aussi les chemins complets
    await revalidatePath("/fr");
    await revalidatePath("/fr/store");
    
    console.log("Revalidation manuelle réussie via GET");
    
    return NextResponse.json({
      revalidated: true,
      message: "Toutes les données ont été actualisées avec succès"
    });
  } catch (error) {
    console.error("Erreur lors de la revalidation manuelle:", error);
    return NextResponse.json({ 
      message: `Erreur: ${error}` 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const searchParams = new URL(req.url).searchParams
    const secret = searchParams.get("secret")

    // Vérification du secret pour sécuriser l'endpoint (optionnel pour les requêtes manuelles)
    if (secret && secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: "Secret invalide" }, { status: 401 })
    }

    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json(
        { message: "Type d'événement et données requis" },
        { status: 400 }
      )
    }

    console.log(`Reçu un événement de type ${type} avec les données:`, data)

    // Revalider tous les tags pertinents
    await revalidateTag("products")
    await revalidateTag("collections")
    await revalidateTag("regions")
    
    // Revalider des chemins spécifiques
    if (type.startsWith("product")) {
      console.log("Revalidation des tags de produits")
      if (data.id) {
        await revalidateTag(`product-${data.id}`)
        console.log(`Revalidated tag: product-${data.id}`)
      }
    } else if (type.startsWith("collection")) {
      console.log("Revalidation des tags de collections")
      if (data.id) {
        await revalidateTag(`collection-${data.id}`)
        console.log(`Revalidated tag: collection-${data.id}`)
      }
    }

    // Revalider aussi le chemin complet
    await revalidatePath("/fr")
    await revalidatePath("/fr/store")
    
    console.log("Revalidation complète effectuée avec succès")

    return NextResponse.json({ 
      revalidated: true, 
      message: "Tous les tags et chemins ont été revalidés avec succès" 
    })
  } catch (err) {
    console.error("Erreur de revalidation:", err)
    return NextResponse.json(
      { message: `Erreur lors de la revalidation: ${err}` },
      { status: 500 }
    )
  }
}
