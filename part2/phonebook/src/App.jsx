import { useState, useEffect } from 'react';
import phonebookService from './services/phonebook';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ message: null, type: 'success' });
  console.log(persons)
  useEffect(() => {
    phonebookService.getAll()
      .then(initialPersons => setPersons(initialPersons))
      .catch(() => showNotification("Error fetching contacts", "error"));
  }, []);

  const handleInputChange = (setter) => (event) => setter(event.target.value);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: null, type: 'success' }), 4000);
  };

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase());

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already in the phonebook, replace the old number with a new one?`
      );

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        phonebookService.update(existingPerson._id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person._id !== existingPerson._id ? person : returnedPerson));
            showNotification(`Updated ${newName}'s number`, 'success');
          })
          .catch(error => {
            showNotification(`Error: ${newName} was already removed from server`, 'error');
            setPersons(persons.filter(person => person._id !== existingPerson._id));
          });
        
        setNewName('');
        setNewNumber('');
      }
    } else {
      const newPerson = { name: newName, number: newNumber };

      phonebookService.create(newPerson)
        .then(returnedPerson => {
          setPersons(prevPersons => prevPersons.concat(returnedPerson));
          showNotification(`Added ${newName}`, 'success');
        })
        .catch((err) => {
          console.error(err)
          showNotification(`Error adding ${newName}`, 'error')
        });

      setNewName('');
      setNewNumber('');
    }
  };

  const deletePerson = (id) => {

    const person = persons.find(p => p._id === id);

    if (window.confirm(`Delete ${person.name}?`)) {
        phonebookService.remove(id)
            .then(() => {
                setPersons(prevPersons => prevPersons.filter(p => p._id !== id));
                showNotification(`Deleted ${person.name}`, 'success');
            })
            .catch((err) => {
                console.log(err);
                showNotification(`Error: ${person.name} was already removed from server`, 'error');
                setPersons(prevPersons => prevPersons.filter(p => p._id !== id));
            });
    }
  };


  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <div>
        Filter by name: <input value={searchTerm} onChange={handleInputChange(setSearchTerm)} />
      </div>
      <h3>Add a new</h3>
      <form onSubmit={addPerson}>
        <div>
          Name: <input value={newName} onChange={handleInputChange(setNewName)} />
        </div>
        <div>
          Number: <input value={newNumber} onChange={handleInputChange(setNewNumber)} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h3>Numbers</h3>
      <ul>
        {filteredPersons.map(person => (
          <li key={person._id}>
            {person.name} {person.number} 
            <button onClick={() => deletePerson(person._id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
