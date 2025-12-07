import React from "react";

const Contact = () => {
  return (
    <section className="py-20 px-4 bg-linear-to-br from-blue-50 via-white to-purple-50">
      
      {/* Title */}
      <div className="text-center mb-20 animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
          Get in Touch
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
          Start your journey to Pakistan's most beautiful destinations. Book a trusted guide and make your travel safe, easy, and unforgettable.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-14 max-w-6xl mx-auto">
        
        {/* Left Card */}
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-xl rounded-3xl p-10 space-y-6 animate-slideInLeft">
          <h2 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Let's Talk
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Connect with us to plan your unforgettable journey across Pakistan. Our expert guides ensure your trip is safe, authentic, and full of beautiful memories.
          </p>

          <div className="space-y-4 pt-4">
            <p className="text-gray-800 text-lg">
              <span className="font-semibold">Email:</span> shehzadaqib511@gmail.com
            </p>
            <p className="text-gray-800 text-lg">
              <span className="font-semibold">Phone:</span> 03015440307
            </p>
            <p className="text-gray-800 text-lg">
              <span className="font-semibold">Location:</span> Haripur, Pakistan
            </p>
          </div>
        </div>

        {/* Right Card / Form */}
        <form className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-xl rounded-3xl p-10 flex flex-col gap-6 animate-slideInRight">

          <div>
            <label className="text-gray-800 font-semibold">Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full mt-2 border border-gray-300 rounded-xl p-4 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="text-gray-800 font-semibold">Your Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-2 border border-gray-300 rounded-xl p-4 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="text-gray-800 font-semibold">Write your message here</label>
            <textarea
              rows="6"
              placeholder="Enter your message"
              className="w-full mt-2 border border-gray-300 rounded-xl p-4 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl py-4 text-lg font-semibold shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all"
          >
            Submit Now
          </button>

        </form>
      </div>
    </section>
  );
};

export default Contact;
