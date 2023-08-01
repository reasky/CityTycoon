import { Image } from 'react-native';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';

import { useFonts } from 'expo-font';

import preloadFonts from './preloadFonts';

const cacheFonts = (fonts) => fonts.map((font) => Font.loadAsync(font));

const loadAssetsAsync = async () => {
  const fontAssets = cacheFonts(preloadFonts);
  console.log('fontAssets')
  console.log(fontAssets)

  return Promise.all([...fontAssets]);
};

export default {
  cacheFonts,
  loadAssetsAsync
};
