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

export type Card = {
  __typename?: 'Card';
  _id: Scalars['Int'];
  cardProgresses: Array<CardProgress>;
  createdAt: Scalars['String'];
  deck: Deck;
  dictionaryAudio?: Maybe<Scalars['String']>;
  dictionaryMeaning?: Maybe<Array<Scalars['String']>>;
  furigana?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  pitchAccent?: Maybe<Array<PitchAccent>>;
  sentence: Scalars['String'];
  sentenceArr?: Maybe<Array<Scalars['String']>>;
  updatedAt: Scalars['String'];
  userAudio?: Maybe<Scalars['String']>;
  word: Scalars['String'];
};

export type CardInput = {
  sentence: Scalars['String'];
  word: Scalars['String'];
};

export type CardProgress = {
  __typename?: 'CardProgress';
  _id: Scalars['Int'];
  card: Card;
  createdAt: Scalars['DateTime'];
  nextRevision: Scalars['DateTime'];
  state: Scalars['String'];
  steps: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
  user: User;
};

export type CardResponse = {
  __typename?: 'CardResponse';
  card?: Maybe<Card>;
  error?: Maybe<Scalars['String']>;
};

export type Deck = {
  __typename?: 'Deck';
  _id: Scalars['Int'];
  cards: Array<Card>;
  createdAt: Scalars['String'];
  graduatingInterval: Scalars['Int'];
  japaneseTemplate?: Maybe<Scalars['Boolean']>;
  startingEase: Scalars['Float'];
  steps: Array<Scalars['Int']>;
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
  field?: Maybe<Scalars['String']>;
  message: Scalars['String'];
};

