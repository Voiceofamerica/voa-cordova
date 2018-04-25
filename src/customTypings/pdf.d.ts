
interface PdfOptions {
  documentSize: 'A4' | 'A3' | 'A2'
  type: 'base64' | 'share'
  fileName?: string
}

declare const pdf: {
  fromURL: (url: string, options: PdfOptions) => Promise<string>
  fromData: (html: string, options: PdfOptions) => Promise<string>
}
