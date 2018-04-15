/* tslint:disable */
//  This file was automatically generated and should not be edited.

export enum ContentType {
  Article = "Article",
  Video = "Video",
  PhotoGallery = "PhotoGallery",
  Clip = "Clip",
}


export enum ArticleVideoRelationship {
  SameItem = "SameItem",
  MainImage = "MainImage",
  EmbededInContent = "EmbededInContent",
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
    url: string | null,
    content: string | null,
    authors:  Array< {
      name:  {
        first: string,
        last: string | null,
      },
    } | null > | null,
    image:  {
      tiny: string,
      hero: string,
    } | null,
    video:  {
      url: string | null,
      thumbnailTiny: string | null,
      videoDescription: string | null,
    } | null,
    audio:  {
      url: string | null,
      audioTitle: string | null,
      audioDescription: string | null,
    } | null,
    photoGallery:  Array< {
      id: number,
      photoGalleryTitle: string | null,
      photoGalleryDescription: string | null,
      photo:  Array< {
        id: number | null,
        photoTitle: string | null,
        photoDescription: string | null,
        url: string,
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
      tiny: string,
      thumb: string,
      hero: string,
    } | null,
    video:  {
      url: string | null,
    } | null,
    audio:  {
      url: string | null,
    } | null,
    photoGallery:  Array< {
      photo:  Array< {
        id: number | null,
      } | null > | null,
    } | null > | null,
  } | null > | null,
};

export type CategorySettingsQuery = {
  zones:  Array< {
    id: number,
    name: string,
  } | null > | null,
};

export type EditorsChoiceRouteQuery = {
  content:  Array< {
    id: number,
    title: string,
    introduction: string,
    pubDate: string,
    image:  {
      tiny: string,
      thumb: string,
      hero: string,
    } | null,
    video:  {
      url: string | null,
    } | null,
    audio:  {
      url: string | null,
    } | null,
    photoGallery:  Array< {
      photo:  Array< {
        id: number | null,
      } | null > | null,
    } | null > | null,
  } | null > | null,
};

export type HomeRouteQuery = {
  content:  Array< {
    id: number,
    title: string,
    introduction: string,
    pubDate: string,
    image:  {
      tiny: string,
      thumb: string,
      hero: string,
    } | null,
    video:  {
      url: string | null,
      relType: ArticleVideoRelationship | null,
    } | null,
    audio:  {
      url: string | null,
    } | null,
    photoGallery:  Array< {
      photo:  Array< {
        id: number | null,
      } | null > | null,
    } | null > | null,
  } | null > | null,
};

export type ProgramAudioQueryVariables = {
  zone?: number | null,
};

export type ProgramAudioQuery = {
  content:  Array< {
    id: number,
    pubDate: string,
    image:  {
      tiny: string,
      hero: string,
    } | null,
    audio:  {
      url: string | null,
      audioTitle: string | null,
      audioDescription: string | null,
    } | null,
  } | null > | null,
};

export type ProgramGalleriesQuery = {
  content:  Array< {
    id: number,
    title: string,
    introduction: string,
    pubDate: string,
    photoGallery:  Array< {
      photo:  Array< {
        id: number | null,
      } | null > | null,
    } | null > | null,
    image:  {
      tiny: string,
    } | null,
  } | null > | null,
};

export type ProgramVideosQueryVariables = {
  zone?: number | null,
};

export type ProgramVideosQuery = {
  content:  Array< {
    id: number,
    pubDate: string,
    video:  {
      url: string | null,
      thumbnailTiny: string | null,
      videoTitle: string | null,
      videoDescription: string | null,
    } | null,
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
      tiny: string,
    } | null,
    video:  {
      url: string | null,
    } | null,
    audio:  {
      url: string | null,
    } | null,
    photoGallery:  Array< {
      photo:  Array< {
        id: number | null,
      } | null > | null,
    } | null > | null,
  } | null > | null,
};
