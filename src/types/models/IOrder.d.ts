import { ICustomer } from "./ICustomer"

export interface ICreateOrder {
    customer?: ICustomer
    delivery_method_id: number
    customer_id:number
    order_status: string
    payment_status: string
    order_items: OrderItem[]
    shop_id:number
  }
  
  export interface OrderItem {
    product_id: number
    price: number
    qty: number
    amount: number
  }
  