import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { userApi } from "../mainApi";
import { useDispatch } from "react-redux";
import { setLoading, setLogin } from "../redux/authSlice";

const UserProfile = () => {
  const { userData } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ age: "", height: "", weight: "" });
  const dispatch = useDispatch();

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${userApi}/getuserdata`, {
        withCredentials: true,
      });

      console.log("API Response:", res.data.data);

      if (res.data) {
        // The user data is in res.data.data
        setProfile(res.data.data);
        return res.data.data;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchUserData();
    }
  }, [userData]);

  const handleEditClick = () => {
    if (profile) {
      setEditForm({ name: profile.name, email: profile.email });
      setIsEditing(true);
    }
  };

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${userApi}/calculatebmr`, editForm, {
        withCredentials: true,
      });

      if (res.data.success) {
        // Refetch the updated user data
        const updatedUserData = await fetchUserData();
        dispatch(setLogin(updatedUserData));
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert("Update failed. Please try again.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Update failed. Please try again.");
    }
  };

  //   if (!profile) {
  //     return (
  //       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
  //         <div className="text-center">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
  //           <p className="mt-4 text-gray-600">Loading profile...</p>
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">
        {/* Profile Header */}
        {console.log(profile)}
        <div className="text-center mb-10">
          <div className="w-32 h-32 rounded-full bg-green-200 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-blue-600 font-bold">
              {profile?.name ? profile?.name.charAt(0).toUpperCase() : "U"}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-voilet-800 mb-1">
            {profile?.name || "No Name"}
          </h1>
          <p className="text-gray-600 mb-2">{profile?.email || "No Email"}</p>
          <p className="text-gray-500 capitalize">
            Gender: {profile?.gender || "Not specified"}
          </p>

          {profile?.bmr && (
            <p className="text-gray-500 mt-2">
              BMR: {profile?.bmr} calories/day
            </p>
          )}

          <button
            onClick={handleEditClick}
            className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Fill Profile
          </button>
        </div>

        {/* Additional Information Section */}
        <div className="grid md:grid-cols-1 gap-6 mb-10">
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-purple-700 mb-4">
              Personal Information
            </h3>
            <div className="space-y-3">
              {/* <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <span className="font-mono text-sm">{profile?._id}</span>
              </div> */}
              <div className="flex justify-between">
                <span className="text-gray-600">Height:</span>
                <span className="text-gray-800">
                  {profile?.height}
                  {/* You might want to add createdAt to your user model */}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weight:</span>
                <span className="text-gray-800">
                  {profile?.weight}
                  {/* You might want to add createdAt to your user model */}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Age:</span>
                <span className="text-gray-800">
                  {profile?.age}
                  {/* You might want to add createdAt to your user model */}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {/* <div>
          <h3 className="text-xl font-semibold text-purple-700 mb-4">
            Your Reviews
          </h3>

          {profile.reviews && profile.reviews.length > 0 ? (
            <div className="space-y-4">
              {profile.reviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm border-l-4 border-purple-500"
                >
                  <h4 className="text-lg font-bold text-gray-800">
                    {review.title || `Review #${index + 1}`}
                  </h4>
                  <p className="text-sm text-gray-600 my-2">
                    {review.reviewText || "No review text provided."}
                  </p>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Rating:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < (review.rating || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.19 3.674h3.862c.969 0 1.371 1.24.588 1.81l-3.124 2.27 1.19 3.674c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.124 2.27c-.785.57-1.84-.197-1.54-1.118l1.19-3.674-3.124-2.27c-.783-.57-.38-1.81.588-1.81h3.862l1.19-3.674z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                You haven't submitted any reviews yet.
              </p>
            </div>
          )}
        </div> */}

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-purple-700">
                Update Profile (BMR Info)
              </h2>

              {/* Age */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={editForm.age}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              {/* Height */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={editForm.height}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              {/* Weight */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={editForm.weight}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
