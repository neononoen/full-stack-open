const Course = ({ course }) => {
  return (
    <div>
    <Header course={course} />
    <Content course={course} />
    <Total course={course} />
  </div>
  )
}

const Header = (props) => {
  return (
    <div>
      <h2>{props.course.name}</h2>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
    {props.course.parts.map(part =>
      <li key={part.id}>
        <Part part={part} />
      </li>
    )}
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p> {props.part.name} {props.part.exercises} </p>
    </div>
  )
}

const Total = (props) => {
  const total = props.course.parts.map(part => part.exercises).reduce((acc, curr) => acc + curr, 0)
  return (
    <div>
      <p>
        <strong>total of {total} exercises</strong>
      </p>
    </div>
  )
}   

export default Course