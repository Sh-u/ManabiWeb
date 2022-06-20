import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Deck = {
  __typename?: 'Deck';
  _id: Scalars['Int'];
  createdAt: Scalars['String'];
  posts: Array<Post>;
  subscribers: Array<DeckSubscriber>;
  title: Scalars['String'];
  updatedAt: Scalars['String'];
  user: User;
};

export type DeckResponse = {
  __typename?: 'DeckResponse';
  decks?: Maybe<Array<Deck>>;
  errors?: Maybe<Scalars['String']>;
};

export type DeckSubscriber = {
  __typename?: 'DeckSubscriber';
  _id: Scalars['Int'];
  user: User;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type LoginInput = {
  email?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
  username?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changeEmail: UserResponse;
  changePassword: UserResponse;
  changeUsername: UserResponse;
  createDeck: DeckResponse;
  createPost: PostResponse;
  deleteDeck: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  removePost: Scalars['Boolean'];
  renameDeck?: Maybe<Deck>;
  subscribeToDeck: DeckResponse;
  unsubscribeToDeck: Scalars['Boolean'];
  updatePostTitle?: Maybe<Post>;
  uploadAvatar: Scalars['Boolean'];
};


export type MutationChangeEmailArgs = {
  newEmail: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationChangeUsernameArgs = {
  newUsername: Scalars['String'];
};


export type MutationCreateDeckArgs = {
  title: Scalars['String'];
};


export type MutationCreatePostArgs = {
  deckId: Scalars['Int'];
  image: Scalars['Upload'];
  options: PostInput;
};


export type MutationDeleteDeckArgs = {
  _id: Scalars['Float'];
};


export type MutationForgotPasswordArgs = {
  username: Scalars['String'];
};


export type MutationLoginArgs = {
  options: LoginInput;
};


export type MutationRegisterArgs = {
  options: RegisterInput;
};


export type MutationRemovePostArgs = {
  _id: Scalars['Float'];
};


export type MutationRenameDeckArgs = {
  _id: Scalars['Float'];
  title: Scalars['String'];
};


export type MutationSubscribeToDeckArgs = {
  deckId: Scalars['Float'];
};


export type MutationUnsubscribeToDeckArgs = {
  deckId: Scalars['Float'];
};


export type MutationUpdatePostTitleArgs = {
  _id: Scalars['Float'];
};


export type MutationUploadAvatarArgs = {
  image: Scalars['Upload'];
};

export type Post = {
  __typename?: 'Post';
  _id: Scalars['Int'];
  createdAt: Scalars['String'];
  deck: Deck;
  dictionaryAudio?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  sentence: Scalars['String'];
  updatedAt: Scalars['String'];
  userAudio?: Maybe<Scalars['String']>;
  word: Scalars['String'];
};

export type PostInput = {
  sentence: Scalars['String'];
  word: Scalars['String'];
};

export type PostResponse = {
  __typename?: 'PostResponse';
  error: Scalars['String'];
  post: Post;
};

export type Query = {
  __typename?: 'Query';
  findDeck: DeckResponse;
  getAllDecks: Array<Deck>;
  getMyDecks: DeckResponse;
  getUsers: Array<User>;
  hello: Scalars['String'];
  me?: Maybe<User>;
  post?: Maybe<Post>;
  posts: Array<Post>;
  searchForDeck: Array<Deck>;
};


export type QueryFindDeckArgs = {
  _id: Scalars['Int'];
};


export type QueryPostArgs = {
  _id: Scalars['Int'];
};


export type QuerySearchForDeckArgs = {
  input: Scalars['String'];
};

export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  decks: Array<Deck>;
  email: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type BasicUserFragment = { __typename?: 'User', createdAt: any, image?: string | null, email: string, _id: number, username: string, decks: Array<{ __typename?: 'Deck', _id: number, title: string, createdAt: string }> };

export type ChangeEmailMutationVariables = Exact<{
  newEmail: Scalars['String'];
}>;


export type ChangeEmailMutation = { __typename?: 'Mutation', changeEmail: { __typename?: 'UserResponse', user?: { __typename?: 'User', _id: number, username: string, email: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', createdAt: any, image?: string | null, email: string, _id: number, username: string, decks: Array<{ __typename?: 'Deck', _id: number, title: string, createdAt: string }> } | null } };

export type ChangeUsernameMutationVariables = Exact<{
  newUsername: Scalars['String'];
}>;


export type ChangeUsernameMutation = { __typename?: 'Mutation', changeUsername: { __typename?: 'UserResponse', user?: { __typename?: 'User', _id: number, username: string, email: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type CreateDeckMutationVariables = Exact<{
  title: Scalars['String'];
}>;


export type CreateDeckMutation = { __typename?: 'Mutation', createDeck: { __typename?: 'DeckResponse', errors?: string | null, decks?: Array<{ __typename?: 'Deck', createdAt: string, title: string, _id: number, user: { __typename?: 'User', _id: number, username: string } }> | null } };

export type CreatePostMutationVariables = Exact<{
  deckId: Scalars['Int'];
  options: PostInput;
  image: Scalars['Upload'];
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'PostResponse', error: string, post: { __typename?: 'Post', _id: number, sentence: string, word: string, image?: string | null, dictionaryAudio?: string | null, userAudio?: string | null, createdAt: string, updatedAt: string } } };

export type DeleteDeckMutationVariables = Exact<{
  _id: Scalars['Float'];
}>;


export type DeleteDeckMutation = { __typename?: 'Mutation', deleteDeck: boolean };

export type ForgotPasswordMutationVariables = Exact<{
  username: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  options: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', createdAt: any, image?: string | null, email: string, _id: number, username: string, decks: Array<{ __typename?: 'Deck', _id: number, title: string, createdAt: string }> } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  options: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', createdAt: any, image?: string | null, email: string, _id: number, username: string, decks: Array<{ __typename?: 'Deck', _id: number, title: string, createdAt: string }> } | null } };

export type RenameDeckMutationVariables = Exact<{
  _id: Scalars['Float'];
  title: Scalars['String'];
}>;


export type RenameDeckMutation = { __typename?: 'Mutation', renameDeck?: { __typename?: 'Deck', title: string } | null };

export type SubscribeToDeckMutationVariables = Exact<{
  deckId: Scalars['Float'];
}>;


export type SubscribeToDeckMutation = { __typename?: 'Mutation', subscribeToDeck: { __typename?: 'DeckResponse', errors?: string | null, decks?: Array<{ __typename?: 'Deck', _id: number, subscribers: Array<{ __typename?: 'DeckSubscriber', _id: number }> }> | null } };

export type UnsubscribeToDeckMutationVariables = Exact<{
  deckId: Scalars['Float'];
}>;


export type UnsubscribeToDeckMutation = { __typename?: 'Mutation', unsubscribeToDeck: boolean };

export type UploadAvatarMutationVariables = Exact<{
  image: Scalars['Upload'];
}>;


export type UploadAvatarMutation = { __typename?: 'Mutation', uploadAvatar: boolean };

export type FindDeckQueryVariables = Exact<{
  _id: Scalars['Int'];
}>;


export type FindDeckQuery = { __typename?: 'Query', findDeck: { __typename?: 'DeckResponse', decks?: Array<{ __typename?: 'Deck', _id: number, title: string, createdAt: string, updatedAt: string, user: { __typename?: 'User', _id: number, username: string, image?: string | null }, posts: Array<{ __typename?: 'Post', _id: number }>, subscribers: Array<{ __typename?: 'DeckSubscriber', _id: number }> }> | null } };

export type GetAllDecksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllDecksQuery = { __typename?: 'Query', getAllDecks: Array<{ __typename?: 'Deck', _id: number, posts: Array<{ __typename?: 'Post', _id: number }>, subscribers: Array<{ __typename?: 'DeckSubscriber', _id: number }> }> };

export type GetMyDecksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyDecksQuery = { __typename?: 'Query', getMyDecks: { __typename?: 'DeckResponse', errors?: string | null, decks?: Array<{ __typename?: 'Deck', createdAt: string, title: string, _id: number, user: { __typename?: 'User', _id: number, username: string, image?: string | null } }> | null } };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: Array<{ __typename?: 'User', createdAt: any, image?: string | null, email: string, _id: number, username: string, decks: Array<{ __typename?: 'Deck', _id: number, title: string, createdAt: string }> }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', createdAt: any, image?: string | null, email: string, _id: number, username: string, decks: Array<{ __typename?: 'Deck', _id: number, title: string, createdAt: string }> } | null };

export type PostsQueryVariables = Exact<{ [key: string]: never; }>;


export type PostsQuery = { __typename?: 'Query', posts: Array<{ __typename?: 'Post', _id: number, sentence: string, word: string, createdAt: string, updatedAt: string }> };

export type SearchForDeckQueryVariables = Exact<{
  input: Scalars['String'];
}>;


export type SearchForDeckQuery = { __typename?: 'Query', searchForDeck: Array<{ __typename?: 'Deck', title: string, _id: number, user: { __typename?: 'User', _id: number, image?: string | null } }> };

export const BasicUserFragmentDoc = gql`
    fragment BasicUser on User {
  createdAt
  image
  email
  _id
  username
  decks {
    _id
    title
    createdAt
  }
}
    `;
export const ChangeEmailDocument = gql`
    mutation ChangeEmail($newEmail: String!) {
  changeEmail(newEmail: $newEmail) {
    user {
      _id
      username
      email
    }
    errors {
      field
      message
    }
  }
}
    `;
export type ChangeEmailMutationFn = Apollo.MutationFunction<ChangeEmailMutation, ChangeEmailMutationVariables>;

/**
 * __useChangeEmailMutation__
 *
 * To run a mutation, you first call `useChangeEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeEmailMutation, { data, loading, error }] = useChangeEmailMutation({
 *   variables: {
 *      newEmail: // value for 'newEmail'
 *   },
 * });
 */
export function useChangeEmailMutation(baseOptions?: Apollo.MutationHookOptions<ChangeEmailMutation, ChangeEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeEmailMutation, ChangeEmailMutationVariables>(ChangeEmailDocument, options);
      }
export type ChangeEmailMutationHookResult = ReturnType<typeof useChangeEmailMutation>;
export type ChangeEmailMutationResult = Apollo.MutationResult<ChangeEmailMutation>;
export type ChangeEmailMutationOptions = Apollo.BaseMutationOptions<ChangeEmailMutation, ChangeEmailMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    errors {
      field
      message
    }
    user {
      ...BasicUser
    }
  }
}
    ${BasicUserFragmentDoc}`;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const ChangeUsernameDocument = gql`
    mutation ChangeUsername($newUsername: String!) {
  changeUsername(newUsername: $newUsername) {
    user {
      _id
      username
      email
    }
    errors {
      field
      message
    }
  }
}
    `;
export type ChangeUsernameMutationFn = Apollo.MutationFunction<ChangeUsernameMutation, ChangeUsernameMutationVariables>;

/**
 * __useChangeUsernameMutation__
 *
 * To run a mutation, you first call `useChangeUsernameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeUsernameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeUsernameMutation, { data, loading, error }] = useChangeUsernameMutation({
 *   variables: {
 *      newUsername: // value for 'newUsername'
 *   },
 * });
 */
export function useChangeUsernameMutation(baseOptions?: Apollo.MutationHookOptions<ChangeUsernameMutation, ChangeUsernameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeUsernameMutation, ChangeUsernameMutationVariables>(ChangeUsernameDocument, options);
      }
export type ChangeUsernameMutationHookResult = ReturnType<typeof useChangeUsernameMutation>;
export type ChangeUsernameMutationResult = Apollo.MutationResult<ChangeUsernameMutation>;
export type ChangeUsernameMutationOptions = Apollo.BaseMutationOptions<ChangeUsernameMutation, ChangeUsernameMutationVariables>;
export const CreateDeckDocument = gql`
    mutation CreateDeck($title: String!) {
  createDeck(title: $title) {
    decks {
      createdAt
      title
      user {
        _id
        username
      }
      _id
    }
    errors
  }
}
    `;
export type CreateDeckMutationFn = Apollo.MutationFunction<CreateDeckMutation, CreateDeckMutationVariables>;

/**
 * __useCreateDeckMutation__
 *
 * To run a mutation, you first call `useCreateDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDeckMutation, { data, loading, error }] = useCreateDeckMutation({
 *   variables: {
 *      title: // value for 'title'
 *   },
 * });
 */
export function useCreateDeckMutation(baseOptions?: Apollo.MutationHookOptions<CreateDeckMutation, CreateDeckMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDeckMutation, CreateDeckMutationVariables>(CreateDeckDocument, options);
      }
export type CreateDeckMutationHookResult = ReturnType<typeof useCreateDeckMutation>;
export type CreateDeckMutationResult = Apollo.MutationResult<CreateDeckMutation>;
export type CreateDeckMutationOptions = Apollo.BaseMutationOptions<CreateDeckMutation, CreateDeckMutationVariables>;
export const CreatePostDocument = gql`
    mutation CreatePost($deckId: Int!, $options: PostInput!, $image: Upload!) {
  createPost(deckId: $deckId, options: $options, image: $image) {
    error
    post {
      _id
      sentence
      word
      image
      dictionaryAudio
      userAudio
      createdAt
      updatedAt
    }
  }
}
    `;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      deckId: // value for 'deckId'
 *      options: // value for 'options'
 *      image: // value for 'image'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const DeleteDeckDocument = gql`
    mutation DeleteDeck($_id: Float!) {
  deleteDeck(_id: $_id)
}
    `;
export type DeleteDeckMutationFn = Apollo.MutationFunction<DeleteDeckMutation, DeleteDeckMutationVariables>;

/**
 * __useDeleteDeckMutation__
 *
 * To run a mutation, you first call `useDeleteDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDeckMutation, { data, loading, error }] = useDeleteDeckMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useDeleteDeckMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDeckMutation, DeleteDeckMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDeckMutation, DeleteDeckMutationVariables>(DeleteDeckDocument, options);
      }
