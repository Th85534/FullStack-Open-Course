import axios from 'axios';

const baseUrl = 'https://ominous-adventure-g6977jqxpjpcwq5q-3001.app.github.dev/persons';

const getAll = () => axios.get(baseUrl).then(response => response.data);

const create = (newPerson) => axios.post(baseUrl, newPerson).then(response => response.data);

const update = (id, updatedPerson) => axios.put(`${baseUrl}/${id}`, updatedPerson).then(response => response.data);

const remove = (id) => axios.delete(`${baseUrl}/${id}`);

export default { getAll, create, update, remove };
