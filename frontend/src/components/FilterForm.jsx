import { useState, forwardRef, useImperativeHandle } from "react"

const FilterFeatures = forwardRef((props, refs) => {
  const [items, setItems] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useImperativeHandle(refs, () => {
    return {
      currentPage,
      setCurrentPage
    }
  })

  const handleFilter = (event) => {
    event.preventDefault()
    try {
      const form = document.getElementById('aux')
      const formData = new FormData(form)
      const totalPages = props.pagination.total
      let aux = '?'
      for (const [key, value] of formData.entries()) {
        aux = aux.concat(`${key}=${value}&`)
      }
      if (items > 1000) {
        props.notif({ msg: 'max items per page: 1000', type: 'error' })
        setItems(1000)
      }
      if (currentPage > totalPages) {
        props.notif({ msg: `there is only ${totalPages} pages`, type: 'error' })
        setCurrentPage(1)
      } else {
        aux = aux.concat(`per_page=${items}&page=${currentPage}`)
        props.filterFeat(aux)
        props.setFilter(aux)
      }
    }
    catch (err) {
      props.notif({ msg: err.message, type: 'error' })
    }
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
            placeholder={props.pagination.per_page}
            value={items}
            onChange={({ target }) => { setItems(target.value)}}
          /> 
          Page:
          <input 
            style={{marginRight: '10px'}}
            size='2'
            type='text'
            value={currentPage}
            onChange={({ target }) => { setCurrentPage(target.value)}}
          />
          of {props.pagination.total}
        </div>
        <button type='submit'>Filter</button>
      </form>
    </div>
  )
})

FilterFeatures.displayName = 'FilterFeatures'

export default FilterFeatures