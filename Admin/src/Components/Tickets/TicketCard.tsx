import dayjs from "dayjs";
import React from "react";

interface TicketProp {
  date: string[];
  uid?: string;
  description: string;
  title: string;
  category: string;
  id?: string;
  status?: string;
}

const TicketCard: React.FC<TicketProp> = ({
  category,
  description,
  title,
  date,

  id,
}) => {
  console.log(category, description, title, date);

  const leftTime =
    dayjs().format("YYYY-MM-DD") - dayjs(date).format("YYYY-MM-DD");

  // console.log(tickeDate)
  // let hours = tickeDate.getUTCHours()
  // let minutes = tickeDate.getUTCMinutes();
  // console.log(minutes)

  // useEffect(() => {

  // },[hours,minutes])

  return (
    <div className="w-full flex  text-[var(--dark-text)] border-b-[1px] pb-5  gap-2.5 flex-col items-start justify-center bg-[var(--light-foreground)]  px-1 py-4 border-[#8a849570] ">
      <div className=" w-full flex items-start gap-5 justify-between">
        <div className="flex flex-col items-start justify-center gap-2.5">
          <h1 className="text-[15px]  w-[120px] border-[1px] border-[var(--danger-bg)] py-0.5 px-2 rounded ">
            {category}
          </h1>
          <h2 className="text-[14px] w-full font-[600] ">{title}</h2>
        </div>
        <h3 className="text-[14px] tracking-wider py-0.5 px-1 rounded border-[1px] text-[#247f8b] border-[#247f8b] ">
          #{id?.slice(0, 10)}
        </h3>
        {/* <div className="bg-red-600 text-[10px] text-white px-3 py-0.5 rounded-sm ">High</div> */}
      </div>
      <h3 className="text-[14px] ">{description}</h3>
      <span className="text-[12px] text-[var(--dark-text)] ">
        {`${leftTime} mins ago`}{" "}
      </span>
    </div>
  );
};

export default TicketCard;
