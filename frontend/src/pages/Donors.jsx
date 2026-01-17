import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../logo.jpg"; // Update with your logo path
import backgroundImg from "../background.jpg"; // Update with your background image path

function Donors() {
  const [formData, setFormData] = useState({
    donor_id: "",
    name: "",
    contact: "",
    age: "",
    blood_type: "",
    consent: false, // Updated to true to match the backend's expected "Yes" string.
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Frontend validation
    if (
      !formData.donor_id ||
      !formData.name ||
      !formData.contact ||
      !formData.age ||
      !formData.blood_type ||
      !formData.consent
    ) {
      setMessage("❗ Please fill out all required fields and agree to the consent.");
      return;
    }

    if (!/^\d{10}$/.test(formData.contact)) {
      setMessage("❗ Contact number must be 10 digits.");
      return;
    }

    if (parseInt(formData.age) < 18 || parseInt(formData.age) > 65) {
      setMessage("❗ Age must be between 18 and 65.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://n7hw1n4y30.execute-api.eu-north-1.amazonaws.com/register-donor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            consent: "Yes", // send as string "Yes" to match the Lambda backend
          }),
        }
      );

      const data = await response.json();
      setMessage(data.body || "✅ Donor registered successfully.");
      setFormData({
        donor_id: "",
        name: "",
        contact: "",
        age: "",
        blood_type: "",
        consent: true, // Reset consent field
      });
    } catch (error) {
      setMessage("❌ An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${backgroundImg})`,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />

      <div className="relative z-10 flex flex-col items-center justify-start py-10 px-4">
        <Link to="/" className="mb-8">
          <motion.img
            src={logo}
            alt="Blood Bank Logo"
            className="w-24 h-auto rounded-2xl shadow-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        </Link>

        <h2 className="text-3xl font-bold text-white text-center mb-8 shadow-md p-4 rounded-lg bg-gradient-to-r from-red-500 to-yellow-500">
          Donor Registration
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
        >
          <div className="space-y-4">
            <input
              type="text"
              name="donor_id"
              placeholder="Donor ID"
              value={formData.donor_id}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="tel"
              name="contact"
              placeholder="Contact Number (10 digits)"
              value={formData.contact}
              onChange={handleChange}
              pattern="\d{10}"
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              name="age"
              placeholder="Age (18-65)"
              value={formData.age}
              onChange={handleChange}
              min="18"
              max="65"
              required
              className="w-full p-2 border rounded"
            />
            <select
              name="blood_type"
              value={formData.blood_type}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>

            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                required
              />
              <span className="text-sm">
                I consent to donate blood and allow my information to be stored.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className={`mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Donate Now"}
          </button>

          {message && (
            <p
              className={`mt-4 text-center font-semibold ${
                message.includes("❌") || message.includes("❗")
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Donors;
