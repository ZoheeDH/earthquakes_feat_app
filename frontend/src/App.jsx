import { useState, useEffect, useRef } from 'react'
import featureService from './services/features'
import Feature from './components/Feature'
import FilterForm from './components/FilterForm'
import Notification from './components/Notification'

const App = () => {
  const [features, setFeatures] = useState([])
  const [pagination, setPagination] = useState({})
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    featureService
      .getFeatures({})
      .then(features => {
        setFeatures(features.data)
        setPagination(features.pagination)
      })
  }, [])

  const filterFeatures = (filter) => {
    featureService
      .getFeatures({ filter })
      .then(features => {
        setFeatures(features.data)
        setPagination(features.pagination)
      })
  }

  const filterRef = useRef()

  const handlePrev = (event) => {
    event.preventDefault()
    let aux=filter
    if (filterRef.current.currentPage > 1) {
      filterRef.current.setCurrentPage(filterRef.current.currentPage - 1)
      if (aux.match(/(\?|&)page/)) {
        aux = aux.includes('?page')
        ? aux.replace(/\?page=\d*/, '?page=' + (filterRef.current.currentPage - 1))
        : aux.replace(/&page=\d*/, '&page=' + (filterRef.current.currentPage - 1))
      } else {
        aux = aux.includes('?')
        ? aux.concat(`&page=${filterRef.current.currentPage - 1}`)
        : aux.concat(`?page=${filterRef.current.currentPage - 1}`)
      }
      filterFeatures(aux)
      setFilter(aux)
    }
  }

  const handleNext = (event) => {
    event.preventDefault()
    let aux=filter
    console.log(aux)
    if (filterRef.current.currentPage < pagination.total) {
      filterRef.current.setCurrentPage(filterRef.current.currentPage + 1)
      if (aux.match(/(\?|&)page/)) {
        aux = aux = aux.includes('?page')
        ? aux.replace(/\?page=\d*/, '?page=' + (filterRef.current.currentPage + 1))
        : aux.replace(/&page=\d*/, '&page=' + (filterRef.current.currentPage + 1))
      } else {
        aux = aux.includes('?')
          ? aux.concat(`&page=${filterRef.current.currentPage + 1}`)
          : aux.concat(`?page=${filterRef.current.currentPage + 1}`)
      }
      filterFeatures(aux)
      setFilter(aux)
    }
  }

  const handleNotification = ({ msg, type='success' }) => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => {
      setMessage(null)
      setMessageType(type === 'error' ? 'success' : 'error')
    }, 5000)
  }

  const handleComment = async ({feat_id, body}) => {
    try{
      await featureService
      .addComment({ feat_id, body })
      handleNotification({ msg: 'comment added successfully' })
    } catch(err){
      console.log(err)
      handleNotification({ msg: err.response.data.error, type: 'error' })
    }
    
  }

  return (
    <div>
      <h1>Past 30 days earthquakes</h1>
      <FilterForm 
        filterFeat={filterFeatures}
        pagination={pagination}
        setFilter={setFilter} 
        notif={handleNotification}
      />
      <Notification msg={message} type={messageType}/>
      {features.map(feature => (
        <Feature 
          key={feature.id}
          feature={feature}
          onComment={handleComment}
        />
      ))}
      <div>
        <button style={{marginRight: '5px'}} onClick={handlePrev}>{'Previus'}</button>
        { `${pagination.current_page} of ${pagination.total}` }
        <button style={{marginLeft: '5px'}} onClick={handleNext}>{'Next'}</button>
      </div>
    </div>
  )
}

export default App
