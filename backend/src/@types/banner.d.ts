declare namespace Banner {
  interface BannerData {
    id: string;
    title: string;
    image: string;
    date: Date;
    link?: string;
  }

  interface BannerInfo extends BannerData {
    createdAt: any;
    updatedAt: any;
  }
}
