import * as fs from 'fs/promises';
import * as path from 'path';

export class FileService {

    
    public async deleteLocalFile(fileUrl: string): Promise<void> {
        if (!fileUrl) return;

        try {
            
            const urlPath = new URL(fileUrl).pathname;
            
           
            const filePath = path.join('public', urlPath);

            
            await fs.access(filePath);
            await fs.unlink(filePath);
            console.log(`Archivo anterior eliminado: ${filePath}`);
        } catch (error: any) {
           
            if (error.code !== 'ENOENT') {
                console.error(`Error al eliminar el archivo ${fileUrl}:`, error);
            }
        }
    }
}