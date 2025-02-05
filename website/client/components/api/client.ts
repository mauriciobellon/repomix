export interface PackOptions {
  removeComments: boolean;
  removeEmptyLines: boolean;
  showLineNumbers: boolean;
  fileSummary?: boolean;
  directoryStructure?: boolean;
  includePatterns?: string;
  ignorePatterns?: string;
  outputParsable?: boolean;
}

export interface PackRequest {
  url: string;
  format: 'xml' | 'markdown' | 'plain';
  options: PackOptions;
  signal?: AbortSignal;
}

export interface PackResult {
  content: string;
  format: string;
  metadata: {
    repository: string;
    timestamp: string;
    summary: {
      totalFiles: number;
      totalCharacters: number;
      totalTokens: number;
    };
    topFiles: {
      path: string;
      charCount: number;
    }[];
  };
}

export interface ErrorResponse {
  error: string;
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_BASE_URL = import.meta.env.PROD ? 'https://repomix-server.bellon.dev' : 'https://repomix-server.bellon.dev';

export async function packRepository(request: PackRequest): Promise<PackResult> {
  const response = await fetch(`${API_BASE_URL}/api/pack`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    signal: request.signal,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError((data as ErrorResponse).error);
  }

  return data as PackResult;
}
