import React from 'react';
import { getInitials } from '../../Utils/helper';

function ProfileInfo({ userInfo, onLogout }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {userInfo?.fullname ? getInitials(userInfo.fullname) : 'N/A'}
      </div>
      <div>
        <p>{userInfo?.fullname ? userInfo.fullname : 'Guest'}</p>
        <button className="text-primary" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

export default ProfileInfo;
