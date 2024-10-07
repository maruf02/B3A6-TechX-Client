"use client";
import { useRef } from "react";

import { motion } from "framer-motion";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual, Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const teamMembers = [
  {
    name: "Alice Brown",
    role: "Founder & CEO",
    image: "https://i.postimg.cc/sgdj6mTv/download-1.jpg",
    bio: "Alice is an outdoor enthusiast who started Camper Shop to inspire others to explore the beauty of nature.",
  },
  {
    name: "Michael Green",
    role: "Lead Designer",
    image: "https://i.postimg.cc/X7yNkmcR/download.png",
    bio: "Michael is passionate about creating innovative designs that blend functionality with aesthetics, ensuring every product stands out.",
  },
  {
    name: "Sophia Williams",
    role: "Customer Support",
    image: "https://i.postimg.cc/sgdj6mTv/download-1.jpg",
    bio: "Sophia is committed to delivering exceptional customer service, making sure every camper's needs are met with care.",
  },
  {
    name: "David Thompson",
    role: "Product Manager",
    image: "https://i.postimg.cc/X7yNkmcR/download.png",
    bio: "David oversees the product development process, ensuring that every item is crafted with the highest standards of quality and durability.",
  },
  {
    name: "Olivia Martinez",
    role: "Marketing Specialist",
    image: "https://i.postimg.cc/sgdj6mTv/download-1.jpg",
    bio: "Olivia creates impactful marketing campaigns that resonate with outdoor lovers and share our brand’s story.",
  },
  {
    name: "Lucas Miller",
    role: "Operations Manager",
    image: "https://i.postimg.cc/sgdj6mTv/download-1.jpg",
    bio: "Lucas ensures smooth operations across all departments, keeping Camper Shop running efficiently and effectively.",
  },
  {
    name: "Emma Johnson",
    role: "Logistics Coordinator",
    image: "https://i.postimg.cc/X7yNkmcR/download.png",
    bio: "Emma manages the logistics with precision, ensuring timely delivery of our products to customers around the globe.",
  },
  {
    name: "Benjamin Lee",
    role: "Financial Analyst",
    image: "https://i.postimg.cc/sgdj6mTv/download-1.jpg",
    bio: "Benjamin analyzes financial data to help Camper Shop make informed decisions and maintain a healthy growth trajectory.",
  },
  {
    name: "Isabella Davis",
    role: "Social Media Manager",
    image: "https://i.postimg.cc/X7yNkmcR/download.png",
    bio: "Isabella manages our social media presence, crafting content that engages and grows our community of adventurers.",
  },
  {
    name: "James White",
    role: "E-commerce Specialist",
    image: "https://i.postimg.cc/sgdj6mTv/download-1.jpg",
    bio: "James optimizes our online store, ensuring a seamless shopping experience for all our customers.",
  },
  {
    name: "Charlotte Harris",
    role: "Content Creator",
    image: "https://i.postimg.cc/X7yNkmcR/download.png",
    bio: "Charlotte is the creative mind behind our blog and video content, sharing tips and inspiration for outdoor adventures.",
  },
  {
    name: "Henry Wilson",
    role: "IT Specialist",
    image: "https://i.postimg.cc/sgdj6mTv/download-1.jpg",
    bio: "Henry maintains our technical infrastructure, ensuring that all our systems are secure and running smoothly.",
  },
  {
    name: "Ava Anderson",
    role: "Event Coordinator",
    image: "https://i.postimg.cc/X7yNkmcR/download.png",
    bio: "Ava organizes our community events, bringing together outdoor enthusiasts to share their love for camping and nature.",
  },
];

