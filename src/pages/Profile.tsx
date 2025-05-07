
import React from 'react';
import ProfileForm from '@/components/ProfileForm';

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-fitness-darkBlue">Your Profile</h1>
      
      <ProfileForm />
    </div>
  );
};

export default Profile;
