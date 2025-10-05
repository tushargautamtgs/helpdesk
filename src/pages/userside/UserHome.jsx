import React, { useState } from "react";
import { database } from "../../firebase";
import "../../index.css";

function UserHome() {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [upiLink, setUpiLink] = useState("");
  const [activeTab, setActiveTab] = useState("qr");
  const [showModal, setShowModal] = useState(false);
  const [reviewActive, setReviewActive] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [utr, setUtr] = useState("");
  const [hamburgerActive, setHamburgerActive] = useState(false);

  // Open modal & set plan + UPI link
  const openModal = (plan) => {
    setSelectedPlan(plan);
    let amount = "99";
    if (plan.includes("249")) amount = "249";
    if (plan.includes("449")) amount = "449";
    setUpiLink(
      `upi://pay?pa=9557634034@amazonpay&pn=CyberFreezeHelp&am=${amount}`
    );
    setActiveTab("qr"); // reset to QR tab
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlan("");
    setName("");
    setContact("");
    setUtr("");
  };

  const copyUPI = () => {
    navigator.clipboard.writeText("9557634034@amazonpay");
    showToast("✅ UPI ID copied to clipboard");
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const submitUTR = () => {
    if (!/^\d{10}$/.test(contact)) {
      showToast("❌ Enter a valid 10-digit contact number.");
      return;
    }
    if (!name || !contact || !utr) {
      showToast("❌ Fill all fields: Name, Contact, and UTR.");
      return;
    }

    const now = new Date();
    const options = {
      timeZone: "Asia/Kolkata",
      hour12: false,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const readableTime = new Intl.DateTimeFormat("en-GB", options)
      .format(now)
      .replace(/[/,]/g, "-")
      .replace(/:/g, "-")
      .replace(/\s/g, "_");

    const data = {
      name,
      contact,
      utr,
      plan: selectedPlan || "Not selected",
      readable_time: readableTime,
    };

    database
      .ref(`payments_by_contact/${contact}/${readableTime}`)
      .set(data)
      .then(() => {
        showToast(
          `🎉 Thanks, ${name}! Your payment details have been submitted.`
        );
        closeModal();
      })
      .catch((error) => {
        showToast("❌ Submission failed. Try again.");
        console.error(error);
      });
  };

  return (
    <div>
      {/* Navbar */}
      <header className="navbar">
        <h1>Help Desk</h1>
        <div
          className={`hamburger ${hamburgerActive ? "active" : ""}`}
          onClick={() => setHamburgerActive((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className={`nav-actions ${hamburgerActive ? "active" : ""}`}>
          <a href="https://wa.me/919557634034" className="whatsapp-btn">
            📞 WhatsApp
          </a>
          <a href="/status" className="check-status-btn">
            🔎 Check Status
          </a>
          <a href="/updates" className="btn">
            📣 Updates
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Facing Bank Account Freeze?</h1>
          <p>
            Don’t panic — we’re here to guide you with verified information &
            simple steps.
          </p>
          <h3 className="highlight">Trusted Help Starting from ₹99</h3>
          <a
            href="https://wa.me/919557634034"
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp"
          >
            📞 Connect with Us on WhatsApp
          </a>
        </div>
      </section>

      {/* How Can We Help Section */}
      <section
        className="help-cards"
        style={{
          padding: "60px 20px",
          backgroundColor: "#f4f6f8",
          textAlign: "center",
        }}
      >
        <h2
          style={{ fontSize: "36px", color: "#1c1c1c", marginBottom: "40px" }}
        >
          How Can We Help You?
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "30px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              padding: "30px",
              width: "320px",
            }}
          >
            <h3 style={{ color: "#007bff", marginBottom: "15px" }}>
              Verified Guidance
            </h3>
            <p style={{ color: "#444", fontSize: "16px", lineHeight: 1.6 }}>
              Get step-by-step instructions based on verified processes shared
              by real users & official sources. We simplify the legal procedures
              for you.
            </p>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              padding: "30px",
              width: "320px",
            }}
          >
            <h3 style={{ color: "#28a745", marginBottom: "15px" }}>
              Minimal Cost
            </h3>
            <p style={{ color: "#444", fontSize: "16px", lineHeight: 1.6 }}>
              You don't need a lawyer right away. Our affordable plans offer
              clarity and confidence without burning your pocket.
            </p>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              padding: "30px",
              width: "320px",
            }}
          >
            <h3 style={{ color: "#ff5722", marginBottom: "15px" }}>
              Proper Discussion
            </h3>
            <p style={{ color: "#444", fontSize: "16px", lineHeight: 1.6 }}>
              We discuss each case with care. Your situation is unique — and we
              provide tailored steps to help you handle it the right way.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <h2>How It Works</h2>
        <div className="timeline">
          {[
            {
              step: "1",
              title: "Buy a Plan",
              desc: "Choose ₹99 / ₹249 / ₹449",
            },
            {
              step: "2",
              title: "Get Guide & Formats",
              desc: "Download helpful resources",
            },
            {
              step: "3",
              title: "Take Action",
              desc: "Follow exact instructions",
            },
            {
              step: "4",
              title: "Resolve Your Case",
              desc: "Get Assured Resolution within a certain Time Limit",
            },
          ].map((s) => (
            <div className="step" key={s.step}>
              <span>{s.step}</span>
              <p>
                <strong>{s.title}</strong>
                <br />
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="plans-section">
        <h2>Our Plans</h2>
        <div className="plans-container">
          {["Basic ₹99", "Standard ₹249", "Premium ₹449"].map((plan) => (
            <div
              key={plan}
              className={`plan-card ${plan.includes("449") ? "premium" : ""}`}
            >
              <h3>{plan.split(" ")[0]} Plan</h3>
              <p className="price">₹{plan.match(/\d+/)[0]}</p>
              <ul>
                {plan.includes("99") && (
                  <>
                    <li>Step-by-step recovery guide</li>
                    <li>Draft letter to Bank/Cyber Cell</li>
                    <li>Email/Letter templates</li>
                  </>
                )}
                {plan.includes("249") && (
                  <>
                    <li>Everything in Basic Plan</li>
                    <li>1-on-1 support on WhatsApp</li>
                    <li>Help customizing your documents</li>
                    <li>Priority response within 6 hrs</li>
                  </>
                )}
                {plan.includes("449") && (
                  <>
                    <li>Everything in Standard Plan</li>
                    <li>Customized mail drafts</li>
                    <li>Up to 10-12 case updates & suggestions</li>
                    <li>Conf. call with lawyer (if needed) at no extra cost</li>
                  </>
                )}
              </ul>
              <button className="buy-button" onClick={() => openModal(plan)}>
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Review Panel */}
      <button
        className="review-toggle-button"
        onClick={() => setReviewActive((prev) => !prev)}
      >
        What Our Past Buyers Said
      </button>
      {reviewActive && (
        <div className="review-slider-panel">
          <div className="reviews-content">
            <h2>Customer Reviews</h2>
            {[
              {
                text: "This guide helped me unfreeze my account in just 24 hours!",
                author: "Priya, Delhi",
              },
              {
                text: "Worth every penny. Step-by-step solutions were very clear.",
                author: "Rohit, Mumbai",
              },
              {
                text: "Excellent support and detailed templates. Highly recommended!",
                author: "Anjali, Bangalore",
              },
            ].map((r, i) => (
              <div key={i} className="review-card">
                <p>“{r.text}”</p>
                <span>– {r.author}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h3>Select Payment Method</h3>

            {/* Tabs */}
            <div className="tab-buttons">
              <button
                onClick={() => setActiveTab("qr")}
                className={activeTab === "qr" ? "active-tab" : ""}
              >
                QR Code
              </button>
              <button
                onClick={() => setActiveTab("upi")}
                className={activeTab === "upi" ? "active-tab" : ""}
              >
                UPI ID
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === "qr" && (
                <p style={{ textAlign: "center", marginTop: "10px" }}>
                  QR Yet To Be Added Shortly
                </p>
              )}
              {activeTab === "upi" && upiLink && (
                <div key={upiLink} style={{ marginTop: "10px" }}>
                  <p>
                    UPI ID: <strong>9557634034@amazonpay</strong>
                  </p>
                  <button onClick={copyUPI} style={{ marginBottom: "10px" }}>
                    📋 Copy UPI ID
                  </button>
                  <br />
                  <a
                    href={upiLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      marginTop: "12px",
                      backgroundColor: "#007bff",
                      color: "white",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      display: "inline-block",
                      fontWeight: 500,
                    }}
                  >
                    💳 Pay using UPI App
                  </a>
                </div>
              )}
            </div>

            {/* UTR Submission */}
            <hr style={{ margin: "20px 0" }} />
            <h3 style={{ marginTop: "10px" }}>Enter Payment Details</h3>
            <input
              style={{
                margin: "5px",
                border: "2px solid",
                borderRadius: "5px",
                padding: "10px 5px",
              }}
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              style={{
                margin: "5px",
                border: "2px solid",
                borderRadius: "5px",
                padding: "10px 5px",
              }}
              type="text"
              placeholder="Contact Number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <input
              style={{
                margin: "5px",
                border: "2px solid",
                borderRadius: "5px",
                padding: "10px 5px",
              }}
              type="text"
              placeholder="Transaction/UTR ID"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
            />
            <br />
            <button
              onClick={submitUTR}
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div
          id="toast"
          style={{
            position: "fixed",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#333",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            zIndex: 9999,
            fontWeight: 500,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Footer */}
      <footer>
        <p
          style={{
            marginTop: "50px",
            fontSize: "15px",
            color: "#666",
            maxWidth: "700px",
            marginInline: "auto",
          }}
        >
          <strong>Note:</strong> We do not provide legal representation. We help
          you with the right information so that you can approach the process
          confidently.
        </p>
        <div className="footer-bottom">
          © 2025 Help Desk | All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default UserHome;
