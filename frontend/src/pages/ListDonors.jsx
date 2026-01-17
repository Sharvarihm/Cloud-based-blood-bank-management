import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import background from "../background2.jpg";
import logo from "../logo.jpg";
import { motion } from "framer-motion";

function ListDonors() {
  const location = useLocation();
  const navigate = useNavigate();
  const { blood_type } = location.state || {};
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await fetch(
          `https://n7hw1n4y30.execute-api.eu-north-1.amazonaws.com/get-donors?blood_type=${blood_type}`
        );
        const data = await response.json();
        setDonors(data.donors || []);
      } catch (err) {
        setError("Failed to fetch donor data.");
      } finally {
        setLoading(false);
      }
    };

    if (blood_type) {
      fetchDonors();
    } else {
      setError("No blood type specified.");
      setLoading(false);
    }
  }, [blood_type]);

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />

      <div className="relative z-10 px-4 py-8 flex flex-col items-center">
        <motion.img
          src={logo}
          alt="Logo"
          className="w-20 h-auto rounded-xl shadow-md mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          onClick={() => navigate("/")}
        />

        <h1 className="text-3xl font-bold text-white mb-6">
          Matching Donors for <span className="text-red-400">{blood_type}</span>
        </h1>

        {loading ? (
          <p className="text-white text-lg">Loading donors...</p>
        ) : error ? (
          <p className="text-red-400 text-lg">{error}</p>
        ) : donors.length === 0 ? (
          <p className="text-yellow-200 text-lg">No donors available for this blood type.</p>
        ) : (
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
            {donors.map((donor, index) => (
              <motion.div
                key={index}
                className="bg-white bg-opacity-90 rounded-2xl shadow-lg p-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h2 className="text-xl font-semibold text-red-600 mb-2">{donor.name}</h2>
                <p><strong>Contact:</strong> {donor.contact}</p>
                <p><strong>Location:</strong> {donor.location}</p>
                <p><strong>Blood Group:</strong> {donor.blood_type}</p>

                <button
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                  onClick={() => alert(`Request sent to ${donor.name}`)}
                >
                  Contact
                </button>
              </motion.div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate(-1)}
          className="mt-8 bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg"
        >
          ← Back to Request Form
        </button>
      </div>
    </div>
  );
}

export default ListDonors;
