import React from 'react'
import { useState } from 'react';

const MyProfile = () => {
    const [image, setImage] = useState(null);
  
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        setImage(URL.createObjectURL(file));
      }
    };
  
    return (
      <div className="p-8">
        <div className="w-full max-w-4xl mx-auto bg-white shadow rounded-lg p-8">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              {/* Avatar Image */}
              <img
                src={image || 'https://via.placeholder.com/150'}
                alt="User Avatar"
                className="w-28 h-28 rounded-full object-cover border-2 border-gray-200"
              />
            </div>
            <div>
              <p className="text-lg font-semibold">Your Photo</p>
              {/* <p className="text-sm text-gray-500 mb-4">This will be displayed on your profile</p> */}
              <label className="block mb-2">
                <input type="file" onChange={handleImageUpload} className="hidden" />
                <button className="px-4 py-2 text-sm bg-gray-100 border rounded-lg hover:bg-gray-200">Upload New</button>
              </label>
              {/* <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button> */}
            </div>
          </div>
  
          {/* Personal Information Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <label className="block">
                  <span className="text-gray-700">Full Name</span>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter your full name"
                  />
                </label>

                <label className="block">
                  <span className="text-gray-700">Gender</span>
                  <select className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-gray-700">Email Address</span>
                  <input
                    type="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter your email"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Phone Number</span>
                  <input
                    type="tel"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter your phone number"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Face Shape</span>
                  <select className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                    <option value="oval">Oval</option>
                    <option value="square">Square</option>
                    <option value="round">Round</option>
                    <option value="diamond">Diamond</option>
                    <option value="rectangular">Rectangular</option>
                    <option value="heart">Heart</option>
                  </select>
                </label>
              </div>

              <button  type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">  Save Changes</button>
            </form>
          </div>
        </div>
      </div>
    );
  };
  

export default MyProfile
