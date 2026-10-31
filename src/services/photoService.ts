import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { Photo, PhotoFilter } from '../types/photo';
import { PermissionService } from './permissionService';

export const FALLBACK_PHOTOS: Photo[] = [
  {
    id: 'photo-1',
    uri: 'https://images.unsplash.com/photo-1604261288039-9dafd14e21c7?auto=format&fit=crop&w=1000&q=84',
    alt: 'A red cabin beneath a dramatic alpine ridge',
    size: '4.2 MB',
    sizeBytes: 4.2 * 1024 * 1024,
    month: 'September 2024',
    isDevicePhoto: false,
  },
  {
    id: 'photo-2',
    uri: 'https://images.unsplash.com/photo-1667394683486-ae01afe7a8e8?auto=format&fit=crop&w=1000&q=84',
    alt: 'Friends gathering in front of a city building',
    size: '3.8 MB',
    sizeBytes: 3.8 * 1024 * 1024,
    month: 'August 2024',
    isDevicePhoto: false,
  },
  {
    id: 'photo-3',
    uri: 'https://images.unsplash.com/photo-1785533693200-2db1df20432b?auto=format&fit=crop&w=1000&q=84',
    alt: 'Two people sitting on a historic stone structure',
    size: '5.1 MB',
    sizeBytes: 5.1 * 1024 * 1024,
    month: 'August 2024',
    isDevicePhoto: false,
  },
  {
    id: 'photo-4',
    uri: 'https://images.unsplash.com/photo-1696865202338-0a546a6dbb16?auto=format&fit=crop&w=1000&q=84',
    alt: 'Portrait in front of detailed architecture',
    size: '4.7 MB',
    sizeBytes: 4.7 * 1024 * 1024,
    month: 'July 2024',
    isDevicePhoto: false,
  },
  {
    id: 'photo-5',
    uri: 'https://images.unsplash.com/photo-1716635474552-4943aae9d102?auto=format&fit=crop&w=1000&q=84',
    alt: 'Person standing in a patterned doorway',
    size: '3.6 MB',
    sizeBytes: 3.6 * 1024 * 1024,
    month: 'July 2024',
    isDevicePhoto: false,
  },
  {
    id: 'photo-6',
    uri: 'https://images.unsplash.com/photo-1672523596699-19f5c7e34275?auto=format&fit=crop&w=1000&q=84',
    alt: 'Woman walking through a stone corridor',
    size: '6.3 MB',
    sizeBytes: 6.3 * 1024 * 1024,
    month: 'June 2024',
    isDevicePhoto: false,
  },
  {
    id: 'photo-7',
    uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=84',
    alt: 'Yosemite valley sunset reflection in river',
    size: '5.4 MB',
    sizeBytes: 5.4 * 1024 * 1024,
    month: 'June 2024',
    isDevicePhoto: false,
  },
  {
    id: 'photo-8',
    uri: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1000&q=84',
    alt: 'Foggy morning evergreen forest canopy',
    size: '4.9 MB',
    sizeBytes: 4.9 * 1024 * 1024,
    month: 'May 2024',
    isDevicePhoto: false,
  },
  {
    id: 'photo-9',
    uri: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=84',
    alt: 'Neon Tokyo street after rain reflection',
    size: '6.1 MB',
    sizeBytes: 6.1 * 1024 * 1024,
    month: 'May 2024',
    isDevicePhoto: false,
  },
  {
    id: 'photo-10',
    uri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=84',
    alt: 'Golden hour waves crashing on coastline',
    size: '3.9 MB',
    sizeBytes: 3.9 * 1024 * 1024,
    month: 'April 2024',
    isDevicePhoto: false,
  },
  {
    id: 'photo-11',
    uri: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=84',
    alt: 'Misty green mountains sunrise silhouette',
    size: '5.8 MB',
    sizeBytes: 5.8 * 1024 * 1024,
    month: 'April 2024',
    isDevicePhoto: false,
  },
  {
    id: 'photo-12',
    uri: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=84',
    alt: 'Laptop on work desk with coffee mug',
    size: '4.5 MB',
    sizeBytes: 4.5 * 1024 * 1024,
    month: 'March 2024',
    isDevicePhoto: false,
  },
  {
    id: 'photo-13',
    uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=84',
    alt: 'Tropical white sand beach turquoise water',
    size: '7.2 MB',
    sizeBytes: 7.2 * 1024 * 1024,
    month: 'March 2024',
    isDevicePhoto: false,
  },
  {
    id: 'photo-14',
    uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=84',
    alt: 'Casual candid portrait in park',
    size: '3.3 MB',
    sizeBytes: 3.3 * 1024 * 1024,
    month: 'February 2024',
    isDevicePhoto: false,
  },
  {
    id: 'photo-15',
    uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=84',
    alt: 'Hiker standing on cliff edge scenic vista',
    size: '5.2 MB',
    sizeBytes: 5.2 * 1024 * 1024,
    month: 'February 2024',
    isDevicePhoto: false,
  },
  {
    id: 'photo-16',
    uri: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=84',
    alt: 'Historic Kyoto temple garden in autumn',
    size: '6.8 MB',
    sizeBytes: 6.8 * 1024 * 1024,
    month: 'January 2024',
    isDevicePhoto: false,
  },
  {
    id: 'photo-17',
    uri: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=84',
    alt: 'Circuit board macro technology texture',
    size: '4.1 MB',
    sizeBytes: 4.1 * 1024 * 1024,
    month: 'January 2024',
    isDevicePhoto: false,
  },
  {
    id: 'photo-18',
    uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=84',
    alt: 'Fresh green organic salad bowl lunch',
    size: '3.7 MB',
    sizeBytes: 3.7 * 1024 * 1024,
    month: 'December 2023',
    isDevicePhoto: false,
  },
  {
    id: 'photo-19',
    uri: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1000&q=84',
    alt: 'Iceland northern lights over snow covered plain',
    size: '8.4 MB',
    sizeBytes: 8.4 * 1024 * 1024,
    month: 'December 2023',
    isDevicePhoto: false,
  },
  {
    id: 'photo-20',
    uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=84',
    alt: 'Studio fashion portrait natural light',
    size: '4.4 MB',
    sizeBytes: 4.4 * 1024 * 1024,
    month: 'November 2023',
    isDevicePhoto: false,
  },
  {
    id: 'photo-21',
    uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=84',
    alt: 'Emerald lake and rowboats alpine mountains',
    size: '6.7 MB',
    sizeBytes: 6.7 * 1024 * 1024,
    month: 'November 2023',
    isDevicePhoto: false,
  },
  {
    id: 'photo-22',
    uri: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=84',
    alt: 'Retro arcade neon game buttons',
    size: '3.5 MB',
    sizeBytes: 3.5 * 1024 * 1024,
    month: 'October 2023',
    isDevicePhoto: false,
  },
  {
    id: 'photo-23',
    uri: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1000&q=84',
    alt: 'Sunbeams filtering through tall trees in forest',
    size: '5.9 MB',
    sizeBytes: 5.9 * 1024 * 1024,
    month: 'October 2023',
    isDevicePhoto: false,
  },
  {
    id: 'photo-24',
    uri: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1000&q=84',
    alt: 'Majestic waterfall in green valley',
    size: '4.8 MB',
    sizeBytes: 4.8 * 1024 * 1024,
    month: 'September 2023',
    isDevicePhoto: false,
  },
  {
    id: 'photo-25',
    uri: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=84',
    alt: 'Peaceful zen stones garden water stream',
    size: '4.3 MB',
    sizeBytes: 4.3 * 1024 * 1024,
    month: 'September 2023',
    isDevicePhoto: false,
  },
  {
    id: 'photo-26',
    uri: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1000&q=84',
    alt: 'Rolling green hills under sunny clouds',
    size: '5.0 MB',
    sizeBytes: 5.0 * 1024 * 1024,
    month: 'August 2023',
    isDevicePhoto: false,
  },
  {
    id: 'photo-27',
    uri: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=84',
    alt: 'Minimalist living room architecture design',
    size: '3.9 MB',
    sizeBytes: 3.9 * 1024 * 1024,
    month: 'August 2023',
    isDevicePhoto: false,
  },
  {
    id: 'photo-28',
    uri: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1000&q=84',
    alt: 'Tropical waterfall surrounded by lush ferns',
    size: '6.4 MB',
    sizeBytes: 6.4 * 1024 * 1024,
    month: 'July 2023',
    isDevicePhoto: false,
  },
  {
    id: 'photo-29',
    uri: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1000&q=84',
    alt: 'Metropolis skyline illuminated at twilight',
    size: '7.8 MB',
    sizeBytes: 7.8 * 1024 * 1024,
    month: 'July 2023',
    isDevicePhoto: false,
  },
  {
    id: 'photo-30',
    uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=84',
    alt: 'Snow covered alpine peaks under clear blue sky',
    size: '5.6 MB',
    sizeBytes: 5.6 * 1024 * 1024,
    month: 'June 2023',
    isDevicePhoto: false,
  },
];

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0.0 MB';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(1)} GB`;
  }
  return `${mb.toFixed(1)} MB`;
}

