import React, { useState, useContext, createContext } from 'react';
import {
	ApolloProvider,
	ApolloClient,
	InMemoryCache,
	HttpLink,
	gql,
} from '@apollo/client';

import useLocalStorage from './useLocalStorage.js';
const authContext = createContext();

const LOGIN_MUTATION = gql`
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    ... on Auth {
      token
      user {
        email
        username
      }
    }

    ... on UserError {
      message
    }
  }
}
`;

export function AuthProvider({ children }) {
	const auth = useProvideAuth();

	return (
		<authContext.Provider value={auth}>
			<ApolloProvider client={auth.createApolloClient()}>
				{children}
			</ApolloProvider>
		</authContext.Provider>
	);
}

export const useAuth = () => {
	return useContext(authContext);
};

function useProvideAuth() {
	const [authToken, setAuthToken] = useLocalStorage('token', null);
	const [usernameLocal, setUsernameLocal] = useLocalStorage('username', null);

	const isSignedIn = () => {
		return authToken ? true : false;
	};

	const getAuthHeaders = () => {
		if (!authToken) return null;

		return {
			Authorization: `Bearer ${authToken}`,
		};
	};

	const createApolloClient = () => {
		const link = new HttpLink({
			uri: 'https://statusme.rayhanadev.repl.co/graphql',
			headers: getAuthHeaders(),
		});

		return new ApolloClient({
			link,
			cache: new InMemoryCache(),
		});
	};

	const signIn = async ({ username, password }) => {
		const client = createApolloClient();

		const result = await client.mutate({
			mutation: LOGIN_MUTATION,
			variables: { username, password },
		});

		if (result?.data?.login?.token) {
			setAuthToken(result.data.login.token);
			setUsernameLocal(result.data.login.user.username);
		}

		return result;
	};

	const signOut = () => {
		setAuthToken(null);
		setUsernameLocal(null);
	};

	return {
		setAuthToken,
		getAuthHeaders,
		isSignedIn,
		signIn,
		signOut,
		createApolloClient,
	};
}
