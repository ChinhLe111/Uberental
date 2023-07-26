export default class Button {
  static get toolbox() {
    return {
      title: 'Button',
      icon:
        '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
        '\t viewBox="0 0 20.5 20.5" enable-background="new 0 0 20.5 20.5" xml:space="preserve">\n' +
        '<path d="M12.1,20.5c-0.2-0.5-0.5-0.7-0.9-0.9c-0.4-0.2-0.9-0.4-1.3-0.6c-0.6-0.2-1.2-0.6-1.7-0.9c-0.6-0.4-1.2-0.8-1.9-1.1\n' +
        '\tc-0.8-0.3-1.6-0.4-2.4-0.4c-0.2,0-0.4,0-0.6,0c-0.3,0-0.7-0.1-0.8-0.4c-0.2-0.3,0-0.7,0.2-1c0.4-0.5,0.9-0.8,1.6-0.8\n' +
        '\tc0.5,0,1.1,0.1,1.6,0.2c0.6,0.1,1.1,0.1,1.6-0.1c0.4-0.2,0.5-0.4,0.4-0.8c-0.1-1-0.5-1.9-0.8-2.9C6.6,9,6,7.1,5.5,5.3\n' +
        '\tC5.4,4.9,5.4,4.5,5.3,4c0-0.5,0.3-0.8,0.8-0.9c0.3,0,0.5,0.1,0.7,0.3C7,3.7,7.2,4,7.4,4.4c0.3,1,0.6,2,0.9,3\n' +
        '\tc0.1,0.4,0.3,0.9,0.4,1.3c0,0.1,0.1,0.2,0.1,0.3c0,0.1,0.1,0.1,0.2,0.2C9,9.1,9.1,9.1,9.1,9c0-0.1,0-0.2,0-0.3\n' +
        '\tc0-0.6,0.3-0.8,0.9-0.8c0.3,0,0.5,0.1,0.7,0.3c0.4,0.3,0.4,0.3,0.6-0.1c0.1-0.2,0.2-0.4,0.4-0.5c0.3-0.3,0.7-0.3,1.1,0\n' +
        '\tc0.2,0.1,0.3,0.2,0.4,0.4c0.2,0.2,0.3,0.2,0.5,0c0.4-0.5,0.7-0.6,1.4-0.2c0.7,0.4,1.2,1.1,1.6,1.8c0.8,1.4,1.2,3,1.4,4.6\n' +
        '\tc0.1,1.1-0.1,2.1-0.3,3.2c-0.1,0.3,0,0.6,0,0.9c0,0.2,0,0.2-0.2,0.3c-1.8,0.7-3.6,1.4-5.3,2C12.3,20.4,12.2,20.4,12.1,20.5\n' +
        '\tC12.1,20.5,12.1,20.5,12.1,20.5z M4.7,5.5c0-0.1-0.1-0.2-0.2-0.2c-0.6-0.4-0.9-1-1-1.7C3.5,2.3,4.5,1.2,5.8,1.2c1.3,0,2.3,1,2.3,2.3\n' +
        '\tc0,0.4,0.1,0.8,0.2,1.1c0.1,0.3,0.2,0.6,0.3,0.9c0.8-1,1-2.6,0.1-3.9C7.8,0.2,6.1-0.3,4.6,0.2C3.1,0.8,2.2,2.4,2.4,4\n' +
        '\tc0.2,1.3,1.5,2.7,2.6,2.8C4.9,6.3,4.8,5.9,4.7,5.5z"/>\n' +
        '</svg>\n',
    };
  }

  constructor({ data }) {
    this.data = data;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex gap-2 cdx-block';

    const inputText = document.createElement('input');
    inputText.className = 'cdx-input input-text';
    wrapper.appendChild(inputText);
    inputText.placeholder = 'Enter text';
    inputText.value = this.data && this.data.text ? this.data.text : '';

    const inputLink = document.createElement('input');
    inputLink.className = 'cdx-input input-link';
    wrapper.appendChild(inputLink);
    inputLink.placeholder = 'Enter link';
    inputLink.value = this.data && this.data.link ? this.data.link : '';

    return wrapper;
  }

  validate(savedData) {
    if (!savedData.text.trim()) {
      return false;
    }

    return true;
  }

  save(blockContent) {
    const inputText = blockContent.querySelector('input.input-text');
    const inputLink = blockContent.querySelector('input.input-link');
    return {
      text: inputText.value,
      link: inputLink.value,
    };
  }
}
