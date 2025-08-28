
import Quill from 'quill';

export function registerCustomSizes() {
  const SizeStyle = Quill.import('attributors/style/size') as any;
  SizeStyle.whitelist = ['12px', '14px', '16px', '18px', '24px', '32px'];
  Quill.register(SizeStyle, true);
}
