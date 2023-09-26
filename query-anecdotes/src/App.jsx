import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateAnecdote } from './requests'
import { useNotificationDispatch } from './notificationContext'

const App = () => {
  const notifDispatch = useNotificationDispatch()
  const queryClient = useQueryClient()
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 2,
    refetchOnWindowFocus: false
  })

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData({
        queryKey: ['anecdotes']
      })
      queryClient.setQueryData(
        { queryKey: ['anecdotes'] },
        anecdotes.map(anecdote =>
          anecdote.id !== updatedAnecdote.id
            ? anecdote
            : updatedAnecdote
        )
      )
    }
  })

  if (result.isLoading) {
    return <div>Loading data...</div>
  }

  if (result.isError) {
    return <div>Anecdote service not available due to problems in server</div>
  }
  
  const anecdotes = result.data

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
    notifDispatch({ type: 'SET_NOTIFICATION', payload: `You voted "${anecdote.content}" anecdote.`})
    setTimeout(() => {
      notifDispatch({ type: 'CLEAR_NOTIFICATION' })
    }, 5000)
  }

  return (

    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>

  )
}

export default App
