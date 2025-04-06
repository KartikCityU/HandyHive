import React, { useContext } from 'react'
import './ServiceDisplay.css'
import ServiceItem from '../ServiceItem/ServiceItem'
import { StoreContext } from '../../Context/StoreContext'

const ServiceDisplay = ({category}) => {

  const {service_list} = useContext(StoreContext);

  return (
    <div className='service-display' id='service-display'>
      <h2>Services in demand</h2>
      <div className='service-display-list'>
        {service_list.map((item) => {
          if (category === "All" || category === item.category) {
            return (
              <ServiceItem 
                key={item._id} 
                image={item.image} 
                name={item.name} 
                desc={item.description} 
                price={item.price} 
                id={item._id}
              />
            )
          }
          return null;
        })}
      </div>
    </div>
  )
}

export default ServiceDisplay