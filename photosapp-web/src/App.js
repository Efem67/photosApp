import React, { useState, useEffect } from 'react';
import OnePhotoComponent from './components/OnePhotoComponent';


function MainPage() {

  const [imagesArr, setImagesArr] = useState([]);

  useEffect(() => {
    getData()
  }, []);

  const getData = () => {
    const headers = { "Content-Type": "application/json" };

    fetch("http://192.168.0.157:5000/uploaded", {
      method: "get", headers
    })
      .then((response) => response.json())
      .then((data) => {
        const images = data.map(el => { return { fileName: el.fileName, select: false } })
        setImagesArr(images)
      }
      );

  };

  const selectAll = () => {
    const images = imagesArr.map(obj => { return { ...obj, select: !obj.select } })
    setImagesArr(images)
  }


  const selectSingleItem = (fileName) => {
    const images = imagesArr.map(obj => {
      return { ...obj, select: fileName == obj.fileName ? !obj.select : obj.select }
    })
    setImagesArr(images)
  }

  const removeSelected = (toDelete) => {
    let data;

    if (toDelete) data = { selected: [toDelete] }
    else data = { selected: imagesArr.filter(obj => obj.select).map(el => { return el.fileName }) }

    if (data.selected.length < 1) return;

    const headers = { "Content-Type": "application/json" };
    fetch("http://192.168.0.157:5000/deleteSelectedFiles", { method: "post", headers, body: JSON.stringify(data) })
      .then((response) => response.json())
      .then(() => getData())
  }


  return (
    <div>
      <div className='w-full bg-rose-500 py-6 text-center'>
        <h1 className='text-2xl sm:text-4xl font-bold text-white'>Uploaded images</h1>
      </div>
      <div className='w-full p-2 flex bg-rose-200 justify-center items-center'>
        <button onClick={() => getData()} className='px-3 sm:px-6 border hover:bg-rose-50 bg-white rounded-md sm:text-lg mx-1'>Reload</button>
        <button onClick={() => selectAll()} className='px-3 sm:px-6 border hover:bg-rose-50 bg-white rounded-md sm:text-lg mx-1'>Select All</button>
        <button onClick={() => removeSelected()} className='px-3 sm:px-6 border hover:bg-rose-50 bg-white rounded-md sm:text-lg mx-1'>Remove Selected</button>
      </div>
      <div className='flex flex-wrap justify-center items-center'>
        {imagesArr.map(image => {
          return <OnePhotoComponent
            key={image.fileName}
            imageName={image.fileName}
            reload={() => getData()}
            select={image.select}
            delete={() => removeSelected(image.fileName)}
            selectItem={() => selectSingleItem(image.fileName)} />
        })
        }
      </div>
    </div>
  );

}

export default MainPage;