export type DeleteDeckMutationHookResult = ReturnType<typeof useDeleteDeckMutation>;
export type DeleteDeckMutationResult = Apollo.MutationResult<DeleteDeckMutation>;
export type DeleteDeckMutationOptions = Apollo.BaseMutationOptions<DeleteDeckMutation, DeleteDeckMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($username: String!) {
  forgotPassword(username: $username)
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const LoginDocument = gql`
    mutation Login($options: LoginInput!) {
  login(options: $options) {
    errors {
      field
      message
    }
    user {
      ...BasicUser
    }
  }
}
    ${BasicUserFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($options: RegisterInput!) {
  register(options: $options) {
    errors {
      field
      message
    }
    user {
      ...BasicUser
    }
  }
}
    ${BasicUserFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const RenameDeckDocument = gql`
    mutation RenameDeck($_id: Float!, $title: String!) {
  renameDeck(_id: $_id, title: $title) {
    title
  }
}
    `;
export type RenameDeckMutationFn = Apollo.MutationFunction<RenameDeckMutation, RenameDeckMutationVariables>;

/**
 * __useRenameDeckMutation__
 *
 * To run a mutation, you first call `useRenameDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRenameDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [renameDeckMutation, { data, loading, error }] = useRenameDeckMutation({
 *   variables: {
 *      _id: // value for '_id'
 *      title: // value for 'title'
 *   },
 * });
 */
export function useRenameDeckMutation(baseOptions?: Apollo.MutationHookOptions<RenameDeckMutation, RenameDeckMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RenameDeckMutation, RenameDeckMutationVariables>(RenameDeckDocument, options);
      }
export type RenameDeckMutationHookResult = ReturnType<typeof useRenameDeckMutation>;
export type RenameDeckMutationResult = Apollo.MutationResult<RenameDeckMutation>;
export type RenameDeckMutationOptions = Apollo.BaseMutationOptions<RenameDeckMutation, RenameDeckMutationVariables>;
export const SubscribeToDeckDocument = gql`
    mutation SubscribeToDeck($deckId: Float!) {
  subscribeToDeck(deckId: $deckId) {
    decks {
      _id
      subscribers {
        _id
      }
    }
    errors
  }
}
    `;
export type SubscribeToDeckMutationFn = Apollo.MutationFunction<SubscribeToDeckMutation, SubscribeToDeckMutationVariables>;

/**
 * __useSubscribeToDeckMutation__
 *
 * To run a mutation, you first call `useSubscribeToDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [subscribeToDeckMutation, { data, loading, error }] = useSubscribeToDeckMutation({
 *   variables: {
 *      deckId: // value for 'deckId'
 *   },
 * });
 */
export function useSubscribeToDeckMutation(baseOptions?: Apollo.MutationHookOptions<SubscribeToDeckMutation, SubscribeToDeckMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubscribeToDeckMutation, SubscribeToDeckMutationVariables>(SubscribeToDeckDocument, options);
      }
export type SubscribeToDeckMutationHookResult = ReturnType<typeof useSubscribeToDeckMutation>;
export type SubscribeToDeckMutationResult = Apollo.MutationResult<SubscribeToDeckMutation>;
export type SubscribeToDeckMutationOptions = Apollo.BaseMutationOptions<SubscribeToDeckMutation, SubscribeToDeckMutationVariables>;
export const UnsubscribeToDeckDocument = gql`
    mutation UnsubscribeToDeck($deckId: Float!) {
  unsubscribeToDeck(deckId: $deckId)
}
    `;
export type UnsubscribeToDeckMutationFn = Apollo.MutationFunction<UnsubscribeToDeckMutation, UnsubscribeToDeckMutationVariables>;

/**
 * __useUnsubscribeToDeckMutation__
 *
 * To run a mutation, you first call `useUnsubscribeToDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnsubscribeToDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unsubscribeToDeckMutation, { data, loading, error }] = useUnsubscribeToDeckMutation({
 *   variables: {
 *      deckId: // value for 'deckId'
 *   },
 * });
 */
export function useUnsubscribeToDeckMutation(baseOptions?: Apollo.MutationHookOptions<UnsubscribeToDeckMutation, UnsubscribeToDeckMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnsubscribeToDeckMutation, UnsubscribeToDeckMutationVariables>(UnsubscribeToDeckDocument, options);
      }
export type UnsubscribeToDeckMutationHookResult = ReturnType<typeof useUnsubscribeToDeckMutation>;
export type UnsubscribeToDeckMutationResult = Apollo.MutationResult<UnsubscribeToDeckMutation>;
export type UnsubscribeToDeckMutationOptions = Apollo.BaseMutationOptions<UnsubscribeToDeckMutation, UnsubscribeToDeckMutationVariables>;
export const UploadAvatarDocument = gql`
    mutation UploadAvatar($image: Upload!) {
  uploadAvatar(image: $image)
}
    `;
export type UploadAvatarMutationFn = Apollo.MutationFunction<UploadAvatarMutation, UploadAvatarMutationVariables>;

/**
 * __useUploadAvatarMutation__
 *
 * To run a mutation, you first call `useUploadAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadAvatarMutation, { data, loading, error }] = useUploadAvatarMutation({
 *   variables: {
 *      image: // value for 'image'
 *   },
 * });
 */
export function useUploadAvatarMutation(baseOptions?: Apollo.MutationHookOptions<UploadAvatarMutation, UploadAvatarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadAvatarMutation, UploadAvatarMutationVariables>(UploadAvatarDocument, options);
      }
export type UploadAvatarMutationHookResult = ReturnType<typeof useUploadAvatarMutation>;
export type UploadAvatarMutationResult = Apollo.MutationResult<UploadAvatarMutation>;
export type UploadAvatarMutationOptions = Apollo.BaseMutationOptions<UploadAvatarMutation, UploadAvatarMutationVariables>;
export const FindDeckDocument = gql`
    query FindDeck($_id: Int!) {
  findDeck(_id: $_id) {
    decks {
      _id
      user {
        _id
        username
        image
      }
      posts {
        _id
      }
      title
      createdAt
      updatedAt
      subscribers {
        _id
      }
    }
  }
}
    `;

/**
 * __useFindDeckQuery__
 *
 * To run a query within a React component, call `useFindDeckQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindDeckQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindDeckQuery({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useFindDeckQuery(baseOptions: Apollo.QueryHookOptions<FindDeckQuery, FindDeckQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindDeckQuery, FindDeckQueryVariables>(FindDeckDocument, options);
      }
export function useFindDeckLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindDeckQuery, FindDeckQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindDeckQuery, FindDeckQueryVariables>(FindDeckDocument, options);
        }
export type FindDeckQueryHookResult = ReturnType<typeof useFindDeckQuery>;
export type FindDeckLazyQueryHookResult = ReturnType<typeof useFindDeckLazyQuery>;
export type FindDeckQueryResult = Apollo.QueryResult<FindDeckQuery, FindDeckQueryVariables>;
export const GetAllDecksDocument = gql`
    query GetAllDecks {
  getAllDecks {
    _id
    posts {
      _id
    }
    subscribers {
      _id
    }
  }
}
    `;

/**
 * __useGetAllDecksQuery__
 *
 * To run a query within a React component, call `useGetAllDecksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllDecksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllDecksQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllDecksQuery(baseOptions?: Apollo.QueryHookOptions<GetAllDecksQuery, GetAllDecksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllDecksQuery, GetAllDecksQueryVariables>(GetAllDecksDocument, options);
      }
export function useGetAllDecksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllDecksQuery, GetAllDecksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllDecksQuery, GetAllDecksQueryVariables>(GetAllDecksDocument, options);
        }
export type GetAllDecksQueryHookResult = ReturnType<typeof useGetAllDecksQuery>;
export type GetAllDecksLazyQueryHookResult = ReturnType<typeof useGetAllDecksLazyQuery>;
export type GetAllDecksQueryResult = Apollo.QueryResult<GetAllDecksQuery, GetAllDecksQueryVariables>;
export const GetMyDecksDocument = gql`
    query GetMyDecks {
  getMyDecks {
    decks {
      createdAt
      title
      user {
        _id
        username
        image
      }
      _id
    }
    errors
  }
}
    `;

/**
 * __useGetMyDecksQuery__
 *
 * To run a query within a React component, call `useGetMyDecksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyDecksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyDecksQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyDecksQuery(baseOptions?: Apollo.QueryHookOptions<GetMyDecksQuery, GetMyDecksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyDecksQuery, GetMyDecksQueryVariables>(GetMyDecksDocument, options);
      }
export function useGetMyDecksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyDecksQuery, GetMyDecksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyDecksQuery, GetMyDecksQueryVariables>(GetMyDecksDocument, options);
        }
export type GetMyDecksQueryHookResult = ReturnType<typeof useGetMyDecksQuery>;
export type GetMyDecksLazyQueryHookResult = ReturnType<typeof useGetMyDecksLazyQuery>;
export type GetMyDecksQueryResult = Apollo.QueryResult<GetMyDecksQuery, GetMyDecksQueryVariables>;
export const GetUsersDocument = gql`
    query GetUsers {
  getUsers {
    ...BasicUser
  }
}
    ${BasicUserFragmentDoc}`;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...BasicUser
  }
}
    ${BasicUserFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const PostsDocument = gql`
    query Posts {
  posts {
    _id
    sentence
    word
    createdAt
    updatedAt
  }
}
    `;

/**
 * __usePostsQuery__
 *
 * To run a query within a React component, call `usePostsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostsQuery({
 *   variables: {
 *   },
 * });
 */
export function usePostsQuery(baseOptions?: Apollo.QueryHookOptions<PostsQuery, PostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PostsQuery, PostsQueryVariables>(PostsDocument, options);
      }
export function usePostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PostsQuery, PostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PostsQuery, PostsQueryVariables>(PostsDocument, options);
        }
