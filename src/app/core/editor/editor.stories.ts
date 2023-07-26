import { Story, Meta } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';

export default {
  title: 'Component/Editor',
  component: EditorComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
  argTypes: {
    editor: {
      control: {
        type: null,
      },
    },
    id: {
      control: {
        type: null,
      },
    },
    onChange: {
      control: {
        type: null,
      },
    },
    onTouch: {
      control: {
        type: null,
      },
    },
    writeValue: {
      control: {
        type: null,
      },
    },
    ngOnInit: {
      control: {
        type: null,
      },
    },
    registerOnChange: {
      control: {
        type: null,
      },
    },
    registerOnTouched: {
      control: {
        type: null,
      },
    },
  },
} as Meta;

const Template: Story<EditorComponent> = (props: EditorComponent) => ({ props });
export const Default = Template.bind({});
Default.args = {
  data: {
    time: 1674209526037,
    blocks: [
      {
        id: 'qBqBpOfMdz',
        type: 'header',
        data: {
          text: 'Editor.js',
          level: 2,
        },
      },
      {
        id: '7j3Fi3aJLN',
        type: 'paragraph',
        data: {
          text: 'Hey. Meet the new Editor. On this page you can see it in action — try to edit this text.',
        },
      },
      {
        id: 'yg-L_m5SCq',
        type: 'header',
        data: {
          text: 'Key features',
          level: 3,
        },
      },
      {
        id: 'XAmCQhEOC0',
        type: 'list',
        data: {
          style: 'unordered',
          items: [
            'It is a block-styled editor',
            'It returns clean data output in JSON',
            'Designed to be extendable and pluggable with a simple API',
          ],
        },
      },
      {
        id: '7VhTSet2QC',
        type: 'header',
        data: {
          text: 'What does it mean «block-styled editor»',
          level: 3,
        },
      },
      {
        id: 'Y1d9Vf2ZFv',
        type: 'paragraph',
        data: {
          text: 'Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Editor.js <mark class="cdx-marker">workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, etc</mark>. Each of them is an independent contenteditable element (or more complex structure) provided by Plugin and united by Editor\'s Core.',
        },
      },
      {
        id: 'Bx9MJ5vDC-',
        type: 'paragraph',
        data: {
          text: 'There are dozens of <a href="https://github.com/editor-js">ready-to-use Blocks</a> and the <a href="https://editorjs.io/creating-a-block-tool">simple API</a> for creation any Block you need. For example, you can implement Blocks for Tweets, Instagram posts, surveys and polls, CTA-buttons and even games.',
        },
      },
      {
        id: '2V4TZ44Olb',
        type: 'header',
        data: {
          text: 'What does it mean clean data output',
          level: 3,
        },
      },
      {
        id: '4ZetRebfa_',
        type: 'paragraph',
        data: {
          text: 'Classic WYSIWYG-editors produce raw HTML-markup with both content data and content appearance. On the contrary, Editor.js outputs JSON object with data of each Block. You can see an example below',
        },
      },
      {
        id: '_qqWIXoCWh',
        type: 'paragraph',
        data: {
          text: 'Given data can be used as you want: render with HTML for <code class="inline-code">Web clients</code>, render natively for <code class="inline-code">mobile apps</code>, create markup for <code class="inline-code">Facebook Instant Articles</code> or <code class="inline-code">Google AMP</code>, generate an <code class="inline-code">audio version</code> and so on.',
        },
      },
      {
        id: 'UodzZ1RaPQ',
        type: 'paragraph',
        data: {
          text: 'Clean data is useful to sanitize, validate and process on the backend.',
        },
      },
      {
        id: 'n7HtCzPYT9',
        type: 'delimiter',
        data: {},
      },
      {
        id: 'ERmEne9fiq',
        type: 'paragraph',
        data: {
          text: "We have been working on this project more than three years. Several large media projects help us to test and debug the Editor, to make it's core more stable. At the same time we significantly improved the API. Now, it can be used to create any plugin for any task. Hope you enjoy. 😏",
        },
      },
      {
        id: 'Z2s7yEuDMt',
        type: 'image',
        data: {
          file: {
            url: 'https://codex.so/public/app/img/external/codex2x.png',
          },
          caption: '',
          withBorder: false,
          stretched: false,
          withBackground: false,
        },
      },
    ],
    version: '2.26.4',
  },
};
