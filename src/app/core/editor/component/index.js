const listStyle = [
  { value: 'style1', label: 'Style 1' },
  { value: 'style2', label: 'Style 2' },
  { value: 'style3', label: 'Style 3' },
];
const listType = [{ value: 'slider', label: 'Slider' }];
export default class Component {
  static get toolbox() {
    return {
      title: 'Component',
      icon:
        '<svg version="1.1" x="0px" y="0px" viewBox="0 0 273.38 273.27">\n' +
        '<rect x="26.2" y="102.55" transform="matrix(0.7071 0.7071 -0.7071 0.7071 114.6528 -2.7623)" fill="none" stroke="#000000" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="68.93" height="68.93"/>\n' +
        '<rect x="179.08" y="102.55" transform="matrix(0.7071 0.7071 -0.7071 0.7071 159.43 -110.864)" fill="none" stroke="#000000" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="68.93" height="68.93"/>\n' +
        '<rect x="102.64" y="26.11" transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 276.8797 6.468)" fill="none" stroke="#000000" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="68.93" height="68.93"/>\n' +
        '<rect x="102.64" y="178.99" transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 384.9812 267.4485)" fill="none" stroke="#000000" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" width="68.93" height="68.93"/>\n' +
        '</svg>',
    };
  }

  constructor({ data, api }) {
    this.data = data;
    this.api = api;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex gap-2 cdx-block';

    const select = document.createElement('select');
    select.className = 'cdx-input input-select';
    wrapper.appendChild(select);
    const option = document.createElement('option');
    option.innerText = '';
    option.selected = !this.data || !this.data.name;
    select.appendChild(option);
    for (let i = 0; i < listType.length; i++) {
      const option = document.createElement('option');
      option.value = listType[i].value;
      option.innerText = listType[i].label;
      option.selected = this.data && this.data.name && this.data.name === listType[i].value;
      select.appendChild(option);
    }
    select.onchange = () => (this.data.name = select.value);

    const selectStyle = document.createElement('select');
    selectStyle.className = 'cdx-input input-select-style';
    wrapper.appendChild(selectStyle);
    const optionStyle = document.createElement('option');
    optionStyle.innerText = '';
    optionStyle.selected = !this.data || !this.data.style;
    selectStyle.appendChild(optionStyle);
    for (let i = 0; i < listStyle.length; i++) {
      const optionStyle = document.createElement('option');
      optionStyle.value = listStyle[i].value;
      optionStyle.innerText = listStyle[i].label;
      optionStyle.selected = this.data && this.data.style && this.data.style === listStyle[i].value;
      selectStyle.appendChild(optionStyle);
    }
    selectStyle.onchange = () => (this.data.style = selectStyle.value);

    const inputCode = document.createElement('input');
    inputCode.className = 'cdx-input input-code';
    wrapper.appendChild(inputCode);
    inputCode.placeholder = 'Enter code data';
    inputCode.value = this.data && this.data.code ? this.data.code : '';

    return wrapper;
  }

  validate(savedData) {
    if (!savedData.code.trim()) {
      return false;
    }

    return true;
  }

  save(blockContent) {
    const inputCode = blockContent.querySelector('input.input-code');
    const selectStyle = blockContent.querySelector('select.input-select-style');
    const select = blockContent.querySelector('select');
    return {
      code: inputCode.value,
      style: selectStyle.value,
      name: select.value,
    };
  }
}
