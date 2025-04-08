import React, { useContext } from 'react'
import './ExploreServices.css'
import { StoreContext } from '../../Context/StoreContext'

const ExploreServices = ({category, setCategory}) => {

  const {service_categories} = useContext(StoreContext);
  
  return (
    <div className='explore-services' id='explore-services'>
      <h1>Explore our services</h1>
      <p className='explore-services-text'>Browse our diverse selection of home services, from repairs to renovations. Our mission is to simplify home maintenance and enhance your living space, one professional solution at a time.</p>
      <div className="explore-services-list">
        
        {/* service categories */}
        {service_categories.map((item, index) => {
            return (
                <div 
                  onClick={() => setCategory(item.category_name)} 
                  key={index} 
                  className='explore-services-list-item'
                >
                    <img 
                      src={item.category_image} 
                      className={category === item.category_name ? "active" : ""} 
                      alt={item.category_name} 
                    />
                    <p>{item.category_name}</p>
                </div>
            )
        })}
      </div>
      <hr />
    </div>
  )
}

export default ExploreServices