const AboutUsPage = () => {
  // const swiperRef = useRef(null);
  const swiperRef = useRef<SwiperType | null>(null);

  const handleMouseEnter = () => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.stop();
    }
  };

  const handleMouseLeave = () => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.start();
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 text-gray-800">
      <header className="text-center  py-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h1 className="text-4xl font-bold   pt-20 text-black">About Us</h1>
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
        {/*  Values & Commitment Statement */}
        <div className="w-full bg-gray-300  rounded-lg my-5 py-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}
            className="mb-12 text-center"
          >
            <section className="bg-gray-300 py-2">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-semibold mb-8 text-center">
                  Values & Commitment
                </h2>
                <p className="text-center mb-8 text-lg">
                  At <strong>speedeRex</strong>, our core values drive
                  everything we do. We are committed to providing exceptional
                  service while making a positive impact on our community and
                  the environment. Here’s how we uphold our values and
                  commitments:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* <!-- Customer Service --> */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">
                      Customer Service
                    </h3>
                    <p>
                      We prioritize our customers satisfaction above all else.
                      Our dedicated team is here to provide you with
                      personalized service, ensuring that every interaction is
                      smooth and every need is met promptly.
                    </p>
                  </div>

                  {/* <!-- Sustainability --> */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">
                      Sustainability
                    </h3>
                    <p>
                      We are committed to reducing our environmental impact
                      through sustainable practices. From offering electric
                      vehicles to implementing green initiatives in our
                      operations, we strive to contribute to a greener future.
                    </p>
                  </div>

                  {/* <!-- Integrity --> */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">Integrity</h3>
                    <p>
                      Integrity is at the heart of our business. We believe in
                      transparency, honesty, and ethical practices in all our
                      dealings, ensuring that we build trust with our customers
                      and partners.
                    </p>
                  </div>

                  {/* <!-- Safety --> */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">Safety</h3>
                    <p>
                      The safety of our customers is paramount. We ensure that
                      all our vehicles are regularly inspected and maintained to
                      meet the highest safety standards, providing you with
                      peace of mind during your journey.
                    </p>
                  </div>

                  {/* <!-- Innovation --> */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">Innovation</h3>
                    <p>
                      We embrace innovation to enhance your experience. By
                      integrating the latest technology and continuously
                      improving our services, we aim to stay ahead and offer you
                      the best solutions for your needs.
                    </p>
                  </div>

                  {/* <!-- Community Engagement --> */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">
                      Community Engagement
                    </h3>
                    <p>
                      We believe in giving back to the community. Through
                      various initiatives and partnerships, we support local
                      causes and contribute to the well-being of the areas we
                      serve.
                    </p>
                  </div>
                </div>
                <p className="text-center mt-8 text-lg">
                  <strong>speedeRex</strong> is dedicated to upholding these
                  values every day. Our commitment to excellence and
                  responsibility ensures that we deliver not only great services
                  but also make a positive impact in everything we do.
                </p>
              </div>
            </section>
          </motion.div>
        </div>
        {/*  Values & Commitment Statement */}
        {/* our fleet */}
        <div className="w-full bg-gray-300  rounded-lg my-5 py-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}
            className="mb-12 text-center"
          >
            <section className="bg-gray-300 py-5">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-semibold mb-8 text-center">
                  Our Fleet
                </h2>
                <p className="text-center mb-8 text-lg">
                  At <strong>speedeRex</strong>, we take pride in offering a
                  diverse range of vehicles to meet all your transportation
                  needs. Whether youre looking for a compact car for city
                  driving or a luxury vehicle for a special occasion, our fleet
                  has something for everyone. Here’s a glimpse of what we offer:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* <!-- Economy Cars --> */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">
                      Economy Cars
                    </h3>
                    <p>
                      Perfect for budget-conscious travelers who want reliable
                      and fuel-efficient options. Our economy cars are ideal for
                      city commutes and short trips, combining affordability
                      with practicality.
                    </p>
                  </div>

                  {/* <!-- Standard & Intermediate Cars --> */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">
                      Standard & Intermediate Cars
                    </h3>
                    <p>
                      Offering more space and comfort than economy models, these
                      vehicles are great for families or groups needing a bit
                      more room without breaking the bank.
                    </p>
                  </div>

                  {/* <!-- Luxury Cars --> */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">Luxury Cars</h3>
                    <p>
                      Experience the ultimate in comfort and style with our
                      luxury fleet. Whether you’re attending a special event or
                      simply want to enjoy a premium driving experience, our
                      luxury cars offer top-of-the-line features and a smooth
                      ride.
                    </p>
                  </div>

                  {/* <!-- SUVs --> */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">SUVs</h3>
                    <p>
                      For those who need more space and versatility, our SUVs
                      are perfect for both urban and off-road adventures. With
                      ample cargo space and enhanced performance, they are ideal
                      for family vacations, road trips, or outdoor activities.
                    </p>
                  </div>

                  {/* <!-- Vans --> */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">Vans</h3>
                    <p>
                      Traveling with a larger group? Our selection of vans
                      provides plenty of space and comfort for groups or
                      families, making it easy to travel together without
                      compromising on comfort.
                    </p>
                  </div>

                  {/* <!-- Electric Vehicles --> */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">
                      Electric Vehicles
                    </h3>
                    <p>
                      Embrace sustainability with our range of electric
                      vehicles. These eco-friendly options are perfect for those
                      who want to reduce their carbon footprint while enjoying a
                      modern and efficient ride.
                    </p>
                  </div>
                </div>
                <p className="text-center mt-8 text-lg">
                  No matter what your needs are, <strong>speedeRex</strong>{" "}
                  ensures that every vehicle in our fleet is maintained to the
                  highest standards, so you can enjoy a safe and enjoyable ride.
                  Explore our diverse range of cars and find the perfect vehicle
                  for your next journey!
                </p>
              </div>
            </section>
          </motion.div>
        </div>
        {/* our fleet */}
        {/* Team Members */}

        <div className="py-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-semibold mb-6">Meet Our Team</h2>
            <Swiper
              // ref={swiperRef}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              direction="horizontal"
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
                1280: {
                  slidesPerView: 4,
                },
                1536: {
                  slidesPerView: 5,
                },
              }}
              spaceBetween={10}
              virtual
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 1000, disableOnInteraction: false }}
              modules={[Virtual, Navigation, Pagination, Autoplay]}
              className="h-96"
            >
              {teamMembers.map((member, index) => (
                <SwiperSlide key={index} virtualIndex={index}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-lg shadow-lg p-6 mx-auto w-full sm:w-3/4"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 mx-auto rounded-full mb-4"
                    />
                    <h3 className="text-xl font-medium">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.role}</p>
                    <p className="mt-2 text-gray-700">{member.bio}</p>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