function formatMonth(timestamp?: number): string {
  if (!timestamp) return 'Recent';
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

// Module-level cursor tracking to enable smooth pagination between successive decks
let lastCameraRollCursor: string | undefined;

export const PhotoService = {
  /**
   * Resets the CameraRoll pagination cursor back to the start.
   */
  resetCursor: () => {
    lastCameraRollCursor = undefined;
  },

  /**
   * Fetches a deck of photos, automatically skipping photos that have already
   * been reviewed (kept or trashed) by the user in this session or prior decks.
   */
  async fetchDeckPhotos(
    filter: PhotoFilter = 'all',
    batchSize = 25,
    excludedIds: string[] = []
  ): Promise<Photo[]> {
    const hasPermission = await PermissionService.checkPhotoPermission();
    const excludedSet = new Set(excludedIds);

    if (!hasPermission) {
      return PhotoService.getFallbackBatch(filter, batchSize, excludedSet);
    }

    try {
      const assetType = filter === 'videos' ? 'Videos' : 'Photos';
      const collected: Photo[] = [];
      let cursor: string | undefined = lastCameraRollCursor;
      let hasNextPage = true;
      let iterations = 0;

      // Scan until we have collected the desired batch size of unreviewed photos
      while (collected.length < batchSize && hasNextPage && iterations < 10) {
        iterations++;
        const result = await CameraRoll.getPhotos({
          first: 50,
          after: cursor,
          assetType,
          include: ['fileSize', 'filename', 'imageSize'],
        });

        if (!result.edges || result.edges.length === 0) {
          hasNextPage = false;
          break;
        }

        for (const edge of result.edges) {
          const node = edge.node;
          const photoId = node.id || node.image.uri;
          const photoUri = node.image.uri;

          // Never show a photo that has already been reviewed (kept or trashed)
          if (excludedSet.has(photoId) || excludedSet.has(photoUri)) {
            continue;
          }

          // If screenshots filter is selected, check filename/uri
          if (filter === 'screenshots') {
            const filename = (node.image.filename || '').toLowerCase();
            const uriLower = photoUri.toLowerCase();
            if (!filename.includes('screenshot') && !uriLower.includes('screenshot')) {
              continue;
            }
          }

          const sizeBytes = node.image.fileSize || 3.5 * 1024 * 1024;
          collected.push({
            id: photoId,
            uri: photoUri,
            alt: node.image.filename || 'Device photo',
            size: formatBytes(sizeBytes),
            sizeBytes,
            month: formatMonth(node.timestamp),
            timestamp: node.timestamp,
            isDevicePhoto: true,
          });

          if (collected.length >= batchSize) {
            break;
          }
        }

        cursor = result.page_info?.end_cursor;
        hasNextPage = Boolean(result.page_info?.has_next_page);
      }

      // Save cursor for the subsequent deck
      lastCameraRollCursor = cursor;

      if (collected.length > 0) {
        return collected;
      }

      // If all photos in camera roll were already reviewed, fallback gracefully
      return PhotoService.getFallbackBatch(filter, batchSize, excludedSet);
    } catch (error) {
      console.warn('Failed to load photos from CameraRoll, using fallback deck:', error);
      return PhotoService.getFallbackBatch(filter, batchSize, excludedSet);
    }
  },

  /**
   * Helper to retrieve unreviewed photos from the curated fallback pool.
   */
  getFallbackBatch(
    _filter: PhotoFilter,
    batchSize: number,
    excludedSet: Set<string>
  ): Photo[] {
    const unreviewed = FALLBACK_PHOTOS.filter((p) => !excludedSet.has(p.id));
    if (unreviewed.length > 0) {
      return unreviewed.slice(0, batchSize);
    }

    // If every fallback photo has been reviewed, loop back with new session cycle keys
    // to allow indefinite local testing without dead ends
    return FALLBACK_PHOTOS.slice(0, batchSize).map((p, idx) => ({
      ...p,
      id: `${p.id}-next-${Date.now()}-${idx}`,
    }));
  },

  async deletePhotos(photos: Photo[]): Promise<{ success: boolean; deletedCount: number }> {
    const deviceUris = photos
      .filter((p) => p.isDevicePhoto)
      .map((p) => p.uri);

    let success = true;

    if (deviceUris.length > 0) {
      try {
        await CameraRoll.deletePhotos(deviceUris);
      } catch (error) {
        console.warn('CameraRoll delete error:', error);
        success = false;
      }
    }

    return {
      success,
      deletedCount: photos.length,
    };
  },
};
