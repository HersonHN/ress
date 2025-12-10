import FeedService from '@/services/feed';

enum Validity {
  EMPTY = 'EMPTY',
  VALID = 'VALID',
  INVALID = 'INVALID',
  VALIDATING = 'VALIDATING',
  NOTYET = 'NOTYET',
}

export default class Feed {
  title: string;
  icon: string;
  url: string;

  validations: {
    title: Validity;
    icon: Validity;
    url: Validity;
  };

  constructor(props: { title?: string; icon?: string; url?: string } = {}) {
    const { title, icon, url } = props;
    this.title = title || '';
    this.icon = icon || '';
    this.url = url || '';

    this.validations = {
      title: Validity.NOTYET,
      icon: Validity.NOTYET,
      url: Validity.NOTYET,
    };
  }

  isValid() {
    return (
      this.validations.title == Validity.VALID &&
      this.validations.url == Validity.VALID &&
      this.validations.icon == Validity.VALID
    );
  }

  isEmpty() {
    return !this.title && !this.icon && !this.url;
  }

  markAsValid() {
    this.validations.title = Validity.VALID;
    this.validations.icon = Validity.VALID;
    this.validations.url = Validity.VALID;
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
    this.validations[prop] = isEmpty ? Validity.EMPTY : Validity.VALID;

    return Promise.resolve(this.validations);
  }

  validateRSS() {
    let url = this.url;

    if (!url) {
      this.validations.url = Validity.EMPTY;
      return Promise.resolve(this.validations);
    }
    this.validations.url = Validity.VALIDATING;

    return FeedService.validateRSS(url)
      .then((response) => {
        this.validations.url = response.ok ? Validity.VALID : Validity.INVALID;
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
      invalid: !isValid,
    };
  }

  toJSON() {
    return this.toOBJ();
  }
}
