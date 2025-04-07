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
        {service_list.map((service) => {
          if (category === "All" || category === service.category) {
            return (
              <ServiceItem 
              key={service._id}
              id={service._id}
              name={service.name}
              price={service.price}
              desc={service.description}
              image={service.image}
              category={service.category}
              duration={service.duration}
              priceType={service.priceType}  // Make sure these props are included
              minimumCharge={service.minimumCharge}
              requiresConsultation={service.requiresConsultation}
              tags={service.tags}
              availableDaysInWeek={service.availableDaysInWeek}
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