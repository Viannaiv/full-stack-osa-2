import React from 'react';

const Header = ({text}) => {
    return (
        <h2>{text}</h2>
    )
}

const Part = ({part}) => {
    return (
        <p>{part.name} {part.exercises}</p>
    )
}

const Content = ({parts}) => {
    return (
        <>  
            {parts.map(part => 
                <Part key={part.id} part={part} />
            )} 
        </>
    )
}

const Total = ({parts}) => {
    return (
        <p>
            <strong>
                Total of {parts.reduce(
                    (sum, part) => sum + part.exercises, 0
                )} exercises
            </strong>
        </p>
    )
}  

const Course = ({course}) => {
    return (
        <>
            <Header text={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </>
    )
}

export default Course