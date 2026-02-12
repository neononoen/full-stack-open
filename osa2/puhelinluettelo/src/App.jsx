import { useState, useEffect } from 'react'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  useEffect (() => {
    personService
      .getAll()
        .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = { name: newName, number: newNumber }
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        
        const person = persons.find(person => person.name === newName)
        const updatedPerson = { ...person, number: newNumber }
        
        personService
          .replace(person.id, updatedPerson)
            .then(returnedPerson => {
              setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
              setMessage(`${newName} number changed`)
              setTimeout(() => {
                setMessage(null)
              }, 5000)
              setNewName('')
              setNewNumber('')
            })
            .catch(error => {
              console.log(error.response.data)
              const errorMessage = error.response.data.error || `${newName} has already been removed from server`
              setMessage(errorMessage)
              setTimeout(() => {
              setMessage(null)
              }, 5000)
              if (!error.response.data) {
              setPersons(persons.filter(p => p.id !== person.id))
              }
            })
      }
    } else {
      personService
        .add(personObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setMessage(`Added ${newName}`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            console.log(error.response.data)
            const errorMessage = error.response.data.error
            setMessage(errorMessage)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
        }
      }

  const removePerson = (event) => {
    const id = event.target.value
    const person = persons.find(p => p.id === id)
    console.log(person)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
          setPersons(persons.filter(person => person.id !== id))
          
          setMessage(`Deleted ${person.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        }
      }

  const handleNameChange = (event) => {    
    console.log(event.target.value)    
    setNewName(event.target.value)  
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    console.log(filter)
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
        <Notification message={message} />
        <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
        <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        />
      <h2>Numbers</h2>
        <Persons filter={filter} persons={persons} removePerson={removePerson} />
    </div>
  )
}

const Filter = (props) => {
  return (
    <div>
      filter shown with <input
      value={props.filter}
      onChange={props.handleFilterChange}
      />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        name: <input 
        value={props.newName}
        onChange={props.handleNameChange} 
        />
      </div>
      <div>
        number: <input
        value={props.newNumber}
        onChange={props.handleNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = (props) => {
  const personsToShow = props.filter === ''
    ? props.persons
    : props.persons.filter(person => person.name.toLowerCase().includes(props.filter.toLowerCase()))

  return (
    <div>
    {personsToShow.map(person =>
      <li key={person.id}>
      {person.name} {person.number}
      <Button id={person.id} onClick={props.removePerson} />
      </li>
    )}
    </div>
  )
}

const Button = ({ id, onClick}) => <button type='button' onClick={onClick} value={id} >delete</button>

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div>
      {message}
    </div>
  )
}
export default App
