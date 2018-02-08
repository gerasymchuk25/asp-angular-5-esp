export class ServiceField {
  fieldName: string;
  fieldValue: string;
  fieldKey?: string;
  filter: string;
  format: string;
  heading: string;
  hint: string;
  index: number;
  lengthMax: number;
  lengthMin: number;
  mask: string;
  regEx: string;
  autocomplete: Array<{ itemKey: string, caption: string }>;
  // calculated field
  ourMask: string;
  slotChar: string;
  autocompleteItemModels: Array<{ id: string, text: string }>;
  // custom fields
  fieldLabel?: string;
}

export class ServiceFieldData {
  fieldName: string;
  fieldValue: string;
  fieldKey?: string;
}