export type FollowResponse = {
  __typename?: 'FollowResponse';
  message?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type LearnAndReviewResponse = {
  __typename?: 'LearnAndReviewResponse';
  error?: Maybe<Scalars['String']>;
  learn?: Maybe<Array<Card>>;
  review?: Maybe<Array<Card>>;
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
  chooseCardDifficulty?: Maybe<Scalars['String']>;
  createCard: CardResponse;
  createDeck: DeckResponse;
  deleteCard: Scalars['Boolean'];
  deleteCards?: Maybe<Scalars['Boolean']>;
  deleteDeck: Scalars['Boolean'];
  editCard: CardResponse;
  followUser?: Maybe<FollowResponse>;
  forgotPassword: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  renameDeck?: Maybe<Deck>;
  segmentTest?: Maybe<Scalars['Boolean']>;
  subscribeToDeck: DeckResponse;
  unsubscribeToDeck: Scalars['Boolean'];
  updateBadge: Scalars['Boolean'];
  updateCardTitle?: Maybe<Card>;
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


export type MutationChooseCardDifficultyArgs = {
  answerType: Scalars['String'];
  currentCardId: Scalars['Int'];
};


export type MutationCreateCardArgs = {
  audio?: InputMaybe<Scalars['Upload']>;
  deckId: Scalars['Int'];
  image?: InputMaybe<Scalars['Upload']>;
  options: CardInput;
};


export type MutationCreateDeckArgs = {
  JP: Scalars['Boolean'];
  title: Scalars['String'];
};


export type MutationDeleteCardArgs = {
  targetId: Scalars['Int'];
};


export type MutationDeleteCardsArgs = {
  cardId: Scalars['Int'];
};


export type MutationDeleteDeckArgs = {
  _id: Scalars['Float'];
};


export type MutationEditCardArgs = {
  audio?: InputMaybe<Scalars['Upload']>;
  image?: InputMaybe<Scalars['Upload']>;
  options: CardInput;
  targetId: Scalars['Int'];
};


export type MutationFollowUserArgs = {
  targetUserId: Scalars['Int'];
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


export type MutationRenameDeckArgs = {
  _id: Scalars['Float'];
  title: Scalars['String'];
};


export type MutationSegmentTestArgs = {
  words: Scalars['String'];
};


export type MutationSubscribeToDeckArgs = {
  deckId: Scalars['Float'];
};


export type MutationUnsubscribeToDeckArgs = {
  deckId: Scalars['Float'];
};


export type MutationUpdateBadgeArgs = {
  username: Scalars['String'];
};


export type MutationUpdateCardTitleArgs = {
  _id: Scalars['Float'];
};


export type MutationUploadAvatarArgs = {
  image: Scalars['Upload'];
};

export type PitchAccent = {
  __typename?: 'PitchAccent';
  _id: Scalars['Int'];
  card: Card;
  descriptive?: Maybe<Scalars['String']>;
  high?: Maybe<Scalars['String']>;
  kana?: Maybe<Scalars['String']>;
  mora?: Maybe<Scalars['Int']>;
  part?: Maybe<Array<Scalars['String']>>;
  showKana?: Maybe<Scalars['Boolean']>;
  word?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  findDeck: DeckResponse;
  findUser: UserResponse;
  getAllDecks: Array<Deck>;
  getCardProgresses?: Maybe<Array<CardProgress>>;
  getCards: Array<Card>;
  getFriends?: Maybe<Array<User>>;
  getLearnAndReviewCards: LearnAndReviewResponse;
  getMyDecks: DeckResponse;
  getRevisionTime: RevisionTimeResponse;
  getStudyCard?: Maybe<Card>;
  getUsers: Array<User>;
  hello: Scalars['String'];
  me?: Maybe<User>;
  searchForDeck: Array<Deck>;
};


export type QueryFindDeckArgs = {
  _id: Scalars['Int'];
};


export type QueryFindUserArgs = {
  targetUsername: Scalars['String'];
};


export type QueryGetFriendsArgs = {
  targetUserId: Scalars['Int'];
};


export type QueryGetLearnAndReviewCardsArgs = {
  deckId: Scalars['Int'];
};


export type QueryGetRevisionTimeArgs = {
  currentCardId: Scalars['Int'];
};


export type QuerySearchForDeckArgs = {
  input: Scalars['String'];
};

export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type RevisionTimeResponse = {
  __typename?: 'RevisionTimeResponse';
  AGAIN?: Maybe<Scalars['String']>;
  GOOD?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['Int'];
  badge: Scalars['String'];
  cardProgresses?: Maybe<Array<CardProgress>>;
  cardStudied: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  dayStreak: Scalars['Int'];
  decks: Array<Deck>;
  email: Scalars['String'];
  followers: Array<User>;
  following: Array<User>;
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


export type ChangeEmailMutation = { __typename?: 'Mutation', changeEmail: { __typename?: 'UserResponse', user?: { __typename?: 'User', _id: number, username: string, email: string } | null, errors?: Array<{ __typename?: 'FieldError', field?: string | null, message: string }> | null } };

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field?: string | null, message: string }> | null, user?: { __typename?: 'User', createdAt: any, image?: string | null, email: string, _id: number, username: string, decks: Array<{ __typename?: 'Deck', _id: number, title: string, createdAt: string }> } | null } };

export type ChangeUsernameMutationVariables = Exact<{
  newUsername: Scalars['String'];
}>;


export type ChangeUsernameMutation = { __typename?: 'Mutation', changeUsername: { __typename?: 'UserResponse', user?: { __typename?: 'User', _id: number, username: string, email: string } | null, errors?: Array<{ __typename?: 'FieldError', field?: string | null, message: string }> | null } };

export type ChooseCardDifficultyMutationVariables = Exact<{
  currentCardId: Scalars['Int'];
  answerType: Scalars['String'];
}>;


export type ChooseCardDifficultyMutation = { __typename?: 'Mutation', chooseCardDifficulty?: string | null };

export type CreateCardMutationVariables = Exact<{
  deckId: Scalars['Int'];
  options: CardInput;
  image?: InputMaybe<Scalars['Upload']>;
  audio?: InputMaybe<Scalars['Upload']>;
}>;


export type CreateCardMutation = { __typename?: 'Mutation', createCard: { __typename?: 'CardResponse', error?: string | null, card?: { __typename?: 'Card', _id: number, sentence: string, word: string, image?: string | null, dictionaryAudio?: string | null, userAudio?: string | null, createdAt: string, updatedAt: string } | null } };

export type CreateDeckMutationVariables = Exact<{
  title: Scalars['String'];
  JP: Scalars['Boolean'];
}>;


export type CreateDeckMutation = { __typename?: 'Mutation', createDeck: { __typename?: 'DeckResponse', errors?: string | null, decks?: Array<{ __typename?: 'Deck', createdAt: string, title: string, japaneseTemplate?: boolean | null, _id: number, user: { __typename?: 'User', _id: number, username: string, image?: string | null } }> | null } };

export type DeleteCardMutationVariables = Exact<{
  targetId: Scalars['Int'];
}>;


export type DeleteCardMutation = { __typename?: 'Mutation', deleteCard: boolean };

export type DeleteDeckMutationVariables = Exact<{
  _id: Scalars['Float'];
}>;


export type DeleteDeckMutation = { __typename?: 'Mutation', deleteDeck: boolean };

export type EditCardMutationVariables = Exact<{
  targetId: Scalars['Int'];
  options: CardInput;
  image?: InputMaybe<Scalars['Upload']>;
  audio?: InputMaybe<Scalars['Upload']>;
}>;


export type EditCardMutation = { __typename?: 'Mutation', editCard: { __typename?: 'CardResponse', error?: string | null, card?: { __typename?: 'Card', _id: number, sentence: string, word: string, image?: string | null, dictionaryAudio?: string | null, userAudio?: string | null, createdAt: string, updatedAt: string } | null } };

export type FollowUserMutationVariables = Exact<{
  targetUserId: Scalars['Int'];
}>;


export type FollowUserMutation = { __typename?: 'Mutation', followUser?: { __typename?: 'FollowResponse', message?: string | null, user?: { __typename?: 'User', _id: number, username: string, followers: Array<{ __typename?: 'User', _id: number, username: string }> } | null } | null };

export type ForgotPasswordMutationVariables = Exact<{
  username: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  options: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field?: string | null, message: string }> | null, user?: { __typename?: 'User', createdAt: any, image?: string | null, email: string, _id: number, username: string, decks: Array<{ __typename?: 'Deck', _id: number, title: string, createdAt: string }> } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  options: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field?: string | null, message: string }> | null, user?: { __typename?: 'User', createdAt: any, image?: string | null, email: string, _id: number, username: string, decks: Array<{ __typename?: 'Deck', _id: number, title: string, createdAt: string }> } | null } };

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

