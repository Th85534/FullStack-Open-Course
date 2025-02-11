const Header = ({ course }) => {
  return <h1>{course}</h1>;
};

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => (
        <p key={part.id}>
          {part.name} {part.exercises}
        </p>
      ))}
    </div>
  );
};

const Total = ({ parts }) => {
  const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0);
  return <p><strong>Total exercises: {totalExercises}</strong></p>;
};

const App = () => {
  const course = "Half Stack application development";
  const parts = [
    { id: 1, name: "Fundamentals of React", exercises: 10 },
    { id: 2, name: "Using props to pass data", exercises: 7 },
    { id: 3, name: "State of a component", exercises: 14 }
  ];

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  );
};

export default App;