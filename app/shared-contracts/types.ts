import { paths } from './openapi-types';

export type Profile = paths['/me']['get']['responses']['200']['content']['application/json'];
export type DiscoveryUser = paths['/discovery']['get']['responses']['200']['content']['application/json']['users'][number];
export type Match = paths['/matches']['get']['responses']['200']['content']['application/json']['matches'][number];
export type Conversation = paths['/conversations']['get']['responses']['200']['content']['application/json']['conversations'][number];
export type Message = paths['/conversations/{id}/messages']['get']['responses']['200']['content']['application/json']['messages'][number];

export type SwipeAction = 'like' | 'pass' | 'super_like';