export type UpdateBadgeMutationVariables = Exact<{
  username: Scalars['String'];
}>;


export type UpdateBadgeMutation = { __typename?: 'Mutation', updateBadge: boolean };

export type UploadAvatarMutationVariables = Exact<{
  image: Scalars['Upload'];
}>;


export type UploadAvatarMutation = { __typename?: 'Mutation', uploadAvatar: boolean };

export type FindDeckQueryVariables = Exact<{
  _id: Scalars['Int'];
}>;


export type FindDeckQuery = { __typename?: 'Query', findDeck: { __typename?: 'DeckResponse', decks?: Array<{ __typename?: 'Deck', _id: number, title: string, createdAt: string, updatedAt: string, startingEase: number, steps: Array<number>, user: { __typename?: 'User', _id: number, username: string, image?: string | null }, cards: Array<{ __typename?: 'Card', _id: number, sentence: string, word: string, image?: string | null, userAudio?: string | null, dictionaryAudio?: string | null, cardProgresses: Array<{ __typename?: 'CardProgress', _id: number, steps: number, nextRevision: any }> }>, subscribers: Array<{ __typename?: 'DeckSubscriber', _id: number }> }> | null } };

export type FindUserQueryVariables = Exact<{
  targetUsername: Scalars['String'];
}>;


export type FindUserQuery = { __typename?: 'Query', findUser: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field?: string | null, message: string }> | null, user?: { __typename?: 'User', _id: number, username: string, image?: string | null, createdAt: any, badge: string, dayStreak: number, cardStudied: number, following: Array<{ __typename?: 'User', _id: number, username: string }>, followers: Array<{ __typename?: 'User', _id: number, username: string }> } | null } };

