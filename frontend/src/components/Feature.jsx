import { useState } from "react"

const Feature = ({ feature }) => {
  const featureStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [visible, setVisible] = useState(false)
  
  const hideDetails = {display: visible ? 'none' : ''}
  const showDetails = {display: visible ? '' : 'none'}

  const calculateDate = (time) => {
    const date = new Date(time)
    return date.toUTCString()
  }

  const handleDetails = () => {
    setVisible(!visible)
  }

  return (
    <div style={featureStyle}>
      <div style={hideDetails}>
        {feature.attributes.title} - {calculateDate(feature.attributes.time)}
        <button style={{marginLeft: '10px'}} key={feature.id} onClick={handleDetails}>more</button>
      </div>
      <div style={showDetails}>
        <div className="title">
          {feature.attributes.title} - {calculateDate(feature.attributes.time)}
          <button style={{marginLeft: '10px'}} key={feature.id} onClick={handleDetails}>less</button>
        </div>
        <div className="details">
          <ul>
            <li>Location: { feature.attributes.place }</li>
            <li>Coordinates:
              <ul>
                <li>Longitude: { feature.attributes.coordinates.longitude }</li>
                <li>Latitude: { feature.attributes.coordinates.latitude }</li>
              </ul>
            </li>
            <li>Magnitude: { feature.attributes.magnitude }</li>
            <li>Magnitude Type: { feature.attributes.mag_type }</li>
            <li>Tsunami: { feature.attributes.tsunami ? 'Yes' : 'No' }</li>
            <li>URL: 
              <a href={feature.links.external_url} target="_blank">{ feature.links.external_url }</a>
            </li>
          </ul>
        </div>
      </div>
    </div>    
  )
}

export default Feature