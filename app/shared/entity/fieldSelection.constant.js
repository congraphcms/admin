
export default {
  "text": {
    "label": "Text",
    "description": "Text fields such as title, description, bio, tags, lists...",
    "icon": "text_fields",
    "sub_choices": {
      "text": {
        "label": "Text",
        "description": "Plain alphanumerical text...",
        "icon": "text_fields",
        "value": "text"
      },
      "compound": {
        "label": "Compound",
        "description": "Merge fields together",
        "icon": "text_fields",
        "value": "compound"
      },
      "tags": {
        "label": "Tags",
        "description": "Collection of short terms (tags).",
        "icon": "local_offer",
        "value": "tags"
      }
    }
  },
  "number": {
    "label": "Number",
    "description": "Number field such as quantity, price, age, etc.",
    "icon": "looks_one",
    "sub_choices": {
      "integer": {
        "label": "Integer Number",
        "description": "A whole number, such as a age (e.g. 28) or value (e.g. 1, 2, 37, 305)",
        "icon": "looks_one",
        "value": "integer"
      },
      "decimal": {
        "label": "Decimal Number",
        "description": "A number that allows exact decimal values, often used for price or cost (such as 199.99)",
        "icon": "looks_one",
        "value": "decimal"
      }
    }
  },
  "datetime": {
    "label": "Date and Time",
    "description": "Dates and time",
    "icon": "date_range",
    "value": "datetime",
    "sub_choices": false
  },
  "boolean": {
    "label": "Boolean",
    "description": "True / False; Yes / No.",
    "icon": "hdr_strong",
    "value": "boolean",
    "sub_choices": false
  },
  "choice": {
    "label": "Choice",
    "description": "Choose one or more out of predefined values.",
    "icon": "check_box",
    "sub_choices": {
      "select": {
        "label": "Single choice",
        "description": "Select box or radio button",
        "icon": "radio_button_checked",
        "value": "select"
      },
      "multiselect": {
        "label": "Multiple choice",
        "description": "Can have multiple values selected",
        "icon": "check_box",
        "value": "multiselect"
      }
    }
  },
  "asset": {
    "label": "Asset",
    "description": "Asset represent any kind of file (an image, a video, a PDF or any other filetype) attached to content entry.",
    "icon": "image",
    "sub_choices": {
      "asset": {
        "label": "Single asset",
        "description": "One attachment such as featured image or document",
        "icon": "image",
        "value": "asset"
      },
      "asset_collection": {
        "label": "Asset collection",
        "description": "Many attachments (gallery, related documents)",
        "icon": "collections",
        "value": "asset_collection"
      }
    }
  },
  "relation": {
    "label": "Relation",
    "description": "Reference to other objects in system.",
    "icon": "share",
    "sub_choices": {
      "relation": {
        "label": "Single relation (one to many)",
        "description": "Single reference to one object.",
        "icon": "linear_scale",
        "value": "relation"
      },
      "relation_collection": {
        "label": "Relation collection (many to many)",
        "description": "Multiple referencies to may objects.",
        "icon": "share",
        "value": "relation_collection"
      },
      "node": {
        "label": "Single node (one to many)",
        "description": "Same as relation but values will be saved in field and automatically retreived without the need for specific include.",
        "icon": "linear_scale",
        "value": "node"
      },
      "node_collection": {
        "label": "Node collection (many to many)",
        "description": "Multiple nodes.",
        "icon": "share",
        "value": "node_collection"
      }
    }
  },
  "location": {
    "label": "Location",
    "description": "Reference to other objects in system.",
    "icon": "place",
    "value": "location",
    "sub_choices": false
    // "disabled": true
  }
}
