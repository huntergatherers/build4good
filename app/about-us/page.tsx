import React from "react";

export default function AboutUs() {
    return (
        <div className=" py-12 px-6 md:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-green-700 mb-8">
                    About Us
                </h1>
                <div className="space-y-8">
                    <p className="text-lg text-gray-700">
                        Welcome to{" "}
                        <span className="text-green-500 font-semibold">
                            ComPost
                        </span>
                        !
                    </p>
                    <div className="bg-green-50 border-gray-700 p-6 rounded-lg shadow-lg">
                        <h1 className="text-xl font-medium text-green-700">
                            What we do{" "}
                        </h1>
                        <p className="text-md text-gray-700">
                            We're here to connect food scrap donors and
                            receivers in the composting community.
                        </p>
                    </div>
                    <div className="bg-green-50 border-gray-700 p-6 rounded-lg shadow-lg">
                        <h1 className="text-xl font-medium text-green-700">
                            Our Mission{" "}
                        </h1>
                        <p className="text-md text-gray-700">
                            Our mission is to create a cleaner, greener
                            Singapore by turning food waste into a valuable
                            resource.
                        </p>
                    </div>
                    <div className="bg-green-50 border-gray-700 p-6 rounded-lg shadow-lg">
                        <h1 className="text-xl font-medium text-green-700">
                            Our Community{" "}
                        </h1>
                        <p className="text-md text-gray-700">
                            Every contribution, big or small, makes a
                            difference. Together, we can create a cleaner,
                            greener Singapore.
                        </p>
                    </div>

                    <p className="text-md text-gray-700">
                        Thank you for being a part of{" "}
                        <span className="text-green-500 font-semibold">
                            ScrapBook
                        </span>
                        !
                    </p>
                </div>
            </div>
        </div>
    );
}
