import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import bloodDonationImg from "../blood.png"; 
import logo from "../logo.jpg"; 

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-black via-white to-red-100 p-6">
      {/* Logo */}
      <Link to="/" className="mb-6">
        <motion.img
          src={logo}
          alt="Blood Bank Logo"
          className="w-28 h-auto rounded-xl shadow-md"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
      </Link>

      {/* Title and Subtitle Container */}
      <motion.div
        className="bg-white p-12 border-4 border-red-700 rounded-lg shadow-xl text-center mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-5xl font-extrabold text-red-700 mb-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to the Blood Bank System 🩸
        </motion.h1>

        <motion.p
          className="text-xl text-black mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Empowering lives with blood donation. Join us in making a difference!
        </motion.p>
      </motion.div>

      {/* Navigation Links */}
      <div className="text-center">
        {["/donors", "/viewstock", "/requests"].map((route, i) => {
          const labels = ["Become a Donor", "Check Blood Stock", "Request Blood"];
          return (
            <motion.div
              key={route}
              whileHover={{ scale: 1.05 }}
              className="bg-red-700 text-white px-6 py-3 rounded-lg shadow-lg inline-block mb-6 mx-2 hover:bg-red-800 transition"
            >
              <Link to={route} className="text-xl">{labels[i]}</Link>
            </motion.div>
          );
        })}
      </div>

      {/* Learn About Donation Section with Image */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 bg-white p-12 border-4 border-red-700 rounded-lg shadow-xl text-center mt-10 w-full max-w-7xl">
        {/* Text Section */}
        <div className="lg:w-1/2">
          <motion.h2
            className="text-3xl font-extrabold text-red-700 mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Learn About Donation
          </motion.h2>

          <motion.p
            className="text-xl text-black mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            One Donation Can Save Up To Three Lives. After donating blood, the body works to replenish the blood loss. This stimulates the production of new blood cells and in turn, helps in maintaining good health.
          </motion.p>

          <motion.h3
            className="text-2xl font-bold text-red-700 mb-4"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Compatible Blood Type Donors
          </motion.h3>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-red-50 border border-red-400 rounded-lg shadow-md text-left text-black">
              <thead>
                <tr className="bg-red-200 text-red-900">
                  <th className="py-3 px-6 border-b border-red-300">Blood Type</th>
                  <th className="py-3 px-6 border-b border-red-300">Donate Blood To</th>
                  <th className="py-3 px-6 border-b border-red-300">Receive Blood From</th>
                </tr>
              </thead>
              <tbody>
                {[ 
                  ["A+", "A+, AB+", "A+, A-, O+, O-"], 
                  ["O+", "O+, A+, B+, AB+", "O+, O-"],
                  ["B+", "B+, AB+", "B+, B-, O+, O-"],
                  ["AB+", "AB+", "Everyone"],
                  ["A-", "A+, A-, AB+, AB-", "A-, O-"],
                  ["O-", "Everyone", "O-"],
                  ["B-", "B+, B-, AB+, AB-", "B-, O-"],
                  ["AB-", "AB+, AB-", "AB-, A-, B-, O-"],
                ].map(([type, donate, receive]) => (
                  <tr key={type}>
                    <td className="py-2 px-6 border-b border-red-300">{type}</td>
                    <td className="py-2 px-6 border-b border-red-300">{donate}</td>
                    <td className="py-2 px-6 border-b border-red-300">{receive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Image Section */}
        <motion.div
          className="lg:w-1/2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img
            src={bloodDonationImg}
            alt="Blood donation"
            className="w-full h-auto rounded-2xl shadow-md"
          />
        </motion.div>
      </div>

      {/* Types of Donation Section */}
      <div className="bg-white p-12 border-4 border-red-700 rounded-lg shadow-xl text-center mt-10">
        <motion.h2
          className="text-3xl font-extrabold text-red-700 mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Types of Blood Donation
        </motion.h2>

        <motion.p
          className="text-xl text-black mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          The average human body contains about five liters of blood, which is made of several cellular and non-cellular components such as Red blood cells, Platelets, and Plasma. Each component has unique properties and can be used for different medical needs.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {[ 
            { title: "Red Blood Cells", description: "Red blood cells carry oxygen to the tissues and remove carbon dioxide. They are primarily used to treat anemia and patients in need of blood loss recovery." },
            { title: "Platelets", description: "Platelets help in clotting the blood and are often used for cancer patients, those with blood clotting disorders, or patients who have undergone major surgeries." },
            { title: "Plasma", description: "Plasma is used for treating burn victims, those with liver diseases, or patients undergoing surgeries that require plasma transfusions." },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-red-100 p-6 rounded-xl shadow-lg border border-red-300"
            >
              <h3 className="text-2xl font-semibold text-red-800 mb-4">{item.title}</h3>
              <p className="text-black">{item.description}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-lg text-red-800">
          One unit of donated blood can be separated into different components, saving up to four lives!
        </p>
      </div>
    </div>
  );
}

export default Home;
