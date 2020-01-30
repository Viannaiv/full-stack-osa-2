import React from 'react';
import Course from './components/Course'

const Header = ({text}) => {
    return (
        <h1>{text}</h1>
    )
}

const App = ({courses}) => {
    return (
        <>
            <Header text='Web development curriculum' />
            {courses.map(course => 
                <Course key={course.id} course={course} />
            )}
        </>
    )
}

export default App