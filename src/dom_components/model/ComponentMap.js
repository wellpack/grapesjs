import Component from './ComponentImage';
import OComponent from './Component';

export default Component.extend(
  {
    defaults: {
      ...Component.prototype.defaults,
      type: 'map',
      src: '',
      void: 0,
      mapUrl: 'https://www.google.com/maps/embed/v1/place',
      tagName: 'iframe',
      mapType: 'mapType',
      address: '',
      zoom: '1',
      attributes: { frameborder: 0 },
      toolbar: OComponent.prototype.defaults.toolbar,
      traits: [
        {
          label: 'Address',
          name: 'address',
          placeholder: 'eg. London, UK',
          changeProp: 1
        },
        {
          type: 'select',
          label: 'Map type',
          name: 'mapType',
          changeProp: 1,
          options: [
            { value: 'roadmap', name: 'Roadmap' },
            { value: 'satellite', name: 'Satellite' }
          ]
        },
        {
          label: 'Zoom',
          name: 'zoom',
          type: 'range',
          min: '1',
          max: '20',
          changeProp: 1
        }
      ]
    },

    initialize(o, opt) {
      if (this.get('src')) this.parseFromSrc();
      else this.updateSrc();
      Component.prototype.initialize.apply(this, arguments);
      this.listenTo(
        this,
        'change:address change:zoom change:mapType',
        this.updateSrc
      );
    },

    updateSrc() {
      this.set('src', this.getMapUrl());
    },

    /**
     * Returns url of the map
     * @return {string}
     * @private
     */
    getMapUrl() {
      var md = this;
      var addr = md.get('address');
      var zoom = md.get('zoom');
      var type = md.get('mapType');
      var size = '';
      var gmApiKey = this.config.em.get('gmApiKey')
        ? 'key=' + this.config.em.get('gmApiKey')
        : '';
      addr = addr ? '&q=' + addr : '';
      zoom = zoom ? '&zoom=' + zoom : '';
      type = type ? '&maptype=' + type : '';
      return md.get('mapUrl') + '?' + gmApiKey + addr + zoom + type;
    },

    /**
     * Set attributes by src string
     * @private
     */
    parseFromSrc() {
      var uri = this.parseUri(this.get('src'));
      var qr = uri.query;
      if (qr.q) this.set('address', qr.q);
      if (qr.zoom) this.set('zoom', qr.zoom);
      if (qr.mapType) this.set('mapType', qr.mapType);
    }
  },
  {
    /**
     * Detect if the passed element is a valid component.
     * In case the element is valid an object abstracted
     * from the element will be returned
     * @param {HTMLElement}
     * @return {Object}
     * @private
     */
    isComponent(el) {
      var result = '';
      if (
        el.tagName == 'IFRAME' &&
        /google.com\/maps\/embed\/v1\/place/.test(el.src)
      ) {
        result = { type: 'map', src: el.src };
      }
      return result;
    }
  }
);
