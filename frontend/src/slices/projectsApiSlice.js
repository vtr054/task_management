import { apiSlice } from './apiSlice';

const PROJECTS_URL = '/projects';

export const projectsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query({
            query: () => ({
                url: PROJECTS_URL,
            }),
            providesTags: ['Project'],
        }),
        getProject: builder.query({
            query: (id) => ({
                url: `${PROJECTS_URL}/${id}`,
            }),
            providesTags: ['Project'],
        }),
        createProject: builder.mutation({
            query: (data) => ({
                url: PROJECTS_URL,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Project'],
        }),
        updateProject: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${PROJECTS_URL}/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Project'],
        }),
        deleteProject: builder.mutation({
            query: (id) => ({
                url: `${PROJECTS_URL}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Project'],
        }),
    }),
});

export const {
    useGetProjectsQuery,
    useGetProjectQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation
} = projectsApiSlice;
