/* tslint:disable */
//  This file was automatically generated and should not be edited.

export enum ContentType {
  Article = "Article",
  Video = "Video",
  PhotoGallery = "PhotoGallery",
  Clip = "Clip",
}


export enum ProgramType {
  Clip = "Clip",
  Feature = "Feature",
  BroadcastProgram = "BroadcastProgram",
  Video = "Video",
}


export type ArticleRouteQueryVariables = {
  id?: number | null,
};

export type ArticleRouteQuery = {
  content:  Array< {
    id: number,
    title: string,
    pubDate: string,
    lastUpdated: string | null,
    content: string | null,
    authors:  Array< {
      name:  {
        first: string,
        last: string | null,
      },
    } | null > | null,
    image:  {
      url: string,
    } | null,
    video:  {
      url: string | null,
      thumbnail: string | null,
      videoDescription: string | null,
    } | null,
    audio:  {
      url: string | null,
      audioTitle: string,
      audioDescription: string | null,
    } | null,
    photoGallery:  Array< {
      photoGalleryTitle: string | null,
      photoGalleryDescription: string | null,
      photo:  Array< {
        photoTitle: string | null,
        photoDescription: string | null,
        url: string | null,
        order: number | null,
      } | null > | null,
    } | null > | null,
    relatedStories:  Array< {
      id: number,
      storyTitle: string,
      thumbnailUrl: string | null,
      pubDate: string,
    } | null > | null,
    type: ContentType | null,
  } | null > | null,
};

export type CategoryRouteQueryVariables = {
  category?: number | null,
};

export type CategoryRouteQuery = {
  content:  Array< {
    id: number,
    title: string,
    introduction: string,
    pubDate: string,
    image:  {
      url: string,
    } | null,
    video:  {
      url: string | null,
    } | null,
    audio:  {
      url: string | null,
    } | null,
  } | null > | null,
};

export type CategorySettingsQuery = {
  zones:  Array< {
    id: number,
    name: string,
  } | null > | null,
};

export type HomeRouteQuery = {
  content:  Array< {
    id: number,
    title: string,
    introduction: string,
    pubDate: string,
    image:  {
      url: string,
    } | null,
    video:  {
      url: string | null,
    } | null,
    audio:  {
      url: string | null,
    } | null,
  } | null > | null,
};

export type LiveStreamQuery = {
  program:  Array< {
    id: number,
    type: ProgramType | null,
    date: string | null,
    timeLeft: number | null,
    programTitle: string | null,
    programDescription: string | null,
    image:  {
      url: string,
    } | null,
    url: string | null,
  } | null > | null,
};

export type SearchQueryVariables = {
  query: string,
  zoneId?: number | null,
};

export type SearchQuery = {
  search:  Array< {
    id: number,
    title: string,
    introduction: string,
    pubDate: string,
    image:  {
      url: string,
    } | null,
    video:  {
      url: string | null,
    } | null,
    audio:  {
      url: string | null,
    } | null,
  } | null > | null,
};