export type GetAllDecksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllDecksQuery = { __typename?: 'Query', getAllDecks: Array<{ __typename?: 'Deck', _id: number, cards: Array<{ __typename?: 'Card', _id: number }>, subscribers: Array<{ __typename?: 'DeckSubscriber', _id: number }> }> };

export type GetCardsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCardsQuery = { __typename?: 'Query', getCards: Array<{ __typename?: 'Card', _id: number, sentence: string, word: string, createdAt: string, updatedAt: string }> };

export type GetFriendsQueryVariables = Exact<{
  targetUserId: Scalars['Int'];
}>;


export type GetFriendsQuery = { __typename?: 'Query', getFriends?: Array<{ __typename?: 'User', _id: number, username: string, image?: string | null }> | null };

export type GetLearnAndReviewCardsQueryVariables = Exact<{
  deckId: Scalars['Int'];
}>;


export type GetLearnAndReviewCardsQuery = { __typename?: 'Query', getLearnAndReviewCards: { __typename?: 'LearnAndReviewResponse', error?: string | null, learn?: Array<{ __typename?: 'Card', _id: number, cardProgresses: Array<{ __typename?: 'CardProgress', _id: number }> }> | null, review?: Array<{ __typename?: 'Card', _id: number, cardProgresses: Array<{ __typename?: 'CardProgress', _id: number }> }> | null } };

export type GetMyDecksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyDecksQuery = { __typename?: 'Query', getMyDecks: { __typename?: 'DeckResponse', errors?: string | null, decks?: Array<{ __typename?: 'Deck', createdAt: string, title: string, _id: number, user: { __typename?: 'User', _id: number, username: string, image?: string | null } }> | null } };

export type GetRevisionTimeQueryVariables = Exact<{
  currentCardId: Scalars['Int'];
}>;


export type GetRevisionTimeQuery = { __typename?: 'Query', getRevisionTime: { __typename?: 'RevisionTimeResponse', AGAIN?: string | null, GOOD?: string | null } };

export type GetStudyCardQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStudyCardQuery = { __typename?: 'Query', getStudyCard?: { __typename?: 'Card', _id: number, sentence: string, word: string, furigana?: string | null, dictionaryAudio?: string | null, dictionaryMeaning?: Array<string> | null, sentenceArr?: Array<string> | null, userAudio?: string | null, image?: string | null, pitchAccent?: Array<{ __typename?: 'PitchAccent', showKana?: boolean | null, descriptive?: string | null, mora?: number | null, word?: string | null, kana?: string | null, part?: Array<string> | null, high?: string | null }> | null, cardProgresses: Array<{ __typename?: 'CardProgress', _id: number, nextRevision: any, steps: number, state: string }> } | null };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: Array<{ __typename?: 'User', createdAt: any, image?: string | null, email: string, _id: number, username: string, followers: Array<{ __typename?: 'User', _id: number }>, decks: Array<{ __typename?: 'Deck', _id: number, title: string, createdAt: string }> }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', createdAt: any, image?: string | null, email: string, _id: number, username: string, decks: Array<{ __typename?: 'Deck', _id: number, title: string, createdAt: string }> } | null };

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
export const ChooseCardDifficultyDocument = gql`
    mutation chooseCardDifficulty($currentCardId: Int!, $answerType: String!) {
  chooseCardDifficulty(currentCardId: $currentCardId, answerType: $answerType)
}
    `;
export type ChooseCardDifficultyMutationFn = Apollo.MutationFunction<ChooseCardDifficultyMutation, ChooseCardDifficultyMutationVariables>;

/**
 * __useChooseCardDifficultyMutation__
 *
 * To run a mutation, you first call `useChooseCardDifficultyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChooseCardDifficultyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chooseCardDifficultyMutation, { data, loading, error }] = useChooseCardDifficultyMutation({
 *   variables: {
 *      currentCardId: // value for 'currentCardId'
 *      answerType: // value for 'answerType'
 *   },
 * });
 */
