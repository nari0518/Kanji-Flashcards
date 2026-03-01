import fs from 'fs-extra';
import path from 'path';

export default function generateSetsPlugin() {
    return {
        name: 'generate-sets-manifest',
        buildStart() {
            const setsDir = path.resolve(process.cwd(), 'public/sets');
            const manifestPath = path.resolve(setsDir, 'index.json');

            try {
                if (fs.existsSync(setsDir)) {
                    const files = fs.readdirSync(setsDir);
                    const csvFiles = files.filter(f => f.endsWith('.csv'));

                    const sets = csvFiles.map(file => {
                        const name = file.replace('.csv', '');
                        // Generate a consistent ID based on the filename
                        const id = `static-set-${Buffer.from(name).toString('base64').substring(0, 10)}`;
                        return { id, name, filename: file };
                    });

                    const manifest = { sets };
                    fs.writeJsonSync(manifestPath, manifest, { spaces: 2 });
                    console.log(`[generate-sets-manifest] Created index.json with ${sets.length} sets from public/sets/`);
                }
            } catch (error) {
                console.error('[generate-sets-manifest] Error generating index.json:', error);
            }
        },
        // Also regenerate when a CSV is added/removed in dev mode
        handleHotUpdate({ file, server }) {
            if (file.includes('public/sets') && file.endsWith('.csv')) {
                const setsDir = path.resolve(process.cwd(), 'public/sets');
                const manifestPath = path.resolve(setsDir, 'index.json');
                const files = fs.readdirSync(setsDir);
                const csvFiles = files.filter(f => f.endsWith('.csv'));

                const sets = csvFiles.map(f => {
                    const name = f.replace('.csv', '');
                    const id = `static-set-${Buffer.from(name).toString('base64').substring(0, 10)}`;
                    return { id, name, filename: f };
                });
                fs.writeJsonSync(manifestPath, { sets }, { spaces: 2 });
                console.log(`[generate-sets-manifest] Updated index.json`);
            }
        }
    };
}
