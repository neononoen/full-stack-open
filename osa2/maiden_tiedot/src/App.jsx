import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {

  const [ search, setSearch ] = useState('')
  const [ countries, setCountries ] = useState(null)

  useEffect(() => {
    if (countries) {
    axios
    .get(`https://studies.cs.helsinki.fi/restcountries/${}`)
    .then(response => {
      setCountries(response.data)
    })
  }
  }, [countries])

  const handleSearch = (event) => {
    setSearch(event.target.value)
    console.log(search)

  return (
    <div>
      find countries <input value={search} onChange={handleSearch} />
    </div>
  )
}

export default App
