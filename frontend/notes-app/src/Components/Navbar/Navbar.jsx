import React, { useState, useEffect } from 'react';
import ProfileInfo from '../Cards/ProfileInfo';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import { axiosInstance } from '../../Utils/axiosInstanse';

function Navbar({ userInfo, onSearchNote, handleClearSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [allNotes, setAllNotes] = useState([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery) {
      console.log("Searching for:", searchQuery);
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  const onLogout = () => {
    localStorage.clear();
    setIsLoggedOut(true);
  };

  useEffect(() => {
    getAllNotes();
    if (isLoggedOut) {
      navigate('/login');
    }
  }, [isLoggedOut, navigate]);

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      console.log("response notes", response);
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("error occur", error);
    }
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">Notes</h2>
      <SearchBar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
}

export default Navbar;
