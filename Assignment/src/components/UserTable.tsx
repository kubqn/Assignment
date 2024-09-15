import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchUsers,
  setCopyEnabled,
  setFilter,
  UsersState,
} from '../store/usersSlice'
import { AppDispatch, RootState } from '../store/store'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../assets/switch.css'

const UserTable = () => {
  const dispatch = useDispatch<AppDispatch>()
  // const [isCopyEnabled, setIsCopyEnabled] = useState(false) // in normal scenario, isCopyEnabled would probably be used only here, so would use useState instead of dispatch
  const { filteredUsers, loading, error, filters, isCopyEnabled } = useSelector(
    (state: RootState) => state.users
  )
  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const handleFilterChange = (
    key: keyof UsersState['filters'],
    value: string
  ) => {
    dispatch(setFilter({ key, value }))
  }

  const toggleCopyEnabled = () => {
    dispatch(setCopyEnabled(!isCopyEnabled))
  }

  const copyToClipboard = (text: string) => {
    if (isCopyEnabled)
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success(`${text} copied to clipboard.`)
        })
        .catch((err) => {
          toast.error('Cannot copy to clipboard: ' + err)
        })
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Could not load User Management Table: {error}</div>

  return (
    <div>
      <h2>User Management Table</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>
              Name
              <input
                type='text'
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                placeholder='Search by name'
              />
            </th>
            <th>
              Username
              <input
                type='text'
                value={filters.username}
                onChange={(e) => handleFilterChange('username', e.target.value)}
                placeholder='Search by username'
              />
            </th>
            <th>
              Email
              <input
                type='text'
                value={filters.email}
                onChange={(e) => handleFilterChange('email', e.target.value)}
                placeholder='Search by email'
              />
            </th>
            <th>
              Phone
              <input
                type='text'
                value={filters.phone}
                onChange={(e) => handleFilterChange('phone', e.target.value)}
                placeholder='Search by phone'
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr className={isCopyEnabled ? 'table-hover' : ''} key={user.id}>
                <td>{user.id}</td>
                <td onClick={() => copyToClipboard(user.name)}>{user.name}</td>
                <td onClick={() => copyToClipboard(user.username)}>
                  {user.username}
                </td>
                <td onClick={() => copyToClipboard(user.email)}>
                  {user.email}
                </td>
                <td onClick={() => copyToClipboard(user.phone)}>
                  {user.phone}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No users found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className='switch-container'>
        <label className='switch'>
          <input
            type='checkbox'
            checked={isCopyEnabled}
            onChange={toggleCopyEnabled}
          />
          <span className='slider round'></span>
          <p>Copy on click</p>
        </label>
      </div>
      <ToastContainer autoClose={2000} position='bottom-center' />
    </div>
  )
}

export default UserTable
