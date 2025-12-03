import { promises as fs } from 'fs';
import path from 'path';

export interface MDXPostInfo {
  slug: string;
  title: string;
}

// Pobierz wszystkie slugi z katalogu postów
async function getNoteSlugs(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, {
    recursive: true,
    withFileTypes: true,
  });
  
  return entries
    .filter((entry) => entry.isFile() && entry.name === 'page.mdx')
    .map((entry) => {
      const relativePath = path.relative(
        dir,
        path.join(entry.parentPath, entry.name)
      );
      return path.dirname(relativePath);
    })
    .map((slug) => slug.replace(/\\/g, '/'));
}

// Wyciągnij tytuł z pliku MDX
async function extractTitleFromMDX(filePath: string): Promise<string> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Próba wyciągnięcia z metadata export
    const metadataMatch = content.match(
      /export const metadata = \{[\s\S]*?title:\s*['"](.*?)['"]/
    );
    if (metadataMatch) {
      return metadataMatch[1];
    }
    
    // Fallback: pierwszy nagłówek H1
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) {
      return h1Match[1];
    }
    
    // Ostateczny fallback: nazwa folderu
    const slug = path.basename(path.dirname(filePath));
    return slug;
  } catch (error) {
    console.error(`Error reading MDX file ${filePath}:`, error);
    return path.basename(path.dirname(filePath));
  }
}

// Główna funkcja do pobierania wszystkich postów MDX
export async function getMDXPosts(): Promise<MDXPostInfo[]> {
  try {
    // Sprawdź czy katalog app/n istnieje (zgodnie z dokumentacją)
    const notesDirectoryN = path.join(process.cwd(), 'src', 'app', 'n');
    const notesDirectoryBlog = path.join(process.cwd(), 'src', 'app', 'blog');
    
    let notesDirectory: string | null = null;
    let slugs: string[] = [];
    
    // Spróbuj najpierw app/n (zgodnie z dokumentacją)
    try {
      await fs.access(notesDirectoryN);
      notesDirectory = notesDirectoryN;
      slugs = await getNoteSlugs(notesDirectoryN);
    } catch {
      // Jeśli app/n nie istnieje, spróbuj app/blog
      try {
        await fs.access(notesDirectoryBlog);
        notesDirectory = notesDirectoryBlog;
        slugs = await getNoteSlugs(notesDirectoryBlog);
      } catch {
        // Jeśli żaden katalog nie istnieje, zwróć pustą tablicę
        return [];
      }
    }
    
    if (!notesDirectory || slugs.length === 0) {
      return [];
    }
    
    const posts = await Promise.all(
      slugs.map(async (slug) => {
        const filePath = path.join(notesDirectory!, slug, 'page.mdx');
        const title = await extractTitleFromMDX(filePath);
        return { slug, title };
      })
    );
    
    return posts;
  } catch (error) {
    console.error('Error getting MDX posts:', error);
    return [];
  }
}

