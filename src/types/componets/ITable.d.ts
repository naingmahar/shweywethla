
export interface ITableRow {
    // img:string,
    // name:string,
    // price:number,
    // inventory:string,
    // category:string,
    // status:boolean,
    // currency:string

    name : string,
    description : string,
    price : string,
    image:string,
    shop_id:string,
    additionalinfo :string,
}

export interface ITableHeader {
    headers : string[],
    status: boolean,
    statusOnChange : () => any;
}


export interface ITableBody {
    data:ITableRow[]
}