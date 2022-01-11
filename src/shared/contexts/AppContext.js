import React, { createContext, useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { useAuthContext } from "./AuthContext";
import { useFirebaseContext } from "./FirebaseContext";
import moment from "moment";
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const { loggedUser } = useAuthContext();
  const { storage, firestore } = useFirebaseContext();
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, [loggedUser]);

  const addPatient = (patient) => {
    console.log("patient is: ", patient);
    return new Promise(async (resolve, reject) => {
      let headerPath = `/files/${loggedUser.email.trim()}/`;
      let upLoadData = patient.dragger.map((item) => item.originFileObj);
      let uploadedUrls = await uploadHelper(headerPath, upLoadData);
      let tempUri = patient.uri;
      let uri = await uploadImage(tempUri);
      patient.onset_date = moment(patient.onset_date).format("LL");
      delete patient.uri;
      delete patient.dragger;

      firestore
        .collection("Patients")
        .add({
          ...patient,
          medical_file: uploadedUrls,
          uri: uri,
        })
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  };

  const updatePatient = (patient, id) => {
    return new Promise(async (resolve, reject) => {
      let headerPath = `/files/${loggedUser.email.trim()}/`;
      patient.onset_date = moment(patient.onset_date).format("LL");
      let prevUrls = patient.dragger.filter((item) => item.status === "done");
      let upLoadData = patient.dragger
        .filter((item) => item.status !== "done")
        .map((item) => item.originFileObj);

      console.log("prev urls: ", prevUrls);
      let uploadedUrls = await uploadHelper(headerPath, upLoadData);

      let finalUrls = [...prevUrls, ...uploadedUrls];
      let uri =
        typeof patient.uri === "string"
          ? patient.uri
          : await uploadImage(patient.uri);
      delete patient.uri;
      delete patient.dragger;

      console.log("patient is: ", patient);

      firestore
        .collection("Patients")
        .doc(id)
        .update({
          ...patient,
          medical_file: finalUrls,
          uri: uri,
        })
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  };

  const uploadHelper = async (headerPath, uploadData) => {
    let uploadedUrls = [];
    await Promise.all(
      uploadData.map(async (data) => {
        if (data !== "") {
          let path = headerPath + `/${data.uid}`;
          let url = await uploadDocuToStorage(data, path);
          uploadedUrls.push({ name: data.name, url: url });
        }
      })
    );

    return uploadedUrls;
  };

  const uploadDocuToStorage = async (data, path) => {
    const docuRef = storage.ref(path);
    await docuRef.put(data);
    return await docuRef.getDownloadURL();
  };

  const uploadImage = async (uri) => {
    const docuRef = storage.ref(`/profile_images/${uri.file.uid}`);
    await docuRef.put(uri.file.originFileObj);
    return await docuRef.getDownloadURL();
  };

  const fetchPatients = () => {
    console.log("start");
    firestore.collection("Patients").onSnapshot((snapshot) => {
      let data = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      console.log("wdata is: ", data);

      data = data.filter((item) => item.reporting_site === loggedUser?.site);
      console.log("data is: ", data);
      setPatients(data);
    });
  };

  const payload = { addPatient, patients, updatePatient };
  return <AppContext.Provider value={payload}>{children}</AppContext.Provider>;
};

AppProvider.defaultProps = {};

AppProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export default AppProvider;

export const useAppContext = () => useContext(AppContext);
