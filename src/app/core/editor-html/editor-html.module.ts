import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorHtmlComponent } from './editor-html.component';

@NgModule({
  declarations: [EditorHtmlComponent],
  exports: [EditorHtmlComponent],
  imports: [CommonModule],
})
export class GEditorHtmlModule {}
