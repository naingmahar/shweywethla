import jszip from 'jszip';

export async function extractZip(file: File): Promise<{ [filename: string]: string }> {
  const zip = await jszip.loadAsync(file);
  const files: { [filename: string]: string } = {};

  await Promise.all(
    Object.keys(zip.files).map(async (filename) => {
      const zipEntry = zip.files[filename];
      if (!zipEntry.dir) {
        const content = await zipEntry.async('string');
        files[filename] = content;
      }
    })
  );

  return files;
}   