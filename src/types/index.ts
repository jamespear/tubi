export interface VideoMetadata {
    id: string;
    title: string;
    description: string;
    duration: number; // in seconds
    format: string; // e.g., 'mp4', 'webm'
    size: number; // in bytes
    createdAt: Date;
}

export interface StreamRequest {
    videoId: string;
    range?: string; // e.g., 'bytes=0-'
    format?: string; // e.g., 'mp4'
}