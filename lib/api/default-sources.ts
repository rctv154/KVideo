import type { VideoSource } from '@/lib/types';

// Default predefined video sources - Real Chinese video APIs
export const DEFAULT_SOURCES: VideoSource[] = [
  {
    id: 'lzi',
    name: '量子资源',
    baseUrl: 'https://cj.lziapi.com',
    searchPath: '/api.php/provide/vod/at/json',
    detailPath: '/api.php/provide/vod/at/json',
    enabled: true,
    priority: 1,
    group: 'normal',
  },
  {
    id: 'ffzy',
    name: '非凡资源',
    baseUrl: 'https://cj.ffzyapi.com',
    searchPath: '/api.php/provide/vod/at/json',
    detailPath: '/api.php/provide/vod/at/json',
    enabled: true,
    priority: 2,
    group: 'normal',
  },
];
