import React, {useState, useEffect} from 'react'
import axios from 'axios'

const Search = ({value, onChange}) => (
    <div>
        Find countries: <input value={value} onChange={onChange}></input>
    </div>
)

const Country = ({country}) => (
    <div>
        <h1>{country.name}</h1>
        <p>
            <span>Capital: {country.capital} </span><br/>
            <span>Population: {country.population} </span>
        </p>
        <h2>Languages</h2>
        <ul>
            {country.languages.map(language =>
                <li key={language.iso639_2}>{language.name}</li>
            )}
        </ul>
        <img src={country.flag} alt='The flag of the country' width='20%' height='20%'></img>
    </div>
)

const Content = ({countries, onClick}) => {
    const results = countries.length
    
    if (results > 1 && results < 11) {
        return (
            <>
                {countries.map(country =>
                    <p key={country.name}>
                        <span>{country.name} </span>
                        <button value={country.name} onClick={onClick}>Show</button>
                    </p>
                )}
            </>
        )
    } else if (results === 1) {
        return (
            <Country country={countries[0]} />
        )
    } else if (results === 0) {
        return (
            <p>No matches found.</p>
        )
    }

    return (
        <p>
            Too many matches, specify another filter.
        </p>
    )
}

const App = () => {
    const [countries, setCountries] = useState([])
    const [newSearch, setNewSearch] = useState('')

    useEffect(() => {
        axios
            .get('https://restcountries.eu/rest/v2/all')
            .then(response => {
                setCountries(response.data)
            })
    }, [])

    const handleSearchChange = (event) => {
        setNewSearch(event.target.value)
    }

    const handleShowClick = (event) => {
        setNewSearch(event.target.value)
    }

    const countriesToShow = newSearch === ''
        ? countries
        : countries.filter(country => country.name.toLowerCase().includes(newSearch.toLowerCase()))

    return (
        <>
            <Search value={newSearch} onChange={handleSearchChange} />
            <Content countries={countriesToShow} onClick={handleShowClick} />
        </>
    )
}

export default App