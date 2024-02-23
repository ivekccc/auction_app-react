import React, { useState } from 'react';
import axios from 'axios';

function ProfilePage({ logedUser, setLogedUser,token }) {
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState(logedUser);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/profile', formData, {
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      });
      setLogedUser(response.data.user);
      setEditable(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error, for example, show an error message to the user
    }
  };

  const toggleEdit = () => {
    setEditable(!editable);
    if (!editable) {
      setFormData(logedUser);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2>User Profile</h2>
        <form onSubmit={handleSubmit} className='profilePageForm'>
          <div className="form-group">
            <label>Name:</label>
            {editable ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            ) : (
              <span>{logedUser.name}</span>
            )}
          </div>
          <div className="form-group">
            <label>Username:</label>
            {editable ? (
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            ) : (
              <span>{logedUser.username}</span>
            )}
          </div>
          <div className="form-group">
            <label>Email:</label>
            {editable ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            ) : (
              <span>{logedUser.email}</span>
            )}
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            {editable ? (
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
              />
            ) : (
              <span>{logedUser.phone_number}</span>
            )}
          </div>
          <div className="form-group">
            <label>Balance:</label>
            <span>${logedUser.balance}</span>
          </div>
          <div className="button-group">
            <button type="button" onClick={toggleEdit}>
              {editable ? 'Cancel' : 'Edit'}
            </button>
            {editable && <button type="submit">Save</button>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
