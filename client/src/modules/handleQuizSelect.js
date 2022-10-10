// helper function to pull ID from deeply nested html elements 
const handleQuizSelect = (e, setterFunc) => {
  const id = `${e.target.id}${e.target.parentElement.id}${e.target.parentElement.parentElement.id}`
  setterFunc(id);
};

export {handleQuizSelect}