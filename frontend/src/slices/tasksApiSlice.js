import { apiSlice } from './apiSlice';

const TASKS_URL = '/tasks';

export const tasksApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTasks: builder.query({
            query: (projectId) => ({
                url: TASKS_URL,
                params: projectId ? { projectId } : {},
            }),
            providesTags: ['Task'],
        }),
        createTask: builder.mutation({
            query: (data) => ({
                url: TASKS_URL,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Task'],
        }),
        updateTask: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${TASKS_URL}/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Task'],
        }),
        deleteTask: builder.mutation({
            query: (id) => ({
                url: `${TASKS_URL}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Task'],
        }),
    }),
});

export const {
    useGetTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation
} = tasksApiSlice;
