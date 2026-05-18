import { initContract } from '@ts-rest/core';
import { mapToTsRest } from './mapper';

const c = initContract();

export const albumsContract = c.router({
  // Albums
  listAlbums: mapToTsRest('albums.listAlbums'),
  createAlbum: mapToTsRest('albums.createAlbum'),
  updateAlbum: mapToTsRest('albums.updateAlbum'),
  deleteAlbum: mapToTsRest('albums.deleteAlbum'),

  // Album photos
  listPhotos: mapToTsRest('albums.listPhotos'),
  getUploadUrl: mapToTsRest('albums.getUploadUrl'),
  confirmUpload: mapToTsRest('albums.confirmUpload'),
  reorderPhotos: mapToTsRest('albums.reorderPhotos'),
  deletePhoto: mapToTsRest('albums.deletePhoto'),

  // Public album access
  listPublicAlbums: mapToTsRest('albums.listPublicAlbums'),
  listUserAlbums: mapToTsRest('albums.listUserAlbums'),

  // Visibility grants
  grantAccess: mapToTsRest('albums.grantAccess'),
  revokeAccess: mapToTsRest('albums.revokeAccess'),
  listGrants: mapToTsRest('albums.listGrants'),
});
