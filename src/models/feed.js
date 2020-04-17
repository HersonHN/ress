import FeedService from '@/services/feed';

const EMPTY = 'EMPTY';
const VALID = 'VALID';
const INVALID = 'INVALID';
const VALIDATING = 'VALIDATING';
const NOTYET = 'NOTYET';


export default class Feed {
  constructor({ title, icon, url } = {}) {
    this.title = title || '';
    this.icon = icon || '';
    this.url = url || '';

    this.validations = {
      title: NOTYET,
      icon: NOTYET,
      url: NOTYET,
    };
  }

  isValid() {
    return (
      this.validations.title == VALID &&
      this.validations.url == VALID &&
      this.validations.icon == VALID
    );
  }

  isEmpty() {
    return (!this.title && !this.icon && !this.url);
  }

  markAsValid() {
    this.validations.title = VALID;
    this.validations.icon = VALID;
    this.validations.url = VALID;
  }

  validateAll() {
    this.validate('title');
    this.validate('icon');
    this.validateRSS();
  }

  validate(prop) {
    if (prop === 'url') {
      return this.validateRSS();
    }

    let isEmpty = !this[prop];
    this.validations[prop] = isEmpty ? EMPTY : VALID;

    return Promise.resolve(this.validations);
  }

  validateRSS() {
    let url = this.url;

    if (!url) {
      this.validations.url = EMPTY;
      return Promise.resolve(this.validations);
    }
    this.validations.url = VALIDATING;

    return FeedService.validateRSS(url)
      .then(response => {
        this.validations.url = response.ok ? VALID : INVALID;
        return Promise.resolve(this.validations);
      })
      .catch(console.error);
  }

  toOBJ() {
    let isValid = this.isValid();

    return {
      title: this.title,
      url: this.url,
      icon: this.icon,
      valid: isValid,
      invalid: !isValid
    };
  }

  toJSON() {
    return this.toOBJ();
  }
}