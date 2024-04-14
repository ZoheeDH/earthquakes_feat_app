import { useState, useEffect } from 'react'
import featureService from './services/features'
import Feature from './components/Feature'
import FilterForm from './components/FilterForm'

const App = () => {
  const [features, setFeatures] = useState([])
  const [pagination, setPagination] = useState({})
  const [filter, setFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

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

  const handlePrev = (event) => {
    event.preventDefault()
    let aux=filter
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      if (aux.match(/(\?|&)page/)) {
        aux = aux.includes('?page')
        ? aux.replace(/\?page=\d*/, '?page=' + (currentPage - 1))
        : aux.replace(/&page=\d*/, '&page=' + (currentPage - 1))
      } else {
        aux = aux.includes('?')
        ? aux.concat(`&page=${currentPage - 1}`)
        : aux.concat(`?page=${currentPage - 1}`)
      }
      filterFeatures(aux)
      setFilter(aux)
    }
  }

  const handleNext = (event) => {
    event.preventDefault()
    let aux=filter
    console.log(aux)
    if (currentPage < pagination.total) {
      setCurrentPage(currentPage + 1)
      if (aux.match(/(\?|&)page/)) {
        aux = aux = aux.includes('?page')
        ? aux.replace(/\?page=\d*/, '?page=' + (currentPage + 1))
        : aux.replace(/&page=\d*/, '&page=' + (currentPage + 1))
      } else {
        aux = aux.includes('?')
          ? aux.concat(`&page=${currentPage + 1}`)
          : aux.concat(`?page=${currentPage + 1}`)
      }
      filterFeatures(aux)
      setFilter(aux)
    }
  }

  return (
    <div>
      <h1>Past 30 days earthquakes</h1>
      <FilterForm 
        filterFeat={filterFeatures}
        pagination={pagination}
        setFilter={setFilter}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}  
      />
      {features.map(feature => (<Feature key={feature.id} feature={feature} />))}
      <div>
        <button style={{marginRight: '5px'}} onClick={handlePrev}>{'Previus'}</button>
        { `${pagination.current_page} of ${pagination.total}` }
        <button style={{marginLeft: '5px'}} onClick={handleNext}>{'Next'}</button>
      </div>
    </div>
  )
}

export default App
