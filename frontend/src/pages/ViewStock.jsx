import { useEffect, useState } from "react";
import background from "../background3.jpg";
import logo from "../logo.jpg";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

function StockAvailability() {
  const [bloodStock, setBloodStock] = useState({});
  const [donorsByGroup, setDonorsByGroup] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const stockRes = await fetch("https://n7hw1n4y30.execute-api.eu-north-1.amazonaws.com/blood-stock");
        const stockData = await stockRes.json();
        const stockMap = {};
        stockData.forEach((item) => {
          stockMap[item.blood_type] = item.quantity_available;
        });
        setBloodStock(stockMap);

        const donorsRes = await fetch("https://n7hw1n4y30.execute-api.eu-north-1.amazonaws.com/donors");
        const donorsData = await donorsRes.json();
        const donorsGrouped = {};
        bloodGroups.forEach((type) => {
          donorsGrouped[type] = donorsData.filter((donor) => donor.blood_type === type);
        });
        setDonorsByGroup(donorsGrouped);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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

        <motion.h2
          className="text-4xl font-extrabold text-red-500 mb-8 drop-shadow-[0_2px_4px_rgba(255,0,0,0.6)]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
           Blood Stock Availability
        </motion.h2>

        {loading ? (
          <p className="text-white text-lg">Loading data...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
            {bloodGroups.map((group) => (
              <motion.div
                key={group}
                className="bg-white bg-opacity-90 rounded-2xl shadow-2xl p-5 hover:scale-[1.02] transition-transform duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h3 className="text-2xl font-bold text-center text-white bg-gradient-to-br from-red-600 via-pink-500 to-red-700 py-2 px-4 rounded-xl shadow mb-4">
                  {group}
                </h3>
                <p className="text-lg font-medium mb-3 text-center">
                  Units Available:{" "}
                  <span className="text-green-600 font-bold">{bloodStock[group] || 0}</span>
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {donorsByGroup[group] && donorsByGroup[group].length > 0 ? (
                    donorsByGroup[group].map((donor, idx) => (
                      <div
                        key={idx}
                        className="p-2 border rounded bg-white hover:shadow transition"
                      >
                        <p className="font-semibold">{donor.name}</p>
                        <p className="text-sm">Age: {donor.age || "N/A"}</p>
                        <p className="text-sm">Contact: {donor.contact || "N/A"}</p>
                        <p className="text-sm">Consent: {donor.consent || "No"}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No donors available</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StockAvailability;
