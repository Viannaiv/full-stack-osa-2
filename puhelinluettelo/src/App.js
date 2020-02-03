import React, {useState, useEffect} from 'react'
import axios from 'axios'

const Filter = ({value, onChange}) => (
    <div>
        filter shown numbers with <input value={value} onChange={onChange}></input>
    </div>
)

const PersonForm = ({onSubmit, nameValue, numberValue, nameOnChange, numberOnChange}) => (
    <form onSubmit={onSubmit}>
        <div>
            Name: <input value={nameValue} onChange={nameOnChange} />
        </div>
        <div>
            Number: <input value={numberValue} onChange={numberOnChange} />
        </div>
        <div>
            <button type="submit">Add</button>
        </div>
    </form>
)

const Persons = ({persons}) => (
    <>
        {persons.map(person =>
            <p key={person.name}>{person.name} {person.number}</p>
        )}
    </>
)

const App = () => {
    const [persons, setPersons] = useState([]) 
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setNewFilter] = useState('')

    useEffect(() => {
        axios
            .get('http://localhost:3001/persons')
            .then(response => {
                setPersons(response.data)
            })
    }, [])

    const addPerson = (event) => {
        event.preventDefault()

        if (persons.find(person => person.name === newName)) {
            alert(`${newName} is already in the phonebook`)
        } else {
            const newPerson = {
                name: newName,
                number: newNumber
            }
            
            axios
                .post('http://localhost:3001/persons', newPerson)
                .then(request => setPersons(persons.concat(newPerson)))
        }

        setNewName('')
        setNewNumber('')
    }

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handleFilterChange = (event) => {
        setNewFilter(event.target.value)
    }

    const personsToShow = newFilter === ''
        ? persons
        : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

    return (
        <div>
            <h1>Phonebook</h1>
            <h2>Add a number</h2>
            <PersonForm 
                onSubmit={addPerson}
                nameValue={newName} nameOnChange={handleNameChange}
                numberValue={newNumber} numberOnChange={handleNumberChange} 
            />
            <h2>Numbers</h2>
            <Filter value={newFilter} onChange={handleFilterChange} />
            <Persons persons={personsToShow} />
        </div>
    )
}

export default App