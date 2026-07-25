import JSZip from 'jszip';
import defaultProjectGenerator from '../../../src/lib/default-project/index.js';
import overrideDefaultProject from '../../../src/lib/default-project/default-project.sb3';

describe('defaultProject', () => {
    // This test ensures that the assets referenced in the default project JSON
    // do not get out of sync with the raw assets that are included alongside.
    // see https://github.com/LLK/scratch-gui/issues/4844
    test('assets referenced by the project are included', () => {
        const translatorFn = () => '';
        const defaultProject = defaultProjectGenerator(translatorFn);
        const includedAssetIds = defaultProject.map(obj => obj.id);
        const projectData = JSON.parse(defaultProject[0].data);
        projectData.targets.forEach(target => {
            target.costumes.forEach(costume => {
                expect(includedAssetIds.includes(costume.assetId)).toBe(true);
            });
            target.sounds.forEach(sound => {
                expect(includedAssetIds.includes(sound.assetId)).toBe(true);
            });
        });
    });

    test('the starter costume uses a custom zzPurrzw sprite asset', async () => {
        const zip = await JSZip.loadAsync(overrideDefaultProject);
        const costumeAsset = zip.file('c434b674f2da18ba13cdfe51dbc05ecc.svg');
        expect(costumeAsset).toBeTruthy();

        const costumeContent = await costumeAsset.async('string');
        expect(costumeContent).toContain('zzPurrzw');
    });
});
