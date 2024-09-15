import axios from 'axios'
import { User } from '../store/usersSlice'

export const fetchUsersFromApi = async (): Promise<User[]> => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/users')
  return response.data
}
