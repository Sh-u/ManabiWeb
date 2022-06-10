export type SearchResults = {
    __typename?: string;
    title: string;
    _id: number;
    user: {
      __typename?: string;
      username?: string;
      _id: number;
    };
  };