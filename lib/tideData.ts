import { promises as fs } from 'fs';
import path from 'path';

export async function getPortData(id: string) {
  try {
    const filePath = path.join(process.cwd(), 'data', `${id}.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Erro ao ler dados do porto ${id}:`, error);
    return null;
  }
}
