import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from '../notificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  //const [notification, dispatch] = useContext(NotificationContext)
  const dispatch = useNotificationDispatch()
  
  const newAnecdoteMutation = useMutation(createAnecdote, {
    onMutate: (newAnecdote) => {
      if (newAnecdote.content.length < 5) {
        dispatch({
          type: 'SET_NOTIFICATION',
          payload: 'The anecdote is too short, it must have a length of 5 or more.'
        })
        setTimeout(() => {
          dispatch({ type: 'CLEAR_NOTIFICATION' })
        }, 5000)
        throw new Error('The anecdote is too short, it must have a length of 5 or more.')
      }
    },
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData({
        queryKey: ['anecdotes']
      })
      queryClient.setQueryData(
        { queryKey: ['anecdotes'] },
        anecdotes.concat(newAnecdote)
      )
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
    dispatch({ type: 'SET_NOTIFICATION', payload: 'New anecdote successfully added!'})
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, 5000)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
