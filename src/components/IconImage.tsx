import React from 'react';
import { Image, ImageStyle } from 'react-native';

type Props = {
  name: string; // file name in assets/icons
  size?: number;
  style?: ImageStyle;
  color?: string;
};

export default function IconImage({ name, color, size = 28, style }: Props) {
  const source = getIcon(name);

  return (
    <Image
      source={source}
      style={[{ width: size, height: size, resizeMode: 'contain' }, style]}
    />
  );
}

function getIcon(name: string) {
  switch (name) {
    case 'picture-as-pdf':
      return require('../../assets/images/pdf.png');
    case 'image':
      return require('../../assets/images/image.png');
    case 'text-fields':
      return require('../../assets/images/text.png');
    case 'history':
      return require('../../assets/images/history.png');
    case 'merge-type':
      return require('../../assets/images/merge.png');
    case 'scanner':
      return require('../../assets/images/scanner.png');
    case 'setting':
      return require('../../assets/images/setting.png');
    case 'summary':
      return require('../../assets/images/summary.png');
    case 'edit':
      return require('../../assets/images/edit.png');
    case 'back':
      return require('../../assets/images/back.png');
    default:
      return require('../../assets/images/default.png');
  }
}
