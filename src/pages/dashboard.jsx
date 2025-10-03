import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "./dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [requestsList, setRequestsList] = useState([]);
  const [contactInput, setContactInput] = useState("");
  const [consultantsList, setConsultantsList] = useState({});
  const [selectedConsultants, setSelectedConsultants] = useState({});

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) navigate("/");
      else {
        firebase
          .database()
          .ref(`admins/${user.uid}`)
          .once("value")
          .then((snap) => {
            if (!snap.exists()) {
              firebase.auth().signOut();
              navigate("/");
            }
          });
      }
    });

    firebase
      .database()
      .ref("consultants")
      .once("value")
      .then((snap) => {
        if (snap.exists()) setConsultantsList(snap.val());
      });
  }, [navigate]);

  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => navigate("/"));
  };

  const loadRequests = () => {
    if (!contactInput) return alert("Enter contact number");
    firebase
      .database()
      .ref(`payments_by_contact/${contactInput}`)
      .once("value")
      .then((snapshot) => {
        if (!snapshot.exists()) setRequestsList([]);
        else setRequestsList(Object.entries(snapshot.val()));
      });
  };

  const loadAllRequests = () => {
    firebase
      .database()
      .ref(`payments_by_contact`)
      .once("value")
      .then((snapshot) => {
        if (!snapshot.exists()) setRequestsList([]);
        else {
          const all = [];
          snapshot.forEach((userSnap) => {
            Object.entries(userSnap.val()).forEach(([key, val]) =>
              all.push([userSnap.key, key, val])
            );
          });
          setRequestsList(all);
        }
      });
  };

  const handleConsultantChange = (requestKey, consultantUid) => {
    setSelectedConsultants((prev) => ({
      ...prev,
      [requestKey]: consultantUid,
    }));
  };

  const updateStatus = (contact, key, status) => {
    const consultantUid = selectedConsultants[key];
    const consultantData = consultantsList[consultantUid];
    if (!consultantData) return alert("Select a consultant");

    const updates = {
      status,
      consultant: consultantData.name,
      consultantId: consultantUid,
    };

    firebase
      .database()
      .ref(`payments_by_contact/${contact}/${key}`)
      .update(updates)
      .then(() => {
        return firebase
          .database()
          .ref(`assigned_consultants/${consultantUid}/${key}`)
          .set({
            contact,
            name: consultantData.name,
            consultantId: consultantUid,
            status,
            plan: updates.plan || "N/A",
            utr: updates.utr || "",
            user_name: updates.name || "",
            assigned_at: new Date().toLocaleString(),
            requestKey: key,
          });
      })
      .then(() => alert(`Assigned ${consultantData.name} successfully`));
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">&#9776; Admin Panel</div>
        <div className="navbar-right">
          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="admin-container" style={{ padding: "20px" }}>
        <div className="search-bar" style={{ marginBottom: "20px" }}>
          <input
            type="text"
            value={contactInput}
            onChange={(e) => setContactInput(e.target.value)}
            placeholder="Search by Contact"
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginRight: "10px",
            }}
          />
          <button onClick={loadRequests} style={{ marginRight: "10px" }}>
            Search
          </button>
          <button onClick={loadAllRequests}>Load All</button>
        </div>

        <div
          className="requests-list"
          style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}
        >
          {requestsList.map((item, idx) => {
            const contact = item[0];
            const key = item[1];
            const data = item[2];
            return (
              <div
                className="request-card"
                key={idx}
                style={{
                  background: "#fff",
                  padding: "16px",
                  borderRadius: "12px",
                  width: "250px",
                  boxShadow: "0 4px 12px #00000022",
                }}
              >
                <p>
                  <strong>Contact:</strong> {contact}
                </p>
                <p>
                  <strong>Name:</strong> {data.name}
                </p>
                <p>
                  <strong>UTR:</strong> {data.utr}
                </p>
                <p>
                  <strong>Plan:</strong> {data.plan}
                </p>
                <p>
                  <strong>Time:</strong> {data.readable_time}
                </p>

                <select
                  value={data.status}
                  onChange={(e) => updateStatus(contact, key, e.target.value)}
                  style={{
                    width: "100%",
                    marginBottom: "10px",
                    padding: "6px",
                    borderRadius: "6px",
                  }}
                >
                  <option>Pending</option>
                  <option>Assigned</option>
                  <option>Completed</option>
                </select>

                <select
                  value={selectedConsultants[key] || ""}
                  onChange={(e) => handleConsultantChange(key, e.target.value)}
                  style={{
                    width: "100%",
                    marginBottom: "10px",
                    padding: "6px",
                    borderRadius: "6px",
                  }}
                >
                  <option value="">Select Consultant</option>
                  {Object.entries(consultantsList).map(([uid, c]) => (
                    <option key={uid} value={uid}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => updateStatus(contact, key, data.status)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    background: "#4a90e2",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Update
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
