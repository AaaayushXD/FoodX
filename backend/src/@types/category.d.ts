declare namespace Category {
  interface CategoryData {
    id: string;
    name: string;
    image: string;
  }

  interface CategoryInfo extends Category {
    createdAt: any;
    updatedAt: any;
  }
}
