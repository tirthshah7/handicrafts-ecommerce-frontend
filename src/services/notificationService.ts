import { api } from '../utils/api';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
}

export interface NotificationRequest {
  to: string;
  templateId: string;
  data: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: string;
    contentType: string;
  }>;
}

export interface NotificationResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class NotificationService {
  // Email templates
  private static templates: Record<string, EmailTemplate> = {
    'order-confirmation': {
      id: 'order-confirmation',
      name: 'Order Confirmation',
      subject: 'Order Confirmed - {{orderNumber}} | Handicrafts E-commerce',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
            .order-details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .item:last-child { border-bottom: none; }
            .total { font-weight: bold; font-size: 18px; color: #059669; }
            .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .status-badge { display: inline-block; background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Order Confirmed!</h1>
              <p>Thank you for your purchase, {{customerName}}!</p>
            </div>
            
            <div class="content">
              <h2>Order Details</h2>
              <div class="order-details">
                <p><strong>Order Number:</strong> {{orderNumber}}</p>
                <p><strong>Order Date:</strong> {{orderDate}}</p>
                <p><strong>Status:</strong> <span class="status-badge">{{orderStatus}}</span></p>
                <p><strong>Payment Status:</strong> <span class="status-badge">{{paymentStatus}}</span></p>
              </div>

              <h3>Items Ordered</h3>
              {{#each items}}
              <div class="item">
                <div>
                  <strong>{{name}}</strong><br>
                  <small>Category: {{category}}</small>
                </div>
                <div>
                  Qty: {{quantity}}<br>
                  ₹{{price}} each
                </div>
              </div>
              {{/each}}

              <div class="item total">
                <div>Total Amount:</div>
                <div>₹{{totalAmount}}</div>
              </div>

              <h3>Delivery Address</h3>
              <div class="order-details">
                <p><strong>{{address.name}}</strong></p>
                <p>{{address.street}}</p>
                <p>{{address.city}}, {{address.state}} - {{address.pincode}}</p>
                <p>{{address.country}}</p>
                <p><strong>Phone:</strong> {{address.phone}}</p>
              </div>

              <p>We'll send you another email when your order ships. You can track your order status anytime.</p>
              
              <a href="{{trackingUrl}}" class="button">Track Your Order</a>
            </div>
            
            <div class="footer">
              <p>Questions? Contact us at support@handicrafts-ecommerce.com</p>
              <p>© 2024 Handicrafts E-commerce. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      textContent: `
        Order Confirmed - {{orderNumber}}
        
        Thank you for your purchase, {{customerName}}!
        
        Order Details:
        - Order Number: {{orderNumber}}
        - Order Date: {{orderDate}}
        - Status: {{orderStatus}}
        - Payment Status: {{paymentStatus}}
        
        Items Ordered:
        {{#each items}}
        - {{name}} ({{category}}) - Qty: {{quantity}} × ₹{{price}}
        {{/each}}
        
        Total Amount: ₹{{totalAmount}}
        
        Delivery Address:
        {{address.name}}
        {{address.street}}
        {{address.city}}, {{address.state}} - {{address.pincode}}
        {{address.country}}
        Phone: {{address.phone}}
        
        Track your order: {{trackingUrl}}
        
        Questions? Contact us at support@handicrafts-ecommerce.com
      `
    },
    'order-shipped': {
      id: 'order-shipped',
      name: 'Order Shipped',
      subject: 'Your Order Has Shipped - {{orderNumber}} | Handicrafts E-commerce',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Shipped</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
            .shipping-details { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669; }
            .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚚 Your Order Has Shipped!</h1>
              <p>Great news, {{customerName}}! Your order is on its way.</p>
            </div>
            
            <div class="content">
              <h2>Shipping Details</h2>
              <div class="shipping-details">
                <p><strong>Order Number:</strong> {{orderNumber}}</p>
                <p><strong>Tracking Number:</strong> {{trackingNumber}}</p>
                <p><strong>Carrier:</strong> {{carrier}}</p>
                <p><strong>Estimated Delivery:</strong> {{estimatedDelivery}}</p>
              </div>

              <p>Your package is now in transit and should arrive within the estimated delivery time.</p>
              
              <a href="{{trackingUrl}}" class="button">Track Your Package</a>
              
              <p><strong>What's Next?</strong></p>
              <ul>
                <li>You'll receive updates as your package moves through the delivery network</li>
                <li>We'll notify you when your package is out for delivery</li>
                <li>Once delivered, you'll receive a confirmation email</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>Questions? Contact us at support@handicrafts-ecommerce.com</p>
              <p>© 2024 Handicrafts E-commerce. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      textContent: `
        Your Order Has Shipped - {{orderNumber}}
        
        Great news, {{customerName}}! Your order is on its way.
        
        Shipping Details:
        - Order Number: {{orderNumber}}
        - Tracking Number: {{trackingNumber}}
        - Carrier: {{carrier}}
        - Estimated Delivery: {{estimatedDelivery}}
        
        Track your package: {{trackingUrl}}
        
        What's Next?
        - You'll receive updates as your package moves through the delivery network
        - We'll notify you when your package is out for delivery
        - Once delivered, you'll receive a confirmation email
        
        Questions? Contact us at support@handicrafts-ecommerce.com
      `
    },
    'order-delivered': {
      id: 'order-delivered',
      name: 'Order Delivered',
      subject: 'Order Delivered - {{orderNumber}} | Handicrafts E-commerce',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Delivered</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
            .delivery-details { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669; }
            .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .review-button { background: #f59e0b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Order Delivered!</h1>
              <p>Your order has been successfully delivered, {{customerName}}!</p>
            </div>
            
            <div class="content">
              <h2>Delivery Confirmation</h2>
              <div class="delivery-details">
                <p><strong>Order Number:</strong> {{orderNumber}}</p>
                <p><strong>Delivered On:</strong> {{deliveryDate}}</p>
                <p><strong>Delivered To:</strong> {{deliveryAddress}}</p>
              </div>

              <p>We hope you love your new handicrafts! Your satisfaction is our priority.</p>
              
              <a href="{{reviewUrl}}" class="button review-button">Leave a Review</a>
              <a href="{{shopUrl}}" class="button">Continue Shopping</a>
              
              <p><strong>Need Help?</strong></p>
              <ul>
                <li>If you have any issues with your order, please contact us within 7 days</li>
                <li>We offer a 30-day return policy for most items</li>
                <li>Your feedback helps us improve our products and service</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>Questions? Contact us at support@handicrafts-ecommerce.com</p>
              <p>© 2024 Handicrafts E-commerce. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      textContent: `
        Order Delivered - {{orderNumber}}
        
        Your order has been successfully delivered, {{customerName}}!
        
        Delivery Confirmation:
        - Order Number: {{orderNumber}}
        - Delivered On: {{deliveryDate}}
        - Delivered To: {{deliveryAddress}}
        
        We hope you love your new handicrafts! Your satisfaction is our priority.
        
        Leave a review: {{reviewUrl}}
        Continue shopping: {{shopUrl}}
        
        Need Help?
        - If you have any issues with your order, please contact us within 7 days
        - We offer a 30-day return policy for most items
        - Your feedback helps us improve our products and service
        
        Questions? Contact us at support@handicrafts-ecommerce.com
      `
    },
    'welcome': {
      id: 'welcome',
      name: 'Welcome Email',
      subject: 'Welcome to Handicrafts E-commerce!',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
            .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .feature { display: flex; align-items: center; margin: 15px 0; }
            .feature-icon { width: 40px; height: 40px; background: #f0f9ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Handicrafts E-commerce!</h1>
              <p>Hello {{customerName}}, we're thrilled to have you join our community!</p>
            </div>
            
            <div class="content">
              <p>Thank you for creating an account with us. You now have access to:</p>
              
              <div class="feature">
                <div class="feature-icon">🛍️</div>
                <div>
                  <strong>Exclusive Handicrafts</strong><br>
                  <small>Discover unique jewelry, mandala art, and traditional crafts</small>
                </div>
              </div>
              
              <div class="feature">
                <div class="feature-icon">💝</div>
                <div>
                  <strong>Wishlist & Favorites</strong><br>
                  <small>Save items you love for later</small>
                </div>
              </div>
              
              <div class="feature">
                <div class="feature-icon">📦</div>
                <div>
                  <strong>Order Tracking</strong><br>
                  <small>Track your orders from purchase to delivery</small>
                </div>
              </div>
              
              <div class="feature">
                <div class="feature-icon">🎁</div>
                <div>
                  <strong>Special Offers</strong><br>
                  <small>Get exclusive discounts and early access to new products</small>
                </div>
              </div>
              
              <a href="{{shopUrl}}" class="button">Start Shopping</a>
              
              <p><strong>Need Help?</strong></p>
              <p>Our customer support team is here to help you with any questions or concerns.</p>
            </div>
            
            <div class="footer">
              <p>Questions? Contact us at support@handicrafts-ecommerce.com</p>
              <p>© 2024 Handicrafts E-commerce. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      textContent: `
        Welcome to Handicrafts E-commerce!
        
        Hello {{customerName}}, we're thrilled to have you join our community!
        
        Thank you for creating an account with us. You now have access to:
        
        🛍️ Exclusive Handicrafts
        Discover unique jewelry, mandala art, and traditional crafts
        
        💝 Wishlist & Favorites
        Save items you love for later
        
        📦 Order Tracking
        Track your orders from purchase to delivery
        
        🎁 Special Offers
        Get exclusive discounts and early access to new products
        
        Start shopping: {{shopUrl}}
        
        Need Help?
        Our customer support team is here to help you with any questions or concerns.
        
        Questions? Contact us at support@handicrafts-ecommerce.com
      `
    }
  };

  // Send email notification
  static async sendEmailNotification(request: NotificationRequest): Promise<NotificationResponse> {
    try {
      const template = this.templates[request.templateId];
      if (!template) {
        throw new Error(`Template ${request.templateId} not found`);
      }

      // Replace template variables
      const processedHtml = this.processTemplate(template.htmlContent, request.data);
      const processedText = this.processTemplate(template.textContent, request.data);
      const processedSubject = this.processTemplate(template.subject, request.data);

      const response = await api.sendEmail({
        to: request.to,
        subject: processedSubject,
        htmlContent: processedHtml,
        textContent: processedText,
        attachments: request.attachments
      });

      return {
        success: true,
        messageId: response.data?.messageId
      };
    } catch (error) {
      console.error('Error sending email notification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email'
      };
    }
  }

  // Process template with data
  private static processTemplate(template: string, data: Record<string, any>): string {
    let processed = template;
    
    // Replace simple variables {{variable}}
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, data[key] || '');
    });

    // Process loops {{#each items}}...{{/each}}
    processed = processed.replace(/{{#each\s+(\w+)}}(.*?){{\/each}}/gs, (match, arrayKey, content) => {
      const array = data[arrayKey];
      if (!Array.isArray(array)) return '';
      
      return array.map(item => {
        let itemContent = content;
        Object.keys(item).forEach(key => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          itemContent = itemContent.replace(regex, item[key] || '');
        });
        return itemContent;
      }).join('');
    });

    return processed;
  }

  // Send order confirmation email
  static async sendOrderConfirmation(orderData: any): Promise<NotificationResponse> {
    const data = {
      customerName: orderData.customerDetails.name,
      orderNumber: orderData.orderNumber,
      orderDate: new Date(orderData.createdAt).toLocaleDateString('en-IN'),
      orderStatus: 'Confirmed',
      paymentStatus: 'Paid',
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      address: orderData.customerDetails.address,
      trackingUrl: `${window.location.origin}/order-tracking`
    };

    return this.sendEmailNotification({
      to: orderData.customerDetails.email,
      templateId: 'order-confirmation',
      data
    });
  }

  // Send order shipped email
  static async sendOrderShipped(orderData: any): Promise<NotificationResponse> {
    const data = {
      customerName: orderData.customerDetails.name,
      orderNumber: orderData.orderNumber,
      trackingNumber: orderData.trackingNumber || 'TBD',
      carrier: orderData.carrier || 'Standard Shipping',
      estimatedDelivery: orderData.estimatedDelivery || '3-5 business days',
      trackingUrl: `${window.location.origin}/order-tracking`
    };

    return this.sendEmailNotification({
      to: orderData.customerDetails.email,
      templateId: 'order-shipped',
      data
    });
  }

  // Send order delivered email
  static async sendOrderDelivered(orderData: any): Promise<NotificationResponse> {
    const data = {
      customerName: orderData.customerDetails.name,
      orderNumber: orderData.orderNumber,
      deliveryDate: new Date().toLocaleDateString('en-IN'),
      deliveryAddress: `${orderData.customerDetails.address.street}, ${orderData.customerDetails.address.city}`,
      reviewUrl: `${window.location.origin}/product/${orderData.items[0]?.id}`,
      shopUrl: `${window.location.origin}`
    };

    return this.sendEmailNotification({
      to: orderData.customerDetails.email,
      templateId: 'order-delivered',
      data
    });
  }

  // Send welcome email
  static async sendWelcomeEmail(userData: any): Promise<NotificationResponse> {
    const data = {
      customerName: userData.name,
      shopUrl: `${window.location.origin}`
    };

    return this.sendEmailNotification({
      to: userData.email,
      templateId: 'welcome',
      data
    });
  }

  // Get available templates
  static getTemplates(): EmailTemplate[] {
    return Object.values(this.templates);
  }

  // Get template by ID
  static getTemplate(templateId: string): EmailTemplate | null {
    return this.templates[templateId] || null;
  }
}
