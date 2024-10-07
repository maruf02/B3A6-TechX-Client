"use client";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { motion } from "framer-motion";

const ContactUsPage = () => {
  return (
    <div className="min-h-screen bg-gray-200 text-gray-800">
      <header className="text-center  py-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h1 className="text-4xl font-bold   pt-20 text-black">Contact Us</h1>
        <p className="text-lg mt-2">
          Learn more about our mission, values, and team.
        </p>
      </header>

      {/* <section className="max-w-7xl mx-auto px-4 py-10"> */}
      <section className="w-full mx-auto px-4 py-10">
        {/* company History Statement */}
        <div className="w-full bg-gray-300  rounded-lg my-5 py-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-semibold mb-6">Our History</h2>
            <p className="text-lg max-w-4xl mx-auto">
              <span>
                Founded in 2015, speedeRex was established with the mission to
                revolutionize the car rental industry by providing customers
                with a seamless, reliable, and customer-centric experience. Our
                vision is to become the leading car rental service provider,
                known for our commitment to quality, innovation, and excellence
                in customer service.
              </span>
              <br />
              <br />
              <span>
                From our humble beginnings with just a few cars in our fleet, we
                have grown into a trusted brand with a wide range of vehicles to
                meet the diverse needs of our customers. Our journey has been
                marked by continuous growth, innovation, and a dedication to
                ensuring that every customer has a smooth and enjoyable rental
                experience.
              </span>
              <br />
              <br />
              <span>
                At speedeRex, we believe in the power of mobility to connect
                people, create memories, and open up new possibilities. Our
                mission is to make car rental easy, accessible, and stress-free
                for everyone, whether youre traveling for business, leisure, or
                any other purpose. We are committed to providing our customers
                with the best service, the best vehicles, and the best value,
                every time they choose us.
              </span>
            </p>
          </motion.div>
        </div>
        {/* company History Statement */}

        <div className="flex flex-col-reverse md:flex-row w-full bg-white  rounded-lg pt-5">
          {/* Contact Information */}
          <div className="w-full md:w-4/12  text-center   ">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-semibold mb-6 text-center">
                Contact Information
              </h2>
              <div className="flex flex-col justify-center items-center text-center  h-fit  ">
                <div className="flex items-center text-center space-x-2 mb-2">
                  <FaPhoneAlt className="text-blue-500" />
                  <span>+123 456 7890</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <FaEnvelope className="text-red-500" />
                  <span>info@speederex.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaMapMarkerAlt className="text-green-500" />
                  <span>123 Camper St, City, Country</span>
                </div>
              </div>
              {/* Social Media Links */}
              <div className="pt-8">
                {/* Social Media Links */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 2 }}
                  className="mb-12 text-center"
                >
                  <h2 className="text-3xl font-semibold mb-6">Follow Us</h2>
                  <div className="flex justify-center space-x-8">
                    <a
                      href="https://www.facebook.com/programmingHero"
                      className="text-blue-700 text-2xl"
                      target="_blank"
                    >
                      <FaFacebook className="hover:text-blue-500 transition-colors duration-200" />
                    </a>
                    <a
                      href="https://www.facebook.com/programmingHero"
                      target="_blank"
                      className="text-blue-500 text-2xl"
                    >
                      <FaTwitter className="hover:text-blue-300 transition-colors duration-200" />
                    </a>
                    <a
                      href="https://www.facebook.com/programmingHero"
                      className="text-pink-600 text-2xl"
                      target="_blank"
                    >
                      <FaInstagram className="hover:text-pink-400 transition-colors duration-200" />
                    </a>
                    <a
                      href="https://www.facebook.com/programmingHero"
                      className="text-blue-900 text-2xl"
                      target="_blank"
                    >
                      <FaLinkedin className="hover:text-blue-600 transition-colors duration-200" />
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Google Map */}
          <div className="w-full md:w-8/12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-semibold mb-6 text-center">
                Our Location
              </h2>
              <div className="flex justify-center">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.385836821081!2d90.36095797534226!3d23.80487508668285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c124e70bf59b%3A0x21b6f484e27a03e9!2sMirpur%20Shopping%20Center!5e0!3m2!1sen!2sbd!4v1723964946547!5m2!1sen!2sbd"
                  width="100%"
                  height="400"
                  className="border-4 border-gray-300 rounded-lg shadow-lg"
                  // allowFullScreen=""
                  loading="lazy"
                  title="Google Map"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="w-full bg-gray-300  rounded-lg my-5 py-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
            <p className="text-lg max-w-3xl mx-auto">
              At Camper Shop, our mission is to inspire and equip adventurers of
              all kinds with the highest quality gear and products for their
              outdoor journeys. We believe in the transformative power of nature
              and aim to make the great outdoors accessible, enjoyable, and
              sustainable for everyone. By offering a diverse range of products
              tailored to the needs of campers, hikers, and outdoor enthusiasts,
              we strive to be your trusted partner in every adventure. Our
              commitment is to provide exceptional service, innovative
              solutions, and a community of like-minded explorers who share a
              passion for the wilderness.
            </p>
          </motion.div>
        </div>
        {/* Mission Statement */}
      </section>
    </div>
  );
};

export default ContactUsPage;
