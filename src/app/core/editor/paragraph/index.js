export default class Paragraph {
  static get DEFAULT_PLACEHOLDER() {
    return '';
  }

  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;

    this._CSS = {
      block: this.api.styles.block,
      wrapper: 'ce-paragraph',
    };

    if (!this.readOnly) {
      this.onKeyUp = this.onKeyUp.bind(this);
    }
    this._placeholder = config.placeholder ? config.placeholder : Paragraph.DEFAULT_PLACEHOLDER;
    this._data = {};
    this._element = this.drawView();
    this._preserveBlank = config.preserveBlank !== undefined ? config.preserveBlank : false;

    this.data = data;
    this.data = {
      text: data.text || '',
      capitalize: !!data.capitalize,
    };

    this.settings = [
      {
        name: 'capitalize',
        icon: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
\t width="20px" height="20px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">
<path d="M0.7,11c0.6,0.3,1.2,0,1.5-0.6C2.3,10,2.5,9.5,2.7,9.1C2.8,8.9,2.9,8.9,3,8.9c0.7,0,1.3,0,2,0c0.7,0,1.3,0,2,0
\tc0.1,0,0.2,0,0.3,0.2c0.2,0.5,0.4,0.9,0.6,1.4C8.1,11,8.8,11.3,9.4,11c0.6-0.3,0.8-0.9,0.6-1.5C8.6,6.6,7.3,3.7,6,0.7
\tC5.8,0.3,5.5,0,5,0C4.5,0,4.2,0.3,4,0.7C2.7,3.6,1.4,6.6,0.1,9.5C-0.2,10.1,0.1,10.8,0.7,11z M5,3.9c0.4,0.9,0.8,1.8,1.2,2.8
\tc-0.8,0-1.6,0-2.4,0C4.2,5.7,4.6,4.8,5,3.9z M19.9,14.1c0.2,0.7-0.3,1.4-1,1.5c-0.1,0-0.1,0-0.2,0c-5.9,0-11.7,0-17.6,0
\tc-0.5,0-0.9-0.2-1.1-0.7c-0.3-0.7,0.2-1.5,1-1.5c1.4,0,2.8,0,4.3,0c1.6,0,3.1,0,4.7,0c2.9,0,5.9,0,8.8,0
\tC19.4,13.3,19.8,13.6,19.9,14.1z M20,19.1c-0.1,0.5-0.5,0.9-1,0.9c-0.1,0-0.2,0-0.3,0c-2.9,0-5.8,0-8.7,0c-2.9,0-5.8,0-8.7,0
\tc-0.3,0-0.6-0.1-0.9-0.3C0,19.4-0.1,19,0.1,18.5c0.1-0.4,0.5-0.7,1-0.8c0.1,0,0.1,0,0.2,0c5.8,0,11.6,0,17.4,0c0.2,0,0.4,0,0.5,0.1
\tC19.8,18,20.1,18.5,20,19.1z M20,9.7c0.2,0.6-0.2,1.3-0.9,1.4c-0.3,0-0.6,0-0.9,0c-0.7,0-1.4,0-2,0c-0.9,0-1.8,0-2.7,0
\tc-0.6,0-1.1-0.4-1.2-0.9c-0.1-0.6,0.3-1.2,0.9-1.3c0.1,0,0.2,0,0.3,0c1.8,0,3.6,0,5.4,0C19.4,8.9,19.8,9.2,20,9.7z M12.2,1.1
\tc0-0.6,0.5-1.1,1.1-1.1c0.9,0,1.9,0,2.8,0c0,0,0,0,0,0C17,0,18,0,18.9,0c0.5,0,0.8,0.2,1,0.6c0.2,0.4,0.1,0.8-0.2,1.2
\tc-0.2,0.3-0.5,0.4-0.9,0.4c-1.9,0-3.7,0-5.6,0C12.7,2.2,12.2,1.7,12.2,1.1z M12.3,5.9c-0.2-0.4,0-0.9,0.3-1.2
\tc0.2-0.1,0.5-0.3,0.7-0.3c1.9,0,3.7,0,5.6,0C19.5,4.4,20,5,20,5.6c0,0.6-0.5,1.1-1.1,1.1c-0.9,0-1.9,0-2.8,0c-0.9,0-1.9,0-2.8,0
\tC12.8,6.7,12.4,6.4,12.3,5.9z"/>
</svg>
`,
      },
    ];
    this._acceptTuneView();
  }
  onKeyUp(e) {
    if (e.code !== 'Backspace' && e.code !== 'Delete') {
      return;
    }

    const { textContent } = this._element;

    if (textContent === '') {
      this._element.innerHTML = '';
    }
  }
  drawView() {
    let div = document.createElement('DIV');

    div.classList.add(this._CSS.wrapper, this._CSS.block);
    div.contentEditable = false;
    div.dataset.placeholder = this.api.i18n.t(this._placeholder);

    if (!this.readOnly) {
      div.contentEditable = true;
      div.addEventListener('keyup', this.onKeyUp);
    }

    return div;
  }
  render() {
    return this._element;
  }
  merge(data) {
    let newData = {
      text: this.data.text + data.text,
    };

    this.data = newData;
  }
  validate(savedData) {
    if (savedData.text.trim() === '' && !this._preserveBlank) {
      return false;
    }

    return true;
  }
  save(toolsContent) {
    return Object.assign(this.data, {
      text: toolsContent.innerHTML,
    });
  }
  onPaste(event) {
    const data = {
      text: event.detail.data.innerHTML,
    };

    this.data = data;
  }
  static get conversionConfig() {
    return {
      export: 'text',
      import: 'text',
    };
  }
  static get sanitize() {
    return {
      text: {
        br: true,
      },
    };
  }
  static get isReadOnlySupported() {
    return true;
  }
  get data() {
    let text = this._element.innerHTML;

    this._data.text = text;

    return this._data;
  }
  set data(data) {
    this._data = data || {};

    this._element.innerHTML = this._data.text || '';
  }
  static get pasteConfig() {
    return {
      tags: ['P'],
    };
  }
  static get toolbox() {
    return {
      icon:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0.2 -0.3 9 11.4" width="12" height="14">\n' +
        '  <path d="M0 2.77V.92A1 1 0 01.2.28C.35.1.56 0 .83 0h7.66c.28.01.48.1.63.28.14.17.21.38.21.64v1.85c0 .26-.08.48-.23.66-.15.17-.37.26-.66.26-.28 0-.5-.09-.64-.26a1 1 0 01-.21-.66V1.69H5.6v7.58h.5c.25 0 .45.08.6.23.17.16.25.35.25.6s-.08.45-.24.6a.87.87 0 01-.62.22H3.21a.87.87 0 01-.61-.22.78.78 0 01-.24-.6c0-.25.08-.44.24-.6a.85.85 0 01.61-.23h.5V1.7H1.73v1.08c0 .26-.08.48-.23.66-.15.17-.37.26-.66.26-.28 0-.5-.09-.64-.26A1 1 0 010 2.77z"></path>\n' +
        '</svg>',
      title: 'Text',
    };
  }

  renderSettings() {
    const wrapper = document.createElement('div');
    this.settings.forEach((tune) => {
      let button = document.createElement('div');

      button.classList.add('cdx-settings-button');
      button.innerHTML = tune.icon;
      wrapper.appendChild(button);
      button.addEventListener('click', () => {
        this._toggleTune(tune.name);
        button.classList.toggle('cdx-settings-button--active');
      });
    });

    return wrapper;
  }
  _toggleTune(tune) {
    this.data[tune] = !this.data[tune];
    this._acceptTuneView();
  }

  _acceptTuneView() {
    this.settings.forEach((tune) => {
      this._element.classList.toggle(tune.name, !!this.data[tune.name]);
    });
  }
}
