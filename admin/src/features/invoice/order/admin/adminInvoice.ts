import Papa from "papaparse";


export const handleDownloadCSV = ({ orders }: Prop.InvoiceDocumentProp) => {
  const csvData = orders?.map((order) => ({
    "Invoice No.": order.invoiceData.invoiceNumber,
    Date: order.invoiceData.invoiceDate,
    Name: order.customerDetails.name,
    "Phone no.": order.customerDetails.phoneNumber,
    UserId: order.customerDetails.userId,
    Products: order.orderDetails.products.map(
      (product) =>
        `• ${product.name} (Qty: ${product.quantity}, Price: Rs. ${product.price}) \n`
    ),
    Total:
      "Rs. " +
      order?.orderDetails?.products?.reduce(
        (productAcc, product) =>
          productAcc + Number(product.quantity) * Number(product.price),
        0
      ),
    Status:
      order.orderDetails.status &&
      order.orderDetails.status?.charAt(0).toUpperCase() +
        order.orderDetails.status?.slice(1),
  }));

  // Convert to CSV and trigger download

  const csv = Papa.unparse(csvData); // Convert array of objects to CSV string
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "invoice_data.csv";
  link.click();
  URL.revokeObjectURL(url);
};

export const handleDownloadCustomerCSV = (users: Auth.User[]) => {
  const csvData = users?.map((user) => ({
    "User Id": user.id,
    Name: user.fullName,
    Email: user.email,
    "Phone No.": user.phoneNumber,
    Role: user.role,
    "Total spent": user.totalSpent,
    "Total order": user.totalOrder,
  }));
  const csv = Papa.unparse(csvData); // Convert array of objects to CSV string
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "customers.csv";
  link.click();
  URL.revokeObjectURL(url);
};
