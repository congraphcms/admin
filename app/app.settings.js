/**
 * Factory function that creates the grab-bag Settings service.
 * ngInject
 */

export default function SettingsFactory() {

  return {
    APP: SETTINGS,
    assetTypes: {
      "image":{
        "label": "Image",
        "description": "Some description",
        "icon": "image",
        "mime_types": [
          {
            name: "JPEG Image",
            mime_type: "image/jpeg",
            extensions: [".jpeg", ".jpg"]
          },
          {
            name: "PNG (Portable Network Graphics)",
            mime_type: "image/png",
            extensions: [".png"]
          },
          {
            name: "GIF (Graphics Interchange Format)",
            mime_type: "image/gif",
            extensions: [".gif"]
          },
          {
            name: "BMP Bitmap Image File",
            mime_type: "image/bmp",
            extensions: [".bmp"]
          },
          {
            name: "TIFF (Tagged Image File Format)",
            mime_type: "image/tiff",
            extensions: [".tiff"]
          },
          {
            name: "SVG (Scalable Vector Graphics)",
            mime_type: "image/svg+xml",
            extensions: [".svg"]
          },
          {
            name: "Icon Image",
            mime_type: "image/x-icon",
            extensions: [".ico"]
          },
          {
            name: "WebP Image",
            mime_type: "image/webp",
            extensions: [".webp"]
          },

        ]
      },
      "video":{
        "label": "Video",
        "description": "Some description",
        "icon": "videocam",
        "mime_types": [

        ]
      },
      "audio":{
        "label": "Audio",
        "description": "Some description",
        "icon": "audiotrack",
        "mime_types": [

        ]
      },
      "document":{
        "label": "Document",
        "description": "Some description",
        "icon": "insert_drive_file",
        "mime_types": [

        ]
      },
      "archive":{
        "label": "Archive",
        "description": "Some description",
        "icon": "layers",
        "mime_types": [

        ]
      },
    }
  };
}
