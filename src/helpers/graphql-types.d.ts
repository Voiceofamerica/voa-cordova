/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type ArticleRouteQueryVariables = {
  id?: number | null,
};

export type ArticleRouteQuery = {
  articleById:  {
    id: number,
    title: string,
    pubDate: string,
    lastUpdated: string | null,
    content: string,
    image:  {
      url: string,
    } | null,
  } | null,
};

export type CategorySettingsQuery = {
  zones:  Array< {
    id: number,
    name: string,
  } | null > | null,
};

export type HomeRouteQuery = {
  articles:  Array< {
    id: number,
    title: string,
    introduction: string,
    pubDate: string,
    image:  {
      url: string,
    } | null,
  } | null > | null,
};