export function useChooseCardDifficultyMutation(baseOptions?: Apollo.MutationHookOptions<ChooseCardDifficultyMutation, ChooseCardDifficultyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChooseCardDifficultyMutation, ChooseCardDifficultyMutationVariables>(ChooseCardDifficultyDocument, options);
      }
export type ChooseCardDifficultyMutationHookResult = ReturnType<typeof useChooseCardDifficultyMutation>;
export type ChooseCardDifficultyMutationResult = Apollo.MutationResult<ChooseCardDifficultyMutation>;
export type ChooseCardDifficultyMutationOptions = Apollo.BaseMutationOptions<ChooseCardDifficultyMutation, ChooseCardDifficultyMutationVariables>;
export const CreateCardDocument = gql`
    mutation CreateCard($deckId: Int!, $options: CardInput!, $image: Upload, $audio: Upload) {
  createCard(deckId: $deckId, options: $options, image: $image, audio: $audio) {
    error
    card {
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
export type CreateCardMutationFn = Apollo.MutationFunction<CreateCardMutation, CreateCardMutationVariables>;

/**
 * __useCreateCardMutation__
 *
 * To run a mutation, you first call `useCreateCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCardMutation, { data, loading, error }] = useCreateCardMutation({
 *   variables: {
 *      deckId: // value for 'deckId'
 *      options: // value for 'options'
 *      image: // value for 'image'
 *      audio: // value for 'audio'
 *   },
 * });
 */
export function useCreateCardMutation(baseOptions?: Apollo.MutationHookOptions<CreateCardMutation, CreateCardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCardMutation, CreateCardMutationVariables>(CreateCardDocument, options);
      }
export type CreateCardMutationHookResult = ReturnType<typeof useCreateCardMutation>;
export type CreateCardMutationResult = Apollo.MutationResult<CreateCardMutation>;
export type CreateCardMutationOptions = Apollo.BaseMutationOptions<CreateCardMutation, CreateCardMutationVariables>;
export const CreateDeckDocument = gql`
    mutation CreateDeck($title: String!, $JP: Boolean!) {
  createDeck(title: $title, JP: $JP) {
    decks {
      createdAt
      title
      japaneseTemplate
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
 *      JP: // value for 'JP'
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
export const DeleteCardDocument = gql`
    mutation DeleteCard($targetId: Int!) {
  deleteCard(targetId: $targetId)
}
    `;
export type DeleteCardMutationFn = Apollo.MutationFunction<DeleteCardMutation, DeleteCardMutationVariables>;

/**
 * __useDeleteCardMutation__
 *
 * To run a mutation, you first call `useDeleteCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCardMutation, { data, loading, error }] = useDeleteCardMutation({
 *   variables: {
 *      targetId: // value for 'targetId'
 *   },
 * });
 */
export function useDeleteCardMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCardMutation, DeleteCardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCardMutation, DeleteCardMutationVariables>(DeleteCardDocument, options);
      }
export type DeleteCardMutationHookResult = ReturnType<typeof useDeleteCardMutation>;
export type DeleteCardMutationResult = Apollo.MutationResult<DeleteCardMutation>;
export type DeleteCardMutationOptions = Apollo.BaseMutationOptions<DeleteCardMutation, DeleteCardMutationVariables>;
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
export const EditCardDocument = gql`
    mutation EditCard($targetId: Int!, $options: CardInput!, $image: Upload, $audio: Upload) {
  editCard(targetId: $targetId, options: $options, image: $image, audio: $audio) {
    error
    card {
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
export type EditCardMutationFn = Apollo.MutationFunction<EditCardMutation, EditCardMutationVariables>;

/**
 * __useEditCardMutation__
 *
 * To run a mutation, you first call `useEditCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editCardMutation, { data, loading, error }] = useEditCardMutation({
 *   variables: {
 *      targetId: // value for 'targetId'
 *      options: // value for 'options'
 *      image: // value for 'image'
 *      audio: // value for 'audio'
 *   },
 * });
 */
