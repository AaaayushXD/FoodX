import { Image } from "@/utils/Image";
import Img from "@/assets/logo/avatar.png"

interface CustomerCardProp {
  prop: Auth.User;
  index: number;
}

export const CustomerCard: React.FC<CustomerCardProp> = ({ prop, index }) => {
  return (
    <div className="flex items-center justify-between w-full gap-2 px-2 py-1 border-[1px] border-[var(--dark-border)] rounded-lg">
      <div className="w-full flex items-center justify-start gap-3">
        <div className="w-[50px] h-[50px] ">
          <Image
            className="w-full h-full rounded-full"
            highResSrc={prop.avatar as string}
            lowResSrc={Img}
            alt="img"
          ></Image>
        </div>
        <div className="flex flex-col items-start justify-center gap-2 pl-2 pr-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-[var(--dark-text)] text-nowrap">
              {prop.fullName}
            </p>
            <p className="text-xs text-[var(--dark-secondary-text)]">
              {prop.email}
            </p>
          </div>
          <div className="flex flex-col gap-1 text-[var(--dark-secondary-text)]">
            <p className="text-xs">
              Total Orders:{" "}
              <span className="text-[var(--dark-text)] text-[13px] font-medium">
                {prop.totalOrder}
              </span>
            </p>
            <p className="text-xs">
              Total Spent:{" "}
              <span className="text-[var(--dark-text)] text-[13px] font-medium">
                {prop.totalSpent}
              </span>
            </p>
          </div>
        </div>
      </div>
      <p className="p-3 text-3xl font-semibold">
        #<span>{index + 1}</span>
      </p>
    </div>
  );
};
