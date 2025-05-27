import React from "react"
import Image from "next/image"
import { CollectionsSection } from "@/components/CollectionsSection"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { NewsletterForm } from "@/components/NewsletterForm"

// Composant pour la section des types de produits
const ProductTypesSection: React.FC = () => {
  // Types de produits statiques pour éviter les appels d'API problématiques
  const productTypes = [
    { id: "sofas", value: "Sofas", image: "/images/content/sofa-example.jpg" },
    { id: "arm-chairs", value: "Arm Chairs", image: "/images/content/armchair-example.jpg" }
  ]

  return (
    <Layout className="mb-26 md:mb-36 max-md:gap-x-2">
      <LayoutColumn>
        <h3 className="text-md md:text-2xl mb-8 md:mb-15">Our products</h3>
      </LayoutColumn>
      {productTypes.map((productType, index) => (
        <LayoutColumn
          key={productType.id}
          start={index % 2 === 0 ? 1 : 7}
          end={index % 2 === 0 ? 7 : 13}
        >
          <LocalizedLink href={`/fr/store?type=${productType.value}`}>
            <div className="mb-2 md:mb-8 bg-gray-200 aspect-[4/3]">
              {/* Placeholder pour l'image, remplacez par la vraie image si disponible */}
              <div className="w-full h-full flex items-center justify-center">
                {productType.value}
              </div>
            </div>
            <p className="text-xs md:text-md">{productType.value}</p>
          </LocalizedLink>
        </LayoutColumn>
      ))}
    </Layout>
  )
}

export default function HomePage() {
  return (
    <>
      <div className="max-md:pt-18">
        <Image
          src="/images/content/living-room-gray-armchair-two-seater-sofa.png"
          width={2880}
          height={1500}
          alt="Living room with gray armchair and two-seater sofa"
          className="md:h-screen md:object-cover"
          priority
        />
      </div>
      <div className="pt-8 pb-26 md:pt-26 md:pb-36">
        <Layout className="mb-26 md:mb-36">
          <LayoutColumn start={1} end={{ base: 13, md: 8 }}>
            <h3 className="text-md max-md:mb-6 md:text-2xl">
              Elevate Your Living Space with Unmatched Comfort 
            </h3>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, md: 9 }} end={13}>
            <div className="flex items-center h-full">
              <div className="md:text-md">
                <p>Discover Your Perfect Sofa Today</p>
                <LocalizedLink href="/fr/store" variant="underline">
                  Explore Now
                </LocalizedLink>
              </div>
            </div>
          </LayoutColumn>
        </Layout>
        
        {/* Section des types de produits */}
        <ProductTypesSection />
        
        {/* Section des collections */}
        <CollectionsSection className="mb-22 md:mb-36" />
        
        {/* Section À propos */}
        <Layout>
          <LayoutColumn className="col-span-full">
            <h3 className="text-md md:text-2xl mb-8 md:mb-16">
              About Sofa Society
            </h3>
            <div className="bg-gray-200 aspect-[16/9] mb-8 md:mb-16 flex items-center justify-center">
              <p>Image: Gray sofa against concrete wall</p>
            </div>
          </LayoutColumn>
          <LayoutColumn start={1} end={{ base: 13, md: 7 }}>
            <h2 className="text-md md:text-2xl">
              At Sofa Society, we believe that a sofa is the heart of every
              home.
            </h2>
          </LayoutColumn>
          <LayoutColumn
            start={{ base: 1, md: 8 }}
            end={13}
            className="mt-6 md:mt-19"
          >
            <div className="md:text-md">
              <p className="mb-5 md:mb-9">
                We are dedicated to delivering high-quality, thoughtfully
                designed sofas that merge comfort and style effortlessly.
              </p>
              <p className="mb-5 md:mb-3">
                Our mission is to transform your living space into a sanctuary
                of relaxation and beauty, with products built to last.
              </p>
              <LocalizedLink href="/fr/about" variant="underline">
                Read more about Sofa Society
              </LocalizedLink>
            </div>
          </LayoutColumn>
        </Layout>
        
        {/* Section newsletter */}
        <div className="py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <NewsletterForm className="max-w-md mx-auto" />
          </div>
        </div>
      </div>
    </>
  )
}
