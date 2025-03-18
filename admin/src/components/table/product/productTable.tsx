import { Table } from "@/common";
import React from "react";


interface FoodTableProp {
  products: Ui.Product[];
  selectedData?: Array<any>;
  loading?: boolean;
  actions: {
    checkAllFn?: (isChecked: boolean) => void;
    delete: (id: string) => void;
    edit: (id: string) => void;
    checkFn: (id: string, isChecked: boolean) => void;
  };
  pagination: { currentPage: number; perPage: number };
  onPageChange: (page: number) => void;
  totalData: number
}

export const FoodTable: React.FC<FoodTableProp> = ({
  products,
  loading,
  actions,
  selectedData,
  pagination,
  onPageChange,
  totalData
}) => {
  const Columns: Common.ColumnProps[] = [
    {
      fieldName: "Name",
      colStyle: { width: "200px", justifyContent: "start", textAlign: "start" },
      render: (value: Ui.Product) => (
        <div className="w-[200px] text-[var(--dark-text)] tracking-wide  flex items-center justify-start gap-3 ">
          <div className="w-[50px] h-[48px]">
            <img
              className="w-full h-full rounded-full"
              src={value.image}
              alt=""
            />
          </div>
          <span> {value.name}</span>
        </div>
      ),
    },
    {
      fieldName: "Unit price",
      colStyle: {
        width: "120px",
        justifyContent: "start",
        textAlign: "start",
        padding: "0px 15px 0px 0px",
      },
      render: (value: Ui.Product) => (
        <div className=" text-[var(--dark-text)] tracking-wide w-[120px] ">
          <p>Rs {value.price}</p>
        </div>
      ),
    },
    {
      fieldName: "Quantity",
      colStyle: {
        width: "120px",
        justifyContent: "start",
        textAlign: "start",
        padding: "0px 15px 0px 0px",
      },
      render: (value: Ui.Product) => (
        <div className=" text-[var(--dark-text)] tracking-wide w-[120px] ">
          <p>{value.quantity}</p>
        </div>
      ),
    },
    {
      fieldName: "Orders",
      colStyle: { width: "120px", justifyContent: "start", textAlign: "start" },
      render: (value: Ui.Product) => (
        <div className=" text-[var(--dark-text)] tracking-wide w-[120px] ">
          <p>{value.order}</p>
        </div>
      ),
    },
    {
      fieldName: "Revenue",
      colStyle: { width: "120px", textAlign: "start" },
      render: (value: Ui.Product) => (
        <div className=" text-[var(--dark-text)] tracking-wide w-[120px]   text-start ">
          <p>Rs {value.revenue}</p>
        </div>
      ),
    },
  ];
  return (
    <Table
      totalData={totalData}
      data={products}
      columns={Columns as any}
      actionIconColor="red"
      actions={{
        deleteFn: (value) => {
          actions.delete(value);
        },
        editFn: (value) => {
          actions.edit(value);
        },
        checkFn: (id, isCheck) => {
          actions.checkFn(id, isCheck);
        },
        checkAllFn: (isChecked: boolean) => {
          if (!actions.checkAllFn) return;
          actions.checkAllFn(isChecked);
        },
      }}
      disableActions={!actions}
      loading={loading}
      selectedData={selectedData}
      bodyHeight={400}
      headStyle={{ width: "100%" }}
      pagination={{
        currentPage: pagination.currentPage,
        perPage: pagination.perPage,
      }}
      onPageChange={(pageNumber) => onPageChange(pageNumber)}
      disableNoData={products?.length < 1 ? true : false}
    
    />
  );
};
