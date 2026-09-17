export function formatFileSize(
  fileSizeBytes: number | undefined,
): string | null {
  if (!fileSizeBytes) {
    return null;
  }

  return `${(fileSizeBytes / (1024 * 1024)).toFixed(2)} MB`;
}