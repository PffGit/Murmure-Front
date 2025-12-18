import { useState, useEffect } from 'react';
import { Image, useWindowDimensions } from 'react-native';

// --- HOOK DE POSITIONNEMENT RESPONSIVE ---
// Permet de positionner des éléments de façon responsive sur une image
const useResponsiveImagePosition = (imageSource) => {
  const { width: screenW, height: screenH } = useWindowDimensions(); // Dimensions de l'écran
  const [imageDimensions, setImageDimensions] = useState({ width: 1080, height: 1920 }); // Dimensions par défaut format portrait

  useEffect(() => {
    // Le useEffect sert à charger les dimensions de l'image sur le web
    // Sur web, on charge l'image pour obtenir ses vraies dimensions
    if (!Image.resolveAssetSource && typeof imageSource === 'number') {
      // Sur React Native Web, require() retourne un objet avec une propriété uri ou default
      const imgUri = imageSource?.default || imageSource;
      if (typeof window !== 'undefined' && imgUri) {
        const img = new window.Image();
        img.onload = () => {
          setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
          console.log(`[Web] Dimensions réelles de l'image: ${img.naturalWidth}x${img.naturalHeight}`);
        };
        img.src = imgUri;
      }
    }
  }, [imageSource]);

  // Vérification de sécurité pour éviter les crashes
  let imageData = null;

  if (Image.resolveAssetSource) {
    // Sur mobile (iOS/Android)
    imageData = Image.resolveAssetSource(imageSource);
  } else {
    imageData = imageDimensions; // Sur web, on utilise les dimensions chargées dynamiquement
  }

  const { width: originalW, height: originalH } = imageData; // variable dimensions originale de l'image

  const screenRatio = screenW / screenH; // variable screenRatio pour Ratio écran
  const imageRatio = originalW / originalH; // variable imageRatio pour Ratio image

  let scale, xOffset, yOffset; // variables de calcul

  if (screenRatio > imageRatio) {
    // L'image est plus "haute" que l'écran
    scale = screenW / originalW;
    xOffset = 0;
    yOffset = (screenH - originalH * scale) / 2; // Centrage vertical
  } else {
    scale = screenH / originalH;
    yOffset = 0;
    xOffset = (screenW - originalW * scale) / 2; // Centrage horizontal
  }

  const getPos = (originalX, originalY) => ({
    // position après mise à l'échelle et centrage
    left: xOffset + originalX * scale,
    top: yOffset + originalY * scale,
    position: 'absolute',
  });

  return {
    getPos, // Fonction de positionnement
    scale, // Facteur d'échelle pour adapter les tailles
    originalW, // Largeur originale de l'image
    originalH, // Hauteur originale de l'image
  };
};

export default useResponsiveImagePosition;
