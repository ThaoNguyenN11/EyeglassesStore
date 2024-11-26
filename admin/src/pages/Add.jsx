import React, { useState } from 'react';
import { assets } from '../assets/assets';

const Add = ({ addProduct }) => {
  const [images, setImages] = useState([]);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory] = useState('EyeGlasses');
  const [productSubCategory, setProductSubCategory] = useState('EyeGlasses');
  const [productPrice, setProductPrice] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [bestseller, setBestseller] = useState(false);

  const handleImageChange = (event) => {
    const fileList = Array.from(event.target.files);
    if (images.length < 4) {
      setImages((prevImages) => [...prevImages, ...fileList]);
    }
  };

  const handleAddImage = () => {
    document.getElementById('imageUpload').click();
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newProduct = {
      _id: `p_${Date.now()}`, // tạo ID duy nhất
      name: productName,
      description: productDescription,
      price: productPrice,
      images: images.map((image) => URL.createObjectURL(image)), // tạo URL tạm thời cho ảnh
      category: productCategory,
      subCategory: productSubCategory,
      colors: selectedColor ? [selectedColor] : [],
      bestseller,
    };

    addProduct(newProduct); // Gọi hàm addProduct từ component cha
    resetForm();
  };

  const resetForm = () => {
    setProductName('');
    setProductDescription('');
    setProductCategory('EyeGlasses');
    setProductSubCategory('EyeGlasses');
    setProductPrice('');
    setImages([]);
    setSelectedColor('');
    setBestseller(false);
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload image</p>
        <div className='flex gap-2'>
          <button type="button" onClick={handleAddImage} className='w-20'>
            <img src={assets.upload_area} alt="Upload" />
          </button>
          <input 
            type="file" 
            id="imageUpload" 
            hidden 
            accept="image/*" 
            onChange={handleImageChange} 
          />
        </div>
        <div className='flex gap-2 mt-2'>
          {images.map((image, index) => (
            <div key={index} className='relative'>
              <img src={URL.createObjectURL(image)} alt={`Uploaded ${index}`} className='w-20 h-20 object-cover' />
              <button 
                type='button' 
                onClick={() => handleRemoveImage(index)} 
                className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1'>
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input 
          className='w-full max-w-[500px] px-3 py-2' 
          type="text" 
          placeholder='Type here' 
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>
      <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <textarea 
          className='w-full max-w-[500px] px-3 py-2' 
          placeholder='Type here' 
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        />
      </div>
      
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product category</p>
          <select 
            className='w-full px-3 py-2' 
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
          >
            <option value="EyeGlasses">EyeGlasses</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Sub category</p>
          <select 
            className='w-full px-3 py-2' 
            value={productSubCategory}
            onChange={(e) => setProductSubCategory(e.target.value)}
          >
            <option value="EyeGlasses">EyeGlasses</option>
            <option value="SunGlasses">SunGlasses</option>
            <option value="Lens">Lens</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product price</p>
          <input 
            className='w-full px-3 py-2 sm:w-[120px]' 
            type="number" 
            placeholder='1000' 
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />
        </div>
      </div>

      <div>
        <p className='mb-2'>Product colors</p>
        <div className='flex gap-3'>
          {['Red', 'Blue', 'Green', 'Black', 'White'].map((color) => (
            <div key={color}>
              <p 
                className={`bg-slate-200 px-3 py-1 cursor-pointer ${selectedColor === color ? 'border-2 border-green-500' : ''}`} 
                onClick={() => setSelectedColor(color)} 
              >
                {color}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div className='flex gap-2 mt-2'>
        <input 
          type="checkbox" 
          id='bestseller' 
          checked={bestseller}
          onChange={(e) => setBestseller(e.target.checked)}
        />
        <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
      </div>

      <button className='w-28 py-3 mt-4 bg-black text-white' type='submit'>Add</button>
    </form>
  );
};

export default Add;
