import React from 'react';


export default function HomePageBasic() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Book Doctor Appointments Easily
            </h1>
            <p className="text-xl mb-8">
              Connect with the best doctors in your area
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Expert Doctors</h3>
              <p className="text-gray-600">Verified doctors across specializations</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
              <p className="text-gray-600">Book at your convenience</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Quality Care</h3>
              <p className="text-gray-600">Professional healthcare</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
