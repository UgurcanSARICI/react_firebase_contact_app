import { createContext, useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { ref, push, set, onValue, remove, update } from "firebase/database";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  // Get Form Data
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");

  // StorageData
  const [storageUserData, setStorageUserData] = useState();

  // FormUpdate
  const [isUpdate, setIsUpdate] = useState(false);

  // UserData
  const [userData, setUserData] = useState([]);

  // Func Section

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!isUpdate) {
      const newContact = {
        userName,
        phoneNumber,
        gender,
      };
      setUserData([...userData, newContact]);
      saveToDatabase(newContact);
      setUserName("");
      setGender("");
      setPhoneNumber("");
    } else {
      saveToDatabase();
    }
  };

  // Firebase

  const saveToDatabase = (item) => {
    if (!isUpdate) {
      const userRef = ref(db, "Contact");
      const newUserRef = push(userRef);
      set(newUserRef, {
        ...item,
      });
    } else {
      update(ref(db, "Contact/" + storageUserData.id), {
        userName,
        phoneNumber,
        gender,
      });
      setIsUpdate(false);
      setUserName("");
      setPhoneNumber("");
      setGender("0");
    }
  };

  useEffect(() => {
    const userRef = ref(db, "Contact");
    onValue(userRef, (details) => {
      const data = details.val();
      const contactArr = [];
      for (let id in data) {
        contactArr.push({ id, ...data[id] });
      }
      setUserData(contactArr);
    });
  }, []);

  // Update

  const handleUpdate = (item) => {
    setUserName(item.userName);
    setPhoneNumber(item.phoneNumber);
    setGender(item.gender);
    setIsUpdate(true);
    setStorageUserData(item);
  };

  // Delete

  const deleteDatabaseData = (item) => {
    console.log(item);
    remove(ref(db, "Contact/" + item.id));
  };

  return (
    <Context.Provider
      value={{
        setUserData,
        userData,
        setGender,
        setPhoneNumber,
        setUserName,
        gender,
        phoneNumber,
        userName,
        isUpdate,
        setIsUpdate,
        handleFormSubmit,
        deleteDatabaseData,
        handleUpdate,
      }}
    >
      {children}
    </Context.Provider>
  );
};
