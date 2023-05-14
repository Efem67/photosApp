import React, { useState, useEffect } from 'react';

function OnePhotoComponent(props) {

    const removeExtension = (filename) => {
        return filename.substring(0, filename.lastIndexOf('.')) || filename;
    }
    const [editFlag, setEditFlag] = useState(false);
    const [name, setName] = useState(removeExtension(props.imageName));

    const changeName = () => {
        const data = { prevName: props.imageName, newName: name + "." + props.imageName.split('.').pop() }

        const headers = { "Content-Type": "application/json" };
        fetch("http://192.168.0.157:5000/rename", { method: "post", headers, body: JSON.stringify(data) })
            .then((response) => response.json())
            .then(() => props.reload())
    }


    return (
        <div className='border-rose-400 border-2 w-80 sm:w-64 m-2 p-2 rounded-md'>
            <div className='p-2 flex items-center justify-center'>
                <h1 className={`truncate text-center text-lg ${editFlag ? 'hidden' : ''}`}>
                    {props.imageName}
                </h1>
                <input onChange={(e) => setName(e.target.value)} type='text' placeholder='set text' value={name} className={`truncate text-center text-lg border-b border-rose-500 focus:ring-0 outline-0 ${!editFlag ? 'hidden' : ''}`}>

                </input>

            </div>
            <div className='flex justify-center items-center'>
                <img className='w-48 h-48 rounded-sm object-cover' src={`http://192.168.0.157:5000/upload/${props.imageName}`}></img>
            </div>
            {editFlag ? (
                <div className='flex justify-center items-center p-2'>
                    <button onClick={changeName} className='border border-rose-400 px-1 rounded-sm bg-rose-100 mx-1'>Ok</button>
                    <button onClick={() => {
                        setEditFlag(false)
                        setName(removeExtension(props.imageName))
                    }} className='border border-rose-400 px-1 rounded-sm bg-rose-100 mx-1'>Cancel</button>
                </div>
            ) : (
                <div className='flex justify-center items-center p-2'>
                    <button onClick={() => props.delete()} className='border border-rose-400 px-1 rounded-sm bg-rose-100 mx-1'>Delete</button>
                    <button onClick={() => setEditFlag(true)} className='border border-rose-400 px-1 rounded-sm bg-rose-100 mx-1'>Edit</button>
                    <input type='checkbox' onChange={() => props.selectItem()} checked={props.select} className='mx-1 accent-rose-500 cursor-pointer' ></input>
                </div>
            )}
        </div>
    );

}

export default OnePhotoComponent;
