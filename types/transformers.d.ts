declare module '@xenova/transformers/dist/transformers.min.js' {
  export const env: {
    useBrowserCache: boolean;
    useCustomCache: boolean;
  };

  export function pipeline(
    task: string,
    model: string,
    options?: any
  ): Promise<any>;

  export interface TranscriptionResult {
    text: string;
    [key: string]: any;
  }
} 