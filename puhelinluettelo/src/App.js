import React, {useState, useEffect} from 'react'
import personService from './services/persons'

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

const Person = ({person, deletePerson}) => (
    <p>
        <span>{person.name} {person.number} </span>
        <button onClick={deletePerson}>Delete</button>
    </p>
)

const App = () => {
    const [persons, setPersons] = useState([]) 
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setNewFilter] = useState('')

    useEffect(() => {
        personService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
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
            
            personService
                .create(newPerson)
                .then(returnedPerson => setPersons(persons.concat(returnedPerson)))
        }

        setNewName('')
        setNewNumber('')
    }

    const deletePersonWithId = (id, name) => {
        const confirmation = window.confirm(`Delete ${name} ?`)

        if (confirmation) {
            personService
            .remove(id)
            .then(setPersons(persons.filter(person => person.id !== id)))
        }
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
            {personsToShow.map(person =>
                <Person 
                    key={person.name}
                    person={person}
                    deletePerson={() => deletePersonWithId(person.id, person.name)}
                />
            )}
        </div>
    )
}

export default App