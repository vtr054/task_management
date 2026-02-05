import { apiSlice } from './apiSlice';

const USERS_URL = '/auth';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/login`,
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/register`,
                method: 'POST',
                body: data,
            }),
        }),
        getProfile: builder.query({
            query: () => ({
                url: `${USERS_URL}/profile`,
                method: 'GET'
            })
        }),
        getUsers: builder.query({
            query: () => ({
                url: '/users',
            }),
            providesTags: ['User']
        }),
        updateUser: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/users/${id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['User']
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['User']
        })
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useGetProfileQuery,
    useGetUsersQuery,
    useUpdateUserMutation,
    useDeleteUserMutation
} = usersApiSlice;
