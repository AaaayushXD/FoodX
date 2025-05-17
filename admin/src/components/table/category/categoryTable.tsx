import React from "react";
import Img from "@/assets/placeholder.svg"
import {Table} from "@/common";
import { Image } from "@/utils/Image";

interface CustomerTableProp {
  totalData?: number;
  selectedData?: Array<any>;
  category: Ui.Category[];
  loading?: boolean;
  actions?: {
    checkAllFn?: (isChecked: boolean) => void;
    delete: (id: string) => void;
    edit: (id: string) => void;
    checkFn: (id: string, isChecked: boolean) => void;
  };
}

export const CategoryTable: React.FC<CustomerTableProp> = ({
  category,
  loading,
  actions,
  selectedData,
  totalData,
}) => {
  const Columns: Common.ColumnProps[] = [
    {
      fieldName: "Name",
      colStyle: { width: "150px", justifyContent: "start", textAlign: "start" },
      render: (value: Ui.Category) => (
        <div className="w-[150px] text-[var(--dark-text)] flex items-center justify-start gap-3 ">
          <div className="w-[40px] h-[40px]">
            <Image
              className="w-full h-full rounded-full"
              lowResSrc={Img}
              highResSrc={ import.meta.env.VITE_API_URL_ASSETS + value?.image}
              alt={value?.name as string}
            />
          </div>
          <span> {value.name}</span>
        </div>
      ),
    },
    {
      fieldName: "Id",
      colStyle: { width: "120px", textAlign: "start" },
      render: (item: Ui.Category) => (
        <div className="w-[120px] relative cursor-pointer group/id text-start ">
          #{item.id?.substring(0, 8)}
          <div className=" top-[-27px] group-hover/id:visible opacity-0 group-hover/id:opacity-[100] duration-150 invisible left-[-30px]  absolute bg-[var(--light-foreground)] p-1 rounded shadow ">
            {item.id}
          </div>
        </div>
      ),
    },
    {
      fieldName: "Items",
      colStyle: { width: "100px", justifyContent: "start", textAlign: "start" },
      render: (item: Ui.Category) => (
        <div className=" w-[100px]  text-[var(--dark-text)]">
          <p>{item.item}</p>
        </div>
      ),
    },
    {
      fieldName: "Orders",
      colStyle: { width: "120px", justifyContent: "start", textAlign: "start" },
      render: (item: Ui.Category) => (
        <div className=" w-[120px] text-[var(--dark-text)] ">
          <p>{item.order}</p>
        </div>
      ),
    },
    {
      fieldName: "Revenue",
      colStyle: { width: "120px", justifyContent: "start", textAlign: "start" },
      render: (item: Ui.Category) => (
        <div className=" w-[120px] text-[var(--dark-text)]  ">
          <p>Rs {item.revenue}</p>
        </div>
      ),
    },
    // {
    //   fieldName: "Rank",
    //   colStyle: { width: "100px", justifyContent: "start", textAlign: "start" },
    //   render: (item: Ui.Category) => (
    //     <div className=" w-[100px] flex  text-[var(--dark-text)] gap-2 items-center justify-start ">
    //       <div className="mt-1">{item.rank}</div>
    //     </div>
    //   ),
    // },
  ];
  return (
    <Table
      totalData={totalData as number}
      selectedData={selectedData}
      data={category}
      columns={Columns}
      actionIconColor="red"
      actions={{
        deleteFn: (id: string) => {
          actions?.delete(id);
        },
        editFn: (id: string) => {
          actions?.edit(id);
        },
        checkFn: (id: string, isChecked: boolean) => {
          actions?.checkFn(id, isChecked);
        },
        checkAllFn: (isChecked: boolean) => {
          if (!actions?.checkAllFn) return;
          actions?.checkAllFn(isChecked);
        },
      }}
      disableActions={!actions}
      loading={loading}
      bodyHeight={400}
      pagination={{ currentPage: 1, perPage: 5 }}
      onPageChange={(pageNumber) => console.log(pageNumber)}
      disableNoData={false}
      headStyle={{ width: "100%" }}
    />
  );
};
