// @ts-nocheck
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Code from '@editorjs/code';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import Underline from '@editorjs/underline';
import InlineCode from '@editorjs/inline-code';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import Raw from '@editorjs/raw';
import Delimiter from '@editorjs/delimiter';
import Component from './component';
import Button from './button';
import Paragraph from './paragraph';

import { environment } from '@src/environments/environment';
import axios from 'axios';

const inlineToolbar = ['bold', 'italic', 'underline', 'link', 'inlineCode', 'marker'];
export const editorjsConfig = {
  defaultBlock: 'paragraph',
  tools: {
    embed: {
      class: Embed,
      config: {
        services: {
          youtube: true,
          coub: true,
          facebook: true,
          instagram: true,
          twitter: true,
          twitch: true,
          miro: true,
          vimeo: true,
          gfycat: true,
          imgur: true,
          vine: true,
          aparat: true,
          codePen: true,
          pinterest: true,
        },
      },
    },
    inlineCode: { class: InlineCode },
    marker: { class: Marker },
    underline: { class: Underline },

    paragraph: {
      class: Paragraph,
      inlineToolbar,
      config: {
        placeholder: 'Please enter the word',
      },
    },
    header: {
      class: Header,
      inlineToolbar,
    },
    image: {
      class: Image,
      config: {
        uploader: {
          async uploadByFile(file) {
            const bodyFormData = new FormData();
            bodyFormData.append('file', file);
            const res = await axios.post(
              environment.apiUrl + `core/nodes/upload/physical/blob?destinationPhysicalPath=posts/8ebc5c9e`,
              bodyFormData,
              {
                headers: {
                  Authorization: 'Bearer ' + JSON.parse(localStorage.getItem(environment.userData))?.tokenString,
                  'Content-Type': 'multipart/form-data',
                },
              },
            );

            return {
              success: 1,
              file: {
                url: environment.hostUrl + res.data.data.physicalPath,
              },
            };
          },
        },
      },
    },
    list: {
      class: List,
      inlineToolbar,
    },
    code: { class: Code },
    quote: { class: Quote },
    delimiter: { class: Delimiter },
    rawTool: { class: Raw },
    table: {
      class: Table,
      config: {
        rows: 2,
        cols: 3,
      },
    },
    button: { class: Button },
    component: { class: Component },
  },
};
