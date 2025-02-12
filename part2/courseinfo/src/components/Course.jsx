const Header = ({ course }) => {
    return <h1>{course}</h1>;
};
  
const Content = ({ parts }) => {
    return (
      <div>
        {parts.map((part, index) => (
          <p key={index}>
            {part.name} {part.exercises}
          </p>
        ))}
      </div>
    );
};
  
const Total = ({ parts }) => {
    const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0);
    return <p><strong>Total of {totalExercises} exercises</strong></p>;
};

const Course = ({course}) => {
    return(
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

export default Course;