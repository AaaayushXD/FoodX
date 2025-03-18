declare namespace Favourite {
  interface FavouriteData {
    uid: string;
    products: string[];
  }

  interface FavouriteInfo extends FavouriteData {
    createdAt: any;
    updatedAt: any;
  }
}
