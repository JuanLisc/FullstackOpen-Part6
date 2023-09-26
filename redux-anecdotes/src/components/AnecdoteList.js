import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <>
      <li>
        {anecdote.content}
        <br></br>
        <strong>Votes: {anecdote.votes} <button onClick={handleClick}>Vote!</button></strong>
      </li>
      <br></br>
    </>
  )
} 

const AnecdotesList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    if (filter === '') {
      return anecdotes
    }
    return anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
  })
  const anecdotesSorted = anecdotes.slice().sort((a, b) => b.votes - a.votes)

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    dispatch(showNotification(`You voted "${anecdote.content}"!`, 5))
  }
  return (
    <ul>
      {anecdotesSorted.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => vote(anecdote)}
        />
      )}
    </ul>
  )
}

export default AnecdotesList