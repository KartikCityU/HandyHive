import React, { useState } from 'react'
import './AddService.css'
import { assets, url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddService = () => {
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Plumbing",
        duration: 60,
        priceType: "fixed",
        requiresConsultation: false,
        minimumCharge: "",
        tags: ""
    });

    const serviceCategories = [
        "Plumbing",
        "Electrical",
        "Cleaning",
        "Painting",
        "Driver",
        "Home Repair",
        "Appliance Repair",
        "Landscaping",
        "HVAC",
        "Moving"
    ];

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!image) {
            toast.error('Service image not selected');
            return null;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("duration", Number(data.duration));
        formData.append("priceType", data.priceType);
        formData.append("requiresConsultation", data.requiresConsultation);
        
        // Only add minimum charge if price type is not fixed and a value is provided
        if (data.priceType !== "fixed" && data.minimumCharge) {
            formData.append("minimumCharge", Number(data.minimumCharge));
        }
        
        // Process tags - convert comma-separated string to array
        if (data.tags.trim()) {
            const tagsArray = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            formData.append("tags", JSON.stringify(tagsArray));
        }
        
        // Add the image file
        formData.append("image", image);
        
        try {
            const response = await axios.post(`${url}/api/services/add`, formData);
            if (response.data.success) {
                toast.success(response.data.message);
                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: data.category,
                    duration: 60,
                    priceType: "fixed",
                    requiresConsultation: false,
                    minimumCharge: "",
                    tags: ""
                });
                setImage(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error adding service:", error);
            toast.error("Failed to add service");
        }
    }

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    return (
        <div className='add-service'>
            <h2>Add New Service</h2>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className='add-img-upload flex-col'>
                    <p>Upload Service Image</p>
                    <input 
                        onChange={(e) => { setImage(e.target.files[0]); e.target.value = '' }} 
                        type="file" 
                        accept="image/*" 
                        id="image" 
                        hidden 
                    />
                    <label htmlFor="image">
                        <img 
                            src={!image ? assets.upload_area : URL.createObjectURL(image)} 
                            alt="Upload area" 
                            className="upload-image-preview"
                        />
                    </label>
                </div>
                
                <div className='add-service-name flex-col'>
                    <p>Service Name</p>
                    <input 
                        name='name' 
                        onChange={onChangeHandler} 
                        value={data.name} 
                        type="text" 
                        placeholder='e.g. Pipe Leak Repair' 
                        required 
                    />
                </div>
                
                <div className='add-service-description flex-col'>
                    <p>Service Description</p>
                    <textarea 
                        name='description' 
                        onChange={onChangeHandler} 
                        value={data.description} 
                        rows={6} 
                        placeholder='Describe what this service includes and any important details' 
                        required 
                    />
                </div>
                
                <div className='add-category-section'>
                    <div className='add-category flex-col'>
                        <p>Service Category</p>
                        <select name='category' onChange={onChangeHandler} value={data.category}>
                            {serviceCategories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className='add-price flex-col'>
                        <p>Service Price</p>
                        <input 
                            type="Number" 
                            name='price' 
                            onChange={onChangeHandler} 
                            value={data.price} 
                            placeholder='e.g. 75' 
                            required
                        />
                    </div>
                </div>
                
                <div className='add-service-details'>
                    <div className='add-duration flex-col'>
                        <p>Estimated Duration (minutes)</p>
                        <input 
                            type="Number" 
                            name='duration' 
                            onChange={onChangeHandler} 
                            value={data.duration} 
                            placeholder='e.g. 60' 
                            min="15"
                            step="15"
                        />
                    </div>
                    
                    <div className='add-price-type flex-col'>
                        <p>Price Type</p>
                        <select name='priceType' onChange={onChangeHandler} value={data.priceType}>
                            <option value="fixed">Fixed Price</option>
                            <option value="hourly">Hourly Rate</option>
                            <option value="estimate">Estimate (Final price may vary)</option>
                        </select>
                    </div>
                </div>
                
                {data.priceType !== "fixed" && (
                    <div className='add-minimum-charge flex-col'>
                        <p>Minimum Charge {data.priceType === "estimate" ? "(Optional)" : ""}</p>
                        <input 
                            type="Number" 
                            name='minimumCharge' 
                            onChange={onChangeHandler} 
                            value={data.minimumCharge} 
                            placeholder='e.g. 50' 
                            required={data.priceType === "hourly"}
                        />
                        <small className="input-hint">
                            Minimum amount customer will be charged even for small jobs
                        </small>
                    </div>
                )}
                
                <div className='add-service-tags flex-col'>
                    <p>Service Tags (Optional)</p>
                    <input 
                        type="text" 
                        name='tags' 
                        onChange={onChangeHandler} 
                        value={data.tags} 
                        placeholder='e.g. emergency, water, same-day (comma separated)' 
                    />
                    <small className="input-hint">
                        Add keywords to help customers find this service, separated by commas
                    </small>
                </div>
                
                <div className='add-consultation-requirement'>
                    <label className="consultation-checkbox-label">
                        <input 
                            type="checkbox" 
                            name="requiresConsultation" 
                            checked={data.requiresConsultation} 
                            onChange={onChangeHandler}
                        />
                        <span>This service requires an initial consultation</span>
                    </label>
                    {data.requiresConsultation && (
                        <p className="consultation-hint">
                            When checked, customers will be informed that an initial consultation is required before the service can be performed.
                        </p>
                    )}
                </div>
                
                <button type='submit' className='add-service-btn'>ADD SERVICE</button>
            </form>
        </div>
    )
}

export default AddService