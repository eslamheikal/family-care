import { Attachment } from "../models/attachment.model";

export class AttachmentHelper {
    static getIcon(fileName: string): string {
        const extension = fileName.split('.').pop()?.toLowerCase();

        switch (extension) {
            // Documents
            case 'pdf':
                return 'fa-file-pdf';
            case 'doc':
            case 'docx':
                return 'fa-file-word';
            case 'xls':
            case 'xlsx':
                return 'fa-file-excel';
            case 'ppt':
            case 'pptx':
                return 'fa-file-powerpoint';
            case 'txt':
                return 'fa-file-lines';
            case 'csv':
                return 'fa-file-csv';

            // Images
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'bmp':
            case 'svg':
            case 'webp':
                return 'fa-file-image';

            // Videos
            case 'mp4':
            case 'avi':
            case 'mkv':
            case 'mov':
            case 'wmv':
            case 'flv':
                return 'fa-file-video';

            // Audio
            case 'mp3':
            case 'wav':
            case 'ogg':
            case 'flac':
                return 'fa-file-audio';

            // Archives
            case 'zip':
            case 'rar':
            case '7z':
            case 'tar':
            case 'gz':
                return 'fa-file-zipper';

            // Code
            case 'js':
            case 'ts':
            case 'html':
            case 'css':
            case 'json':
            case 'xml':
            case 'java':
            case 'cs':
            case 'cpp':
            case 'py':
            case 'sh':
                return 'fa-file-code';

            default:
                return 'fa-file';
        }
    }
}