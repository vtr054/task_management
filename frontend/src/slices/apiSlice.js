import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    credentials: 'include',
    prepareHeaders: (headers) => {
        // If we store token in state, we *could* attach it here, but we are using httpOnly cookies.
        // However, for some endpoints/logic we might return a token.
        // The backend implementation sends a token in JSON AND a cookie.
        // Let's rely on Cookie for persistence if browser handles it, or localStorage token if we want.
        // Backend `protect` middleware checks Cookie then Header.
        return headers;
    }
});

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['User', 'Project', 'Task'],
    endpoints: (builder) => ({}),
});
