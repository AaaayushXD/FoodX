import AllCustomerAnalytics from "./category/categoryInsight";
import AllCategoryAnalytics from "./user/userInsights";
import {AllProductAnalytics} from "./product/productInsights";

const ProductAnalytics = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5 px-3 py-2">
      <AllProductAnalytics />
      <AllCustomerAnalytics />
      <AllCategoryAnalytics />
  
    </div>
  );
};

export default ProductAnalytics;
