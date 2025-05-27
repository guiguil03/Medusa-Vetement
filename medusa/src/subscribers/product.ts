import { EventBusService } from "@medusajs/medusa"
import axios from "axios"

type InjectedDependencies = {
  eventBusService: EventBusService
}

class ProductSubscriber {
  private eventBusService: EventBusService
  private frontendUrl: string
  private webhookSecret: string

  constructor({ eventBusService }: InjectedDependencies) {
    this.eventBusService = eventBusService
    
    // URL de votre frontend (à mettre à jour selon votre configuration)
    this.frontendUrl = process.env.FRONTEND_URL || "http://localhost:8000"
    
    // Secret pour sécuriser le webhook (doit correspondre à REVALIDATE_SECRET dans le frontend)
    this.webhookSecret = process.env.WEBHOOK_SECRET || ""
  }

  static getSubscribedEvents(): Record<string, string> {
    return {
      "product.created": "handleProductCreated",
      "product.updated": "handleProductUpdated",
      "product.deleted": "handleProductDeleted"
    }
  }
  
  static getConfig() {
    return {
      subscribe_to_external_events: true,
    }
  }

  async handleProductCreated(data: Record<string, any>): Promise<void> {
    return this.sendWebhook(data, "product.created")
  }

  async handleProductUpdated(data: Record<string, any>): Promise<void> {
    return this.sendWebhook(data, "product.updated")
  }

  async handleProductDeleted(data: Record<string, any>): Promise<void> {
    return this.sendWebhook(data, "product.deleted")
  }

  private async sendWebhook(data: Record<string, any>, eventName: string): Promise<void> {
    try {
      // Construire l'URL de l'API de revalidation avec le secret
      const revalidateUrl = `${this.frontendUrl}/api/revalidate?secret=${this.webhookSecret}`
      
      // Envoyer les données de l'événement à l'API de revalidation
      await axios.post(revalidateUrl, {
        type: eventName,
        data: {
          id: data.id
        }
      })
      
      console.log(`Webhook sent for ${eventName}`)
    } catch (error) {
      console.error(`Failed to send webhook for ${eventName}:`, error)
    }
  }
}

export default ProductSubscriber
