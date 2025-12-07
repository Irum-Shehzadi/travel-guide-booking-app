const HeroSection = () => {
    return (
        <section className="relative w-full h-screen">

            {/* Background Hero Image */}
            <img
                src="/hero.jpg"
                alt="Hero Background"
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
            />

            {/* Overlay Content */}
            <div className="relative z-10 px-10 py-20 max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center h-full">

                {/* TEXT SIDE */}
                <div className="flex flex-col justify-start md:justify-start -mt-2.5">

                    <h1 className="text-5xl font-extrabold text-gray-900 leading-tight md:mt-0 mt-10">
                        Best <span className="text-blue-600">Destination</span> <br />
                        Around Pakistan
                    </h1>
                    {/* Added attractive travel line */}
                    <p className="mt-6 text-gray-700 text-lg md:text-xl">
                        Discover breathtaking places, experience new adventures, and create unforgettable memories!
                    </p>
                </div>

                {/* IMAGE SIDE */}
                <div className="flex justify-center items-center">
                    <img
                        src="/hero-traveller.png"
                        alt="Travel Girl"
                        className="w-[380px] md:w-[480px] drop-shadow-2xl"
                    />
                </div>

            </div>

        </section>
    );
};

export default HeroSection;