export function useEditCardMutation(baseOptions?: Apollo.MutationHookOptions<EditCardMutation, EditCardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditCardMutation, EditCardMutationVariables>(EditCardDocument, options);
      }
export type EditCardMutationHookResult = ReturnType<typeof useEditCardMutation>;
export type EditCardMutationResult = Apollo.MutationResult<EditCardMutation>;
export type EditCardMutationOptions = Apollo.BaseMutationOptions<EditCardMutation, EditCardMutationVariables>;
export const FollowUserDocument = gql`
    mutation FollowUser($targetUserId: Int!) {
  followUser(targetUserId: $targetUserId) {
    message
    user {
      _id
      username
      followers {
        _id
        username
      }
    }
  }
}
    `;
export type FollowUserMutationFn = Apollo.MutationFunction<FollowUserMutation, FollowUserMutationVariables>;

/**
 * __useFollowUserMutation__
 *
 * To run a mutation, you first call `useFollowUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFollowUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [followUserMutation, { data, loading, error }] = useFollowUserMutation({
 *   variables: {
 *      targetUserId: // value for 'targetUserId'
 *   },
 * });
 */
export function useFollowUserMutation(baseOptions?: Apollo.MutationHookOptions<FollowUserMutation, FollowUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<FollowUserMutation, FollowUserMutationVariables>(FollowUserDocument, options);
      }
export type FollowUserMutationHookResult = ReturnType<typeof useFollowUserMutation>;
export type FollowUserMutationResult = Apollo.MutationResult<FollowUserMutation>;
export type FollowUserMutationOptions = Apollo.BaseMutationOptions<FollowUserMutation, FollowUserMutationVariables>;
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
export const UpdateBadgeDocument = gql`
    mutation UpdateBadge($username: String!) {
  updateBadge(username: $username)
}
    `;
export type UpdateBadgeMutationFn = Apollo.MutationFunction<UpdateBadgeMutation, UpdateBadgeMutationVariables>;

/**
 * __useUpdateBadgeMutation__
 *
 * To run a mutation, you first call `useUpdateBadgeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBadgeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBadgeMutation, { data, loading, error }] = useUpdateBadgeMutation({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useUpdateBadgeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBadgeMutation, UpdateBadgeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBadgeMutation, UpdateBadgeMutationVariables>(UpdateBadgeDocument, options);
      }
export type UpdateBadgeMutationHookResult = ReturnType<typeof useUpdateBadgeMutation>;
export type UpdateBadgeMutationResult = Apollo.MutationResult<UpdateBadgeMutation>;
export type UpdateBadgeMutationOptions = Apollo.BaseMutationOptions<UpdateBadgeMutation, UpdateBadgeMutationVariables>;
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
      cards {
        _id
        sentence
        word
        image
        userAudio
        dictionaryAudio
        cardProgresses {
          _id
          steps
          nextRevision
        }
      }
      title
      createdAt
      updatedAt
      startingEase
      steps
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
export const FindUserDocument = gql`
    query FindUser($targetUsername: String!) {
  findUser(targetUsername: $targetUsername) {
    errors {
      field
      message
    }
    user {
      _id
      username
      image
      createdAt
      badge
      dayStreak
      cardStudied
      following {
        _id
        username
      }
      followers {
        _id
        username
      }
    }
  }
}
    `;

/**
 * __useFindUserQuery__
 *
 * To run a query within a React component, call `useFindUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindUserQuery({
 *   variables: {
 *      targetUsername: // value for 'targetUsername'
 *   },
 * });
 */
export function useFindUserQuery(baseOptions: Apollo.QueryHookOptions<FindUserQuery, FindUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindUserQuery, FindUserQueryVariables>(FindUserDocument, options);
      }
export function useFindUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindUserQuery, FindUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindUserQuery, FindUserQueryVariables>(FindUserDocument, options);
        }
