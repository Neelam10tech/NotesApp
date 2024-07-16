import React from 'react'

function EmptyCard({img, message}) {
  return (
    <div>
        <div className='flex flex-col items-center justify-center mt-20'>
        <img  src = {img} alt='no notes' className='w-60'/>
        <p className='w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5'>
            {message}
        </p>
    </div>
    </div>
  )
}

export default EmptyCard