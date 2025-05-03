import { atom, selector } from "recoil";
import { IProduct } from "../../types/models/IProducts";
import { IAPICreateShop,  ICreateShop,  ICreateShopState } from "../../types/models/ICreateShop";
import { ICreateUser } from "../../types/models/user";

const selectedTableRow = atom<{ index: number, data: IProduct } | undefined>({
  key: "SelectedTableRow",
  default: undefined
});

const selectedDynamicTableRow = atom<{ index: number, data: any } | undefined>({
  key: "SelectedDynamicTableRow",
  default: undefined
});

export interface IAddShoppingCart {
  id: number,
  count: number,
  item: IProduct
}

const shoppingCartState = atom<IAddShoppingCart[]>({
  key: "ShoppingCart",
  default: []
});

export const quizIndexState = atom<{index:number,categoryId:number,id:number}>({
  key: "QuizIndexState",
  default: {index:0,categoryId:0,id:0}
});

const getShoppingCartCountState = selector({
  key: 'cartCount',
  get: ({ get }) => {
    const carts = get(shoppingCartState);
    let count = 0;
    carts.map((row) => {
      count += row.count;
    })
    return count
  },
});

const productDetailsState = atom<IProduct>({
  key: "ProductCart",
  default: undefined
});

const shopAndProductState = atom<ICreateShopState>({
  key: "ShopAndProduct",
  default: {
    category: undefined,
    product: { name: "", images: [], price: 0, quantity: 0, ship: undefined },
    shop: { name: "", image: "", email: "", address: "", description: "", password: "", phone: "",subdomain:"" }
  }
});

const shopState = atom<IAPICreateShop>({
  key: "shops",
  default: undefined
});


const coinState = atom<number>({
  key: "coin",
  default: 0
});

const authUserState = atom<ICreateUser|null>({
  key: "AuthLogin",
});


export { coinState,authUserState,selectedTableRow, shopAndProductState, shoppingCartState, productDetailsState, getShoppingCartCountState, selectedDynamicTableRow,shopState }