export type FindUserQueryHookResult = ReturnType<typeof useFindUserQuery>;
export type FindUserLazyQueryHookResult = ReturnType<typeof useFindUserLazyQuery>;
export type FindUserQueryResult = Apollo.QueryResult<FindUserQuery, FindUserQueryVariables>;
export const GetAllDecksDocument = gql`
    query GetAllDecks {
  getAllDecks {
    _id
    cards {
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
export const GetCardsDocument = gql`
    query GetCards {
  getCards {
    _id
    sentence
    word
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetCardsQuery__
 *
 * To run a query within a React component, call `useGetCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCardsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCardsQuery(baseOptions?: Apollo.QueryHookOptions<GetCardsQuery, GetCardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCardsQuery, GetCardsQueryVariables>(GetCardsDocument, options);
      }
export function useGetCardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCardsQuery, GetCardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCardsQuery, GetCardsQueryVariables>(GetCardsDocument, options);
        }
export type GetCardsQueryHookResult = ReturnType<typeof useGetCardsQuery>;
export type GetCardsLazyQueryHookResult = ReturnType<typeof useGetCardsLazyQuery>;
export type GetCardsQueryResult = Apollo.QueryResult<GetCardsQuery, GetCardsQueryVariables>;
export const GetFriendsDocument = gql`
    query GetFriends($targetUserId: Int!) {
  getFriends(targetUserId: $targetUserId) {
    _id
    username
    image
  }
}
    `;

/**
 * __useGetFriendsQuery__
 *
 * To run a query within a React component, call `useGetFriendsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFriendsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFriendsQuery({
 *   variables: {
 *      targetUserId: // value for 'targetUserId'
 *   },
 * });
 */
export function useGetFriendsQuery(baseOptions: Apollo.QueryHookOptions<GetFriendsQuery, GetFriendsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFriendsQuery, GetFriendsQueryVariables>(GetFriendsDocument, options);
      }
export function useGetFriendsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFriendsQuery, GetFriendsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFriendsQuery, GetFriendsQueryVariables>(GetFriendsDocument, options);
        }
export type GetFriendsQueryHookResult = ReturnType<typeof useGetFriendsQuery>;
export type GetFriendsLazyQueryHookResult = ReturnType<typeof useGetFriendsLazyQuery>;
export type GetFriendsQueryResult = Apollo.QueryResult<GetFriendsQuery, GetFriendsQueryVariables>;
export const GetLearnAndReviewCardsDocument = gql`
    query getLearnAndReviewCards($deckId: Int!) {
  getLearnAndReviewCards(deckId: $deckId) {
    error
    learn {
      _id
      cardProgresses {
        _id
      }
    }
    review {
      _id
      cardProgresses {
        _id
      }
    }
  }
}
    `;

/**
 * __useGetLearnAndReviewCardsQuery__
 *
 * To run a query within a React component, call `useGetLearnAndReviewCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLearnAndReviewCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLearnAndReviewCardsQuery({
 *   variables: {
 *      deckId: // value for 'deckId'
 *   },
 * });
 */
export function useGetLearnAndReviewCardsQuery(baseOptions: Apollo.QueryHookOptions<GetLearnAndReviewCardsQuery, GetLearnAndReviewCardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLearnAndReviewCardsQuery, GetLearnAndReviewCardsQueryVariables>(GetLearnAndReviewCardsDocument, options);
      }
export function useGetLearnAndReviewCardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLearnAndReviewCardsQuery, GetLearnAndReviewCardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLearnAndReviewCardsQuery, GetLearnAndReviewCardsQueryVariables>(GetLearnAndReviewCardsDocument, options);
        }
export type GetLearnAndReviewCardsQueryHookResult = ReturnType<typeof useGetLearnAndReviewCardsQuery>;
export type GetLearnAndReviewCardsLazyQueryHookResult = ReturnType<typeof useGetLearnAndReviewCardsLazyQuery>;
export type GetLearnAndReviewCardsQueryResult = Apollo.QueryResult<GetLearnAndReviewCardsQuery, GetLearnAndReviewCardsQueryVariables>;
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
export const GetRevisionTimeDocument = gql`
    query getRevisionTime($currentCardId: Int!) {
  getRevisionTime(currentCardId: $currentCardId) {
    AGAIN
    GOOD
  }
}
    `;

