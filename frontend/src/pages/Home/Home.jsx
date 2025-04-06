import React, { useState } from 'react'
import Header from '../../components/Header/Header'
import AppDownload from '../../components/AppDownload/AppDownload'
import ServiceDisplay from '../../components/ServiceDisplay/ServiceDisplay'
import ExploreServices from '../../components/ExploreServices/ExploreServices'

const Home = () => {

  const [category,setCategory] = useState("All")

  return (
    <>
      <Header/>
      <ExploreServices setCategory={setCategory} category={category}/>
      <ServiceDisplay category={category}/>
      <AppDownload/>
    </>
  )
}

export default Home
