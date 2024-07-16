import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar/Navbar';
import NoteCard from '../Components/Cards/NoteCard';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../Utils/axiosInstanse';
import Toast from '../Components/ToastMessage/Toast';
import EmptyCard from '../Components/EmptyCard/EmptyCard';

function Home() {
  const [openAddEditModal, setOpenAddEditModal] = useState({ isShow: false, type: "add", data: null });
  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const [showToastMsg, setShowToastMsg] = useState({ isShow: false, type: "add", message: "" });

// Home.jsx (or the component where onSearchNote is defined)
const onSearchNote = async (searchQuery) => {
  try {
    const response = await axiosInstance.get(`/search-notes?query=${encodeURIComponent(searchQuery)}`);
    if (response.data && response.data.notes) {
      console.log("Search results:", response.data.notes);
      // Handle search results here (e.g., updating state to display results)
    } else {
      console.log("No notes found for the search query.");
    }
  } catch (error) {
    console.error("Search error:", error);
  }
};



  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShow: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({ isShow: true, type, message });
  };

  const handleCloseToast = () => {
    setShowToastMsg({ isShow: false, message: "" });
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      setUserInfo(response.data.user);
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      setAllNotes(response.data.notes);
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);
      if (response.data && !response.data.error) {
        showToastMessage("Note deleted", "success");
        getAllNotes();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.log("error", error);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      getUserInfo();
      getAllNotes();
    }
  }, [navigate]);

  const handleOpenModal = () => {
    setOpenAddEditModal({ isShow: true, type: "add", data: null });
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    getAllNotes(); // Reset to all notes when search is cleared
  };

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} searchQuery={searchQuery} handleSearchInputChange={handleSearchInputChange} handleClearSearch={handleClearSearch}/>
      <div className="container mx-auto">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {allNotes.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={moment(item.createdOn).format('Do MMM YYYY')}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item)}
                onPinNote={() => {}}
              />
            ))}
          </div>
        ) : (
          <EmptyCard message="start creating your notes" />
        )}
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={handleOpenModal}
      >
        <span className="text-2xl text-white">+</span>
      </button>
      <Modal
        isOpen={openAddEditModal.isShow}
        onRequestClose={() => setOpenAddEditModal({ isShow: false, type: "add", data: null })}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => setOpenAddEditModal({ isShow: false, type: "add", data: null })}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>
      <Toast isShow={showToastMsg.isShow} message={showToastMsg.message} type={showToastMsg.type} onClose={handleCloseToast} />
    </>
  );
}

export default Home;
