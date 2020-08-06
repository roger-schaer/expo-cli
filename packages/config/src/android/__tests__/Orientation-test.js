import { resolve } from 'path';

import { readAndroidManifestAsync } from '../Manifest';
import { getOrientation, prepareOrientation, setAndroidOrientation } from '../Orientation';

const fixturesPath = resolve(__dirname, 'fixtures');
const sampleManifestPath = resolve(fixturesPath, 'react-native-AndroidManifest.xml');

describe('Android orientation', () => {
  it(`returns null if no orientation is provided`, () => {
    expect(getOrientation({})).toBe(null);
  });

  it(`returns orientation if provided`, () => {
    expect(getOrientation({ orientation: 'landscape' })).toMatch('landscape');
  });

  it(`returns unspecified orientation if provided default`, () => {
    expect(prepareOrientation('default')).toMatch('unspecified');
  });

  describe('File changes', () => {
    let androidManifestJson;
    it('adds orientation attribute if not present', async () => {
      androidManifestJson = await readAndroidManifestAsync(sampleManifestPath);
      androidManifestJson = await setAndroidOrientation(
        { orientation: 'landscape' },
        androidManifestJson
      );

      const mainActivity = androidManifestJson.manifest.application[0].activity.filter(
        e => e['$']['android:name'] === '.MainActivity'
      );
      expect(mainActivity[0]['$']['android:screenOrientation']).toMatch('landscape');
    });

    it('replaces orientation attribute if present', async () => {
      androidManifestJson = await readAndroidManifestAsync(sampleManifestPath);

      androidManifestJson = await setAndroidOrientation(
        { orientation: 'portrait' },
        androidManifestJson
      );
      const mainActivity = androidManifestJson.manifest.application[0].activity.filter(
        e => e['$']['android:name'] === '.MainActivity'
      );
      expect(mainActivity[0]['$']['android:screenOrientation']).toMatch('portrait');
    });

    it('replaces orientation with unspecified if provided default', async () => {
      androidManifestJson = await readAndroidManifestAsync(sampleManifestPath);
      androidManifestJson = await setAndroidOrientation(
        { orientation: 'default' },
        androidManifestJson
      );

      const mainActivity = androidManifestJson.manifest.application[0].activity.filter(
        e => e['$']['android:name'] === '.MainActivity'
      );
      expect(mainActivity[0]['$']['android:screenOrientation']).toMatch('unspecified');
    });
  });
});
