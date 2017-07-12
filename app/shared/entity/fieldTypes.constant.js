
export default {
  "text":{
    "can_have_default_value":true,
    "can_be_unique":true,
    "can_be_filter":true,
    "can_be_used_in_search":true,
    "can_be_localized":true,
    "has_options":false,
    "has_multiple_values":false,
    "has_input_choice": true,
    "editor": "text",
    "input_choice": {
      "text_input": {
        "label": "Simple Text Input",
        "description": "Short text input for single line text such as title, name...",
        "icon": "title",
        "complex": false,
        "value": "text_input"
      },
      "text_area": {
        "label": "Text Area",
        "description": "Used for longer multiline text without any formating options.",
        "icon": "text_fields",
        "complex": false,
        "value": "text_area"
      },
      "html_editor": {
        "label": "HTML Editor (TinyMCE)",
        "description": "Rich text editor with HTML formating options.",
        "icon": "settings_ethernet",
        "complex": true,
        "value": "html_editor"
      },
      "id_generator": {
        "label": "ID field",
        "description": "Self generated ID field.",
        "icon": "lock_outline",
        "complex": false,
        "value": "id_generator"
      }
      // "markdown": {
      //   "label": "Markdown Editor (Markdown)",
      //   "description": "Rich text editor with markdown formating options.",
      //   "icon": "text_format",
      //   "complex": true,
      //   "value": "markdown"
      // },
    },
    "default_input": "text_input"
  },
  "tags":{
    "can_have_default_value":false,
    "can_be_unique":false,
    "can_be_filter":true,
    "can_be_used_in_search":true,
    "can_be_localized":true,
    "has_options":false,
    "has_multiple_values":true,
    "has_input_choice": false,
    "editor": "text",
    "input_choice": {
      "tag_input": {
        "label": "Tags Input",
        "description": "",
        "icon": "title",
        "complex": false,
        "value": "tag_input"
      }
    },
    "default_input": "tag_input"
  },
  "integer":{
    "can_have_default_value":true,
    "can_be_unique":true,
    "can_be_filter":true,
    "can_be_used_in_search":false,
    "can_be_localized":true,
    "has_options":false,
    "has_multiple_values":false,
    "editor": "integer",
    "has_input_choice": false,
    "input_choice": {
      "integer_input": {
        "label": "Integer Input",
        "description": "",
        "icon": "title",
        "complex": false,
        "value": "integer_input"
      },
      "cas_num_input": {
        "label": "Case Number Input",
        "description": "",
        "icon": "title",
        "complex": false,
        "value": "cas_num_input"
      }
    },
    "default_input": "integer_input"
  },
  "decimal":{
    "can_have_default_value":true,
    "can_be_unique":true,
    "can_be_filter":true,
    "can_be_used_in_search":false,
    "can_be_localized":true,
    "has_options":false,
    "has_multiple_values":false,
    "editor": "integer",
    "has_input_choice": false,
    "input_choice": {
      "decimal_input": {
        "label": "Decimal Input",
        "description": "",
        "icon": "title",
        "complex": false,
        "value": "decimal_input"
      }
    },
    "default_input": "decimal_input"
  },
  "datetime":{
    "can_have_default_value":false,
    "can_be_unique":false,
    "can_be_filter":false,
    "can_be_used_in_search":false,
    "can_be_localized":true,
    "has_options":false,
    "has_multiple_values":false,
    "editor": "datetime",
    "has_input_choice": false,
    "input_choice": {
      "date_input": {
        "label": "Date Input",
        "description": "",
        "icon": "title",
        "complex": false,
        "value": "date_input"
      }
    },
    "default_input": "date_input"
  },
  "select":{
    "can_have_default_value":false,
    "can_be_unique":false,
    "can_be_filter":true,
    "can_be_used_in_search":false,
    "can_be_localized":true,
    "has_options":true,
    "has_multiple_values":false,
    "editor": "select",
    "has_input_choice": true,
    "input_choice": {
      "select_input": {
        "label": "Select box",
        "description": "Choose your option from dropdown select menu...",
        "icon": "credit_card",
        "complex": false,
        "value": "select_input"
      },
      "radio_input": {
        "label": "Radio buttons",
        "description": "Choose your option from radio menu.",
        "icon": "radio_button_checked",
        "complex": false,
        "value": "radio_input"
      }
    },
    "default_input": "select_input"
  },
  "multiselect":{
    "can_have_default_value":false,
    "can_be_unique":false,
    "can_be_filter":true,
    "can_be_used_in_search":false,
    "can_be_localized":true,
    "has_options":true,
    "has_multiple_values":true,
    "editor": "select",
    "has_input_choice": false,
    "input_choice": {
      "checkbox": {
        "label": "Checkbox",
        "description": "",
        "icon": "title",
        "complex": false,
        "value": "checkbox"
      }
    },
    "default_input": "checkbox"
  },
  "boolean":{
    "can_have_default_value":true,
    "can_be_unique":false,
    "can_be_filter":true,
    "can_be_used_in_search":false,
    "can_be_localized":true,
    "has_options":false,
    "has_multiple_values":false,
    "editor": "boolean",
    "has_input_choice": true,
    "input_choice": {
      "boolean_radio": {
        "label": "Radio button",
        "description": "Choose one of two radio buttons for true/false values",
        "icon": "title",
        "complex": false,
        "value": "boolean_radio"
      },
      "boolean_select": {
        "label": "Select box",
        "description": "Choose from dropdown menu.",
        "icon": "text_fields",
        "complex": false,
        "value": "boolean_select"
      },
    },
    "default_input": "boolean_radio"
  },
  "relation":{
    "can_have_default_value":false,
    "can_be_unique":false,
    "can_be_filter":true,
    "can_be_used_in_search":false,
    "can_be_localized":true,
    "has_options":false,
    "has_multiple_values":false,
    "editor": "relation",
    "has_input_choice": false,
    "input_choice": {
      "relation_search": {
        "label": "Search for relations",
        "description": "",
        "icon": "title",
        "complex": true,
        "value": "relation_search"
      }
    },
    "default_input": "relation_search"
  },
  "asset":{
    "can_have_default_value":false,
    "can_be_unique":false,
    "can_be_filter":false,
    "can_be_used_in_search":false,
    "can_be_localized":true,
    "has_options":false,
    "has_multiple_values":false,
    "editor": "asset",
    "has_input_choice": false,
    "input_choice": {
      "media_library": {
        "label": "Media Library",
        "description": "",
        "icon": "title",
        "complex": true,
        "value": "media_library"
      }
    },
    "default_input": "media_library"
  },
  "relation_collection": {
    "can_have_default_value":false,
    "can_be_unique":false,
    "can_be_filter":true,
    "can_be_used_in_search":false,
    "can_be_localized":true,
    "has_options":false,
    "has_multiple_values":true,
    "editor": "relation",
    "has_input_choice": false,
    "input_choice": {
      "relation_search": {
        "label": "Search for relations",
        "description": "",
        "icon": "title",
        "complex": true,
        "value": "relation_search"
      }
    },
    "default_input": "relation_search"
  },
  "asset_collection": {
    "can_have_default_value":false,
    "can_be_unique":false,
    "can_be_filter":false,
    "can_be_used_in_search":false,
    "can_be_localized":true,
    "has_options":false,
    "has_multiple_values":true,
    "editor": "asset",
    "has_input_choice": false,
    "input_choice": {
      "media_library": {
        "label": "Media Library",
        "description": "",
        "icon": "title",
        "complex": true,
        "value": "media_library"
      }
    },
    "default_input": "media_library"
  }
}