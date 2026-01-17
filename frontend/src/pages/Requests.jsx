import { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "../background2.jpg";
import logo from "../logo.jpg";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Requests() {
  const [formData, setFormData] = useState({
    request_id: "",
    hospital_name: "",
    blood_type: "",
    units_required: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitted(false);

    if (!formData.request_id || !formData.hospital_name || !formData.blood_type || !formData.units_required) {
      setMessage("❗ Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("https://n7hw1n4y30.execute-api.eu-north-1.amazonaws.com/submit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setMessage(data.body || "✅ Request submitted.");
      if (response.status === 200 && data.body.includes("confirmed")) {
        setIsSubmitted(true);
      }
    } catch (error) {
      setMessage("❌ An error occurred while submitting the request.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (isSubmitted && formData.blood_type) {
      navigate("/list-donors", { state: { blood_type: formData.blood_type } });
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />

      <div className="relative z-10 flex flex-col items-center justify-start py-10 px-4">
        <Link to="/" className="mb-6">
          <motion.img
            src={logo}
            alt="Blood Bank Logo"
            className="w-20 h-auto rounded-xl shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto"
        >
          <motion.h2
            className="text-3xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-pink-500 to-purple-500"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Patient Blood Request
          </motion.h2>

          <input
            type="text"
            name="request_id"
            placeholder="Request ID"
            value={formData.request_id}
            onChange={handleChange}
            className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg shadow-sm"
            required
          />
          <input
            type="text"
            name="hospital_name"
            placeholder="Hospital Name"
            value={formData.hospital_name}
            onChange={handleChange}
            className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg shadow-sm"
            required
          />
          <select
            name="blood_type"
            value={formData.blood_type}
            onChange={handleChange}
            className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg shadow-sm"
            required
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

          <input
            type="number"
            name="units_required"
            placeholder="Units Required"
            value={formData.units_required}
            onChange={handleChange}
            className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg shadow-sm"
            required
          />

          <div className="flex gap-4">
            <button
              type="submit"
              className={`flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Details"}
            </button>
            <button
              type="button"
              onClick={handleSearch}
              className={`flex-1 ${
                isSubmitted
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white font-semibold py-3 rounded-lg`}
              disabled={!isSubmitted}
            >
              Search Donors
            </button>
          </div>

          {message && (
            <p
              className={`mt-4 text-center font-medium ${
                message.includes("❌") || message.includes("❗")
                  ? "text-red-500"
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

export default Requests;
