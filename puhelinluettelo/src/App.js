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

const Notification = ({message, error}) => {
    if (message === null && error === null) {
        return null
    } else if (error !== null) {
        return (
            <div className='error'>{error}</div>
        )
    }

    return (
        <div className='notification'>{message}</div>
    )
} 

const App = () => {
    const [persons, setPersons] = useState([]) 
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setNewFilter] = useState('')
    const [notification, setNotification] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        personService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
            })
    }, [])

    const addPerson = (event) => {
        event.preventDefault()
        const person = persons.find(p => p.name === newName)

        if (person !== undefined) {
            const confirmed = window.confirm(
                `${newName} is already in the phonebook. Replace the old number with a new one?`
            )

            if (confirmed) {
                const updatedPerson = {...person, number: newNumber}

                personService
                    .update(person.id, updatedPerson)
                    .then(returnedPerson => {
                        setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
                        setNotification(
                            `Updated number of ${returnedPerson.name}`
                        )
                        setTimeout(() => {
                            setNotification(null)
                        }, 3000)
                })
                .catch(e => {
                    setError(
                        `Information of ${person.name} has already been deleted from server`
                    )
                    setTimeout(() => {
                        setError(null)
                    }, 3000)
                    setPersons(persons.filter(p => p.id !== person.id))
                })
            }
        } else {
            const newPerson = {
                name: newName,
                number: newNumber
            }
            
            personService
                .create(newPerson)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                    setNotification(
                        `Added ${returnedPerson.name}`
                    )
                    setTimeout(() => {
                        setNotification(null)
                    }, 3000)
                })
        }

        setNewName('')
        setNewNumber('')
    }

    const deletePersonWithId = (id, name) => {
        const confirmation = window.confirm(`Delete ${name} ?`)

        if (confirmation) {
            personService
            .remove(id)
            .then(() => {
                setPersons(persons.filter(person => person.id !== id))
                setNotification(
                    `Deleted ${name}`
                )
                setTimeout(() => {
                    setNotification(null)
                }, 3000)
            })
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
            <Notification message={notification} error={error} />
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