import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
  } from "firebase/firestore";
  import { db } from ".";
  import { Category } from "../@types/category.model";
  import { DbUser } from "../@types/user.model";
  
  export const getCategory = async (docName: "bnw" | "color") => {
    try {
      const categoryRef = doc(db, "category", docName);
  
      const docSnap = await getDoc(categoryRef);
      if (!docSnap.exists) throw new Error("Document is empty.");
      const data = docSnap.data();
      return data as Category;
    } catch (error) {
      throw new Error("Error while getting category from database.");
    }
  };
  export const addCategory = async (
    docName: "bnw" | "color",
    newCategory: string,
    img: string
  ): Promise<Category> => {
    try {
      const categoryRef = doc(db, "category", docName);
  
      await updateDoc(categoryRef, {
        [`icons.${newCategory}`]: img,
      });
  
      const docSnap = await getDoc(categoryRef);
      if (!docSnap.exists()) throw new Error("Document does not exist.");
  
      const data = docSnap.data();
      return data as Category;
    } catch (error) {
      throw new Error("Error while getting category from database: " + error);
    }
  };
  
  export const deleteCategory = async (
    docName: "bnw" | "color",
    categoryName: string
  ): Promise<Category> => {
    try {
      const categoryRef = doc(db, "category", docName);
  
      const docSnap = await getDoc(categoryRef);
      if (!docSnap.exists()) throw new Error("Document does not exist.");
  
      const data = docSnap.data();
      if (data && data.icons && data.icons[categoryName]) {
        const updatedIcons = { ...data.icons };
        delete updatedIcons[categoryName];
  
        await updateDoc(categoryRef, {
          icons: updatedIcons,
        });
      } else {
        throw new Error("Category does not exist.");
      }
  
      const updatedDocSnap = await getDoc(categoryRef);
      if (!updatedDocSnap.exists()) throw new Error("Document does not exist after update.");
  
      const updatedData = updatedDocSnap.data();
      return updatedData as Category;
    } catch (error) {
      throw new Error("Error while deleting category from database: " + error);
    }
  };
  
  export const getUserData = async (
    docName: "customer" |"admin",
    uid: string
  ) => {
    try {
      const userRef = doc(db, docName, uid);
  
      const snapShot = await getDoc(userRef);
      if (!snapShot.exists) throw new Error("User document is empty.");
      const data = snapShot.data();
      return data as DbUser;
    } catch (error) {
      throw new Error("Error while getting user from database.");
    }
  };
  
  export const getCustomerData = async (
    docName: "customer"|"admin"| "chef"
  ): Promise<DbUser[]> => {
    try {
      const customerRef = collection(db, docName);
      const customerSnapchat = await getDocs(customerRef);
  
      const customerList = customerSnapchat.docs.map((data) => data.data());
      return customerList as DbUser[];
    } catch (error) {
      throw new Error("Error while getting customers from database.");
    }
  };
  
  // export const getOrderByUserId = async (docName: "orders", uid: string) => {
  //   try {
  //     const orderRef
  
  //     const querySnapshot = orderRef.
  //     const snapShot = await getDoc(userRef);
  //     if (!snapShot.exists) throw new Error("User document is empty.");
  //     console.log(snapShot.data());
  //     const data = snapShot.data();
  //     return data as Order[];
  //   } catch (error) {
  //     throw new Error("Error while getting user from database.");
  //   }
  // };