export type PostsQueryHookResult = ReturnType<typeof usePostsQuery>;
export type PostsLazyQueryHookResult = ReturnType<typeof usePostsLazyQuery>;
export type PostsQueryResult = Apollo.QueryResult<PostsQuery, PostsQueryVariables>;
export const SearchForDeckDocument = gql`
    query SearchForDeck($input: String!) {
  searchForDeck(input: $input) {
    title
    _id
    user {
      _id
      image
    }
  }
}
    `;

/**
 * __useSearchForDeckQuery__
 *
 * To run a query within a React component, call `useSearchForDeckQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchForDeckQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchForDeckQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSearchForDeckQuery(baseOptions: Apollo.QueryHookOptions<SearchForDeckQuery, SearchForDeckQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchForDeckQuery, SearchForDeckQueryVariables>(SearchForDeckDocument, options);
      }
export function useSearchForDeckLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchForDeckQuery, SearchForDeckQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchForDeckQuery, SearchForDeckQueryVariables>(SearchForDeckDocument, options);
        }
export type SearchForDeckQueryHookResult = ReturnType<typeof useSearchForDeckQuery>;
export type SearchForDeckLazyQueryHookResult = ReturnType<typeof useSearchForDeckLazyQuery>;
export type SearchForDeckQueryResult = Apollo.QueryResult<SearchForDeckQuery, SearchForDeckQueryVariables>;
export const namedOperations = {
  Query: {
    FindDeck: 'FindDeck',
    GetAllDecks: 'GetAllDecks',
    GetMyDecks: 'GetMyDecks',
    GetUsers: 'GetUsers',
    Me: 'Me',
    Posts: 'Posts',
    SearchForDeck: 'SearchForDeck'
  },
  Mutation: {
    ChangeEmail: 'ChangeEmail',
    ChangePassword: 'ChangePassword',
    ChangeUsername: 'ChangeUsername',
    CreateDeck: 'CreateDeck',
    CreatePost: 'CreatePost',
    DeleteDeck: 'DeleteDeck',
    ForgotPassword: 'ForgotPassword',
    Login: 'Login',
    Logout: 'Logout',
    Register: 'Register',
    RenameDeck: 'RenameDeck',
    SubscribeToDeck: 'SubscribeToDeck',
    UnsubscribeToDeck: 'UnsubscribeToDeck',
    UploadAvatar: 'UploadAvatar'
  },
  Fragment: {
    BasicUser: 'BasicUser'
  }
}