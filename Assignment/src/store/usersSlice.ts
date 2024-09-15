import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { fetchUsersFromApi } from '../api/api'

export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
}

export interface UsersState {
  users: User[]
  filteredUsers: User[]
  loading: boolean
  error: string | null
  filters: {
    name: string
    username: string
    email: string
    phone: string
  }
  isCopyEnabled: boolean
}

const initialState: UsersState = {
  users: [],
  filteredUsers: [],
  loading: false,
  error: null,
  filters: {
    name: '',
    username: '',
    email: '',
    phone: '',
  },
  isCopyEnabled: false,
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  return await fetchUsersFromApi()
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFilter(
      state,
      action: PayloadAction<{ key: keyof UsersState['filters']; value: string }>
    ) {
      const { key, value } = action.payload

      state.filters[key] = value

      state.filteredUsers = state.users.filter((user) => {
        const isNameMatch =
          !state.filters.name ||
          user.name.toLowerCase().includes(state.filters.name.toLowerCase())
        const isUsernameMatch =
          !state.filters.username ||
          user.username
            .toLowerCase()
            .includes(state.filters.username.toLowerCase())
        const isEmailMatch =
          !state.filters.email ||
          user.email.toLowerCase().includes(state.filters.email.toLowerCase())
        const isPhoneMatch =
          !state.filters.phone || user.phone.includes(state.filters.phone)

        return isNameMatch && isUsernameMatch && isEmailMatch && isPhoneMatch
      })
    },
    setCopyEnabled(state, action: PayloadAction<boolean>) {
      state.isCopyEnabled = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
        state.filteredUsers = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch users'
      })
  },
})

export const { setFilter, setCopyEnabled } = usersSlice.actions

export default usersSlice.reducer
