import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { Product } from "../models/product.model";

interface InvoiceDocumentProp {
  orders: {
    invoiceData: {
      invoiceNumber: string;
      invoiceDate: string;
    };
    customerDetails: {
      name: string;
      phoneNumber: number;
    };
    orderDetails: Product[];
  }[];
}

const styles = StyleSheet.create({
  title: {
    fontSize: "20px",
    fontWeight: 800,
  },
  page: {
    flexDirection: "column",
    padding: 20,
    fontSize: 12,
    color: "#333",
    backgroundColor: "#f9f9f9", // Light background for better readability
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center", // Center the header
    color: "#4A90E2", // A professional color for headers
  },
  footer: {
    marginTop: "auto",
    textAlign: "center",
    fontSize: 10,
    marginBottom: 20,
    color: "#777", // Lighter color for footer text
  },
  table: {
    display: "flex",
    width: "100%",
    margin: "auto",
    borderCollapse: "collapse", // Collapse borders for a cleaner look
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1pt solid #ddd",
    paddingVertical: 5, // Add padding for better spacing
  },
  tableCol: {
    width: "25%", // Adjust width according to your needs
    textAlign: "left",
    padding: 5,
  },
  tableCell: {
    paddingRight: "1pt", // Reduced padding for cleaner table
  },
  logo: {
    width: 100,
    height: "auto",
    marginBottom: 10,
    alignSelf: "center", // Center logo
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Space between label and total amount

    fontWeight: "bold", // Emphasize total amount
  },
  note: {
    fontStyle: "italic",

    fontSize: 10, // Smaller size for notes
  },
  orderStatus: {
    fontWeight: "bold",
    marginVertical: 5,
    color: "#28a745", // Green color for success
  },
});

// Component for the Invoice
const InvoiceDocument: React.FC<InvoiceDocumentProp> = ({ orders }) => (
  <Document>
    {orders?.map((order, index) => (
      <Page key={index} wrap={false} size="A4" style={styles.page}>
        <View
          style={{
            border: "1px solid gray",
            padding: "4px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "20px",
          }}
        >
          {/* Invoice Header */}
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              borderBottom: "2px dott gray",
              paddingBottom: "10px",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <Text style={styles.title}>FoodX Nepal</Text>
              <Text>Texas college of IT and management</Text>
              <Text>mitrapark, chahabil</Text>
              <Text
                style={{
                  color: "gray",
                  fontStyle: "monoscope",
                }}
              >
                texas@gmail.com
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: "20px",
                  fontStyle: "bold",
                }}
              >
                Online Food Service Invoice
              </Text>
            </View>
          </View>
          {/* Customer Information */}
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "6px",
              }}
            >
              <View
                style={{
                  backgroundColor: "#333333",
                  padding: "5px",
                  borderRadius: "2px",
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Invoice To
                </Text>
              </View>
              <Text>{order.customerDetails.name}</Text>
              <Text>
                {order.customerDetails.phoneNumber || "+977-9825506216"}
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "7px",
              }}
            >
              <Text>Invoice Number : {order.invoiceData.invoiceNumber} </Text>
              <Text>Date : {order.invoiceData.invoiceDate} </Text>
              <Text></Text>
            </View>
          </View>

          {/* Itemized List */}
          <View style={styles.section}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCol, styles.tableCell]}>Item</Text>
                <Text style={[styles.tableCol, styles.tableCell]}>
                  Quantity
                </Text>
                <Text style={[styles.tableCol, styles.tableCell]}>Price</Text>
                <Text style={[styles.tableCol, styles.tableCell]}>Total</Text>
              </View>

              {order.orderDetails?.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.tableRow}>
                  <Text style={[styles.tableCol, styles.tableCell]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.tableCol, styles.tableCell]}>
                    {item.quantity}
                  </Text>
                  <Text style={[styles.tableCol, styles.tableCell]}>
                    Rs. {item.price.toFixed(2)}
                  </Text>
                  <Text style={[styles.tableCol, styles.tableCell]}>
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Total */}
          <View
            style={{
              width: "100%",
              alignItems: "flex-end",
              flexDirection: "column",
              padding: "10px",
              backgroundColor: "#f9f9f9", // Light background for better readability
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          >
            <View
              style={{
                width: "150px",
                paddingVertical: "8px",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "10px",
                border: "1px solid gray",
                borderRadius: "5px",
                backgroundColor: "#fff", // White background for the summary box
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  width: "100%",
                  borderBottom: "0.5px solid gray",
                  paddingBottom: "5px",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Invoice Summary
              </Text>
              <View
                style={{
                  paddingHorizontal: "2px",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                  marginTop: "5px",
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "8px",
                  }}
                >
                  <Text style={{ fontSize: "12px", fontWeight: "bold" }}>
                    Total
                  </Text>
                  <Text style={{ fontSize: "12px", fontWeight: "bold" }}>
                    Status
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "8px",
                  }}
                >
                  <Text style={{ fontSize: "12px" }}>
                    Rs{" "}
                    {order?.orderDetails?.reduce(
                      (productAcc, product) =>
                        productAcc + product.quantity * product.price,
                      1
                    )}
                  </Text>
                  <Text style={{ fontSize: "12px" }}>Completed</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Note */}
          <View style={styles.note}>
            <Text>
              Note: Thank you for your order! We appreciate your business.
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>Thank you for choosing FoodX!</Text>
          </View>
        </View>
      </Page>
    ))}
  </Document>
);

// Main Invoice Component
export const Invoice: React.FC<InvoiceDocumentProp> = ({ orders }) => {
  return (
    <div>
      <PDFViewer showToolbar width={800} height={700}>
        <InvoiceDocument orders={orders} />
      </PDFViewer>
    </div>
  );
};
