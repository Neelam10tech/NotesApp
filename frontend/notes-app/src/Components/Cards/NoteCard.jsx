import React from 'react';
import { MdCreate, MdDelete, MdOutlinePushPin } from 'react-icons/md';

function NoteCard({ title, date, content, tags, isPinned, onEdit, onDelete, onPinNote }) {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <h6 className="text-sm font-medium">{title}</h6>
        <div className="flex items-center">
          <span className="text-xs text-slate-500 mr-2">{date}</span>
          <MdOutlinePushPin
            className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300'}`}
            onClick={onPinNote}
          />
        </div>
      </div>
      <p className="text-xs text-slate-600 mt-2">{content?.slice(0, 60)}</p>
      <div className="flex items-center justify-between mt-2">
        <div className="flex-xs text-slate-500">{tags.map((item) => `#${item}`)}</div>
        <div>
          <MdCreate className="icon-btn hover:text-green-600" onClick={onEdit} />
          <MdDelete className="icon-btn hover:text-red-500" onClick={onDelete} />
        </div>
      </div>
    </div>
  );
}

export default NoteCard;
