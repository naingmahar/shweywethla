export interface IOrderCard {
    name:string,
    status:"pending"|"approved",
    title:string,
    email:string,
    phone:string,
    date:string,
    price:string|number,
    currency:string,
    itemCount:number,
    itemName:string,
    total:string|number,
    subToatal:string|number,
}