/**
 * __useGetRevisionTimeQuery__
 *
 * To run a query within a React component, call `useGetRevisionTimeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRevisionTimeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRevisionTimeQuery({
 *   variables: {
 *      currentCardId: // value for 'currentCardId'
 *   },
 * });
 */
export function useGetRevisionTimeQuery(baseOptions: Apollo.QueryHookOptions<GetRevisionTimeQuery, GetRevisionTimeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRevisionTimeQuery, GetRevisionTimeQueryVariables>(GetRevisionTimeDocument, options);
      }
export function useGetRevisionTimeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRevisionTimeQuery, GetRevisionTimeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRevisionTimeQuery, GetRevisionTimeQueryVariables>(GetRevisionTimeDocument, options);
        }
export type GetRevisionTimeQueryHookResult = ReturnType<typeof useGetRevisionTimeQuery>;
export type GetRevisionTimeLazyQueryHookResult = ReturnType<typeof useGetRevisionTimeLazyQuery>;
export type GetRevisionTimeQueryResult = Apollo.QueryResult<GetRevisionTimeQuery, GetRevisionTimeQueryVariables>;
export const GetStudyCardDocument = gql`
    query getStudyCard {
  getStudyCard {
    _id
    sentence
    word
    furigana
    dictionaryAudio
    dictionaryMeaning
    sentenceArr
    pitchAccent {
      showKana
      descriptive
      mora
      word
      kana
      part
      high
    }
    userAudio
    image
    cardProgresses {
      _id
      nextRevision
      steps
      state
    }
  }
}
    `;

/**
 * __useGetStudyCardQuery__
 *
 * To run a query within a React component, call `useGetStudyCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStudyCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStudyCardQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetStudyCardQuery(baseOptions?: Apollo.QueryHookOptions<GetStudyCardQuery, GetStudyCardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStudyCardQuery, GetStudyCardQueryVariables>(GetStudyCardDocument, options);
      }
export function useGetStudyCardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStudyCardQuery, GetStudyCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStudyCardQuery, GetStudyCardQueryVariables>(GetStudyCardDocument, options);
        }
export type GetStudyCardQueryHookResult = ReturnType<typeof useGetStudyCardQuery>;
export type GetStudyCardLazyQueryHookResult = ReturnType<typeof useGetStudyCardLazyQuery>;
export type GetStudyCardQueryResult = Apollo.QueryResult<GetStudyCardQuery, GetStudyCardQueryVariables>;
export const GetUsersDocument = gql`
    query GetUsers {
  getUsers {
    ...BasicUser
    followers {
      _id
    }
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
    FindUser: 'FindUser',
    GetAllDecks: 'GetAllDecks',
    GetCards: 'GetCards',
    GetFriends: 'GetFriends',
    getLearnAndReviewCards: 'getLearnAndReviewCards',
    GetMyDecks: 'GetMyDecks',
    getRevisionTime: 'getRevisionTime',
    getStudyCard: 'getStudyCard',
    GetUsers: 'GetUsers',
    Me: 'Me',
    SearchForDeck: 'SearchForDeck'
  },
  Mutation: {
    ChangeEmail: 'ChangeEmail',
    ChangePassword: 'ChangePassword',
    ChangeUsername: 'ChangeUsername',
    chooseCardDifficulty: 'chooseCardDifficulty',
    CreateCard: 'CreateCard',
    CreateDeck: 'CreateDeck',
    DeleteCard: 'DeleteCard',
    DeleteDeck: 'DeleteDeck',
    EditCard: 'EditCard',
    FollowUser: 'FollowUser',
    ForgotPassword: 'ForgotPassword',
    Login: 'Login',
    Logout: 'Logout',
    Register: 'Register',
    RenameDeck: 'RenameDeck',
    SubscribeToDeck: 'SubscribeToDeck',
    UnsubscribeToDeck: 'UnsubscribeToDeck',
    UpdateBadge: 'UpdateBadge',
    UploadAvatar: 'UploadAvatar'
  },
  Fragment: {
    BasicUser: 'BasicUser'
  }
}