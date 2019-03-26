export class ContentUnit {
    insideTag: string;
    text: string;
    isEditable: boolean;

    constructor(insideTag, text, isEditable) {
      this.insideTag = insideTag;
      this.text = text;
      this.isEditable = isEditable;
    }
}
