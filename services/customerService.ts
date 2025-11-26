import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc,
  updateDoc, 
  doc, 
  serverTimestamp, 
  query, 
  orderBy 
} from "firebase/firestore";
import { Customer } from "../types";

const COLLECTION_NAME = "clientes";

export const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...customer,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const updateCustomer = async (id: string, customer: Partial<Customer>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    // Remove id and createdAt from the update payload if they exist to avoid overwriting or duplication
    const { id: _, createdAt: __, ...updateData } = customer as any;
    
    await updateDoc(docRef, updateData);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const customers: Customer[] = [];
    querySnapshot.forEach((doc) => {
      // Ensure doc.id is used as the ID, overriding any potential 'id' field in the data
      customers.push({ ...doc.data(), id: doc.id } as Customer);
    });
    return customers;
  } catch (e) {
    console.error("Error getting documents: ", e);
    // Fallback if index is missing or permission denied, try basic fetch
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const customers: Customer[] = [];
        querySnapshot.forEach((doc) => {
          customers.push({ ...doc.data(), id: doc.id } as Customer);
        });
        return customers;
    } catch (innerError) {
        console.error("Critical error fetching customers", innerError);
        return [];
    }
  }
};

export const deleteCustomer = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};