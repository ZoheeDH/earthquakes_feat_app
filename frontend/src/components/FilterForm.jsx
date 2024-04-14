import { useState } from "react"

const FilterFeatures = (props) => {
  const [items, setItems] = useState(1000)

  const handleFilter = (event) => {
    event.preventDefault()
    const form = document.getElementById('aux')
    const formData = new FormData(form)
    let aux = '?'
    for (const [key, value] of formData.entries()) {
      aux = aux.concat(`${key}=${value}&`)
    }
    aux = aux.concat(`per_page=${items}&page=${props.currentPage}`)
    if (items > 1000) setItems(1000)
    props.filterFeat(aux)
    props.setFilter(aux)
  }

  return (
    <div>
      Filter by magnitude type:
      <form id='aux' onSubmit={handleFilter} action=''>
        <div className='checkboxes'>
          <input type='checkbox' name='mag_type[]' value='md'/>md
          <input type='checkbox' name='mag_type[]' value='ml'/>ml
          <input type='checkbox' name='mag_type[]' value='ms'/>ms
          <input type='checkbox' name='mag_type[]' value='mw'/>mw
          <input type='checkbox' name='mag_type[]' value='me'/>me
          <input type='checkbox' name='mag_type[]' value='mi'/>mi
          <input type='checkbox' name='mag_type[]' value='mb'/>mb
          <input type='checkbox' name='mag_type[]' value='mlg'/>mlg
        </div>
        <div>
          Items per page: 
          <input 
            style={{marginRight: '10px'}}
            size='3'
            type='text'
            defaultValue={props.pagination.per_page}
            onChange={({ target }) => { setItems(target.value)}}
          /> 
          Page:
          <input 
            style={{marginRight: '10px'}}
            size='2'
            type='text'
            defaultValue={props.pagination.current_page}
            onChange={({ target }) => { props.setCurrentPage(target.value)}}
          />
          of {props.pagination.total}
        </div>
        <button type='submit'>Filter</button>
      </form>
    </div>
  )
}

export default FilterFeatures