
import $ from './mini-jquery';

const TYPES = [{
  id: 'off-canvas',
  typeQuery: '[data-off-canvas]',
  self: {
    active:   { 'class': 'is-open',   attrs: { 'aria-hidden': 'false' } },
    inactive: { 'class': 'is-closed', attrs: { 'aria-hidden': 'true' } },
  },
  create: {
    siblings: [{
      tag: 'div',
      triggerable: true,
      original: { 'class': ['js-off-canvas-overlay', 'is-overlay-fixed'], attrs: { 'data-by': 'herson' } },
      active: { 'class': ['is-visible', 'is-closable'] },
      inactive: {}
    }]
  },
  other: [{
    query: '[data-off-canvas-content]',
    active: { 'class': 'has-transition-push' },
    inactive: {},
  }],
  variations: [{
    variationQuery: '[data-position=left]',
    other: [{
      query: '[data-off-canvas-content]',
      active: { 'class': ['has-position-left', 'is-open-left'] },
      inactive: {},
    }]
  }],
  
}]

const secretProps = '__secret_props__';

function init(parent) {
  // search for all controls
  initiateControls(parent);
}


function initiateControls(parent) {
  let $controls = $.find('[data-open]', parent);

  $controls.forEach(function (trigger) {
    let targetId = trigger.getAttribute('data-open');
    let target = $.id(targetId);
    setup(trigger, target);
  });

}

function setup(trigger, control) {
  let type = guessType(control);
  let typeId = type.id;

  let instructionList = getInstructionList(control, type);

  // TODO: guess initial state
  let state = setInitialState(control, typeId, { active: false });

  trigger.addEventListener('click', function () {
    state.active = !state.active;
    setActive(instructionList, state.active);
  });

  // add event to all triggerables
  instructionList.forEach(obj => {
    let { element, instructions } = obj;

    if (instructions.triggerable) {
      element.addEventListener('click', function () {
        state.active = !state.active;
        setActive(instructionList, state.active);
      });
    }
  })

}

function setActive(instructionList, active) {
  instructionList.forEach(obj => {
    let { element, instructions } = obj;

    if (active) {
      removeProperties(element, instructions.inactive);
      addProperties(element, instructions.active);
    } else {
      removeProperties(element, instructions.active);
      addProperties(element, instructions.inactive);
    }
  })
}

function setInitialState(control, type, state) {
  control[secretProps] = control[secretProps] || {};
  control[secretProps][type] = control[secretProps][type] || {};
  control[secretProps][type].active = state.active;

  return control[secretProps][type];
}

function guessType(target) {
  let conf;

  TYPES.forEach((type) => {
    let query = type.typeQuery;
    if ($.is(target, query)) {
      conf = type;
      return -1;
    }
  });

  return conf;
}

function getInstructionList(control, tree) {
  let relatedElements = [];

  // self element
  if (tree.self) {
    relatedElements.push({
      element: control,
      instructions: tree.self
    });
  }

  // new elements created at start
  if (tree.create) {
    if (tree.create.siblings) {
      let siblings = createSiblings(control, tree.create.siblings);
      relatedElements = [...relatedElements, ...siblings];
    }
  }

  // other elements that are not necessarily children of the control
  if (tree.other) {
    let found = searchElements(tree.other);
    relatedElements = [...relatedElements, ...found];
  }

  // variations are conditional instructions when the variationQuery
  // matches against the original control
  if (tree.variations) {
    tree.variations.forEach(variation => {
      let variatonMatches = $.is(control, variation.variationQuery);
      if (variatonMatches) {
        let variationElements = getInstructionList(control, variation);
        relatedElements = [...relatedElements, ...variationElements];
      }
    });
  }

  return relatedElements;
}

function createSiblings(control, siblings) {
  let created = [];
  // these are created in reverse because that way all can be added with 
  // the `insertAdjacentHTML` function of the original element
  siblings.reverse().forEach(obj => {
    let element = createElement(obj);
    let html = element.outerHTML;
    control.insertAdjacentHTML('afterend', html);
    // updating the pointer to the element
    element = control.nextElementSibling;
    created.unshift({ element, instructions: obj });
  });

  return created;
}

function createElement(obj) {
  let element = document.createElement(obj.tag);
  addProperties(element, obj.original);
  return element;
}

function searchElements(elements, control) {
  let found = [];
  elements.forEach(obj => {
    let element = $.findOne(obj.query, control);
    found.push({ element, instructions: obj })
  })

  return found;
}

function addProperties(element, properties) {
  if (!properties) return;

  let classes = properties['class'];
  let attrs = properties['attrs'];

  // classes
  if (classes) {
    if (Array.isArray(classes)) {
      classes.forEach(className => {
        addClass(element, className);
      })
    } else {
      addClass(element, classes);
    }
  }

  // other attributes
  if (attrs) {
    Object.entries(attrs).forEach(pair => {
      let [key, value] = pair;
      element.setAttribute(key, value);
    })
  }
}

function removeProperties(element, properties) {
  if (!properties) return;

  let classes = properties['class'];
  let attrs = properties['attrs'];

  // classes
  if (classes) {
    if (Array.isArray(classes)) {
      classes.forEach(className => {
        removeClass(element, className);
      })
    } else {
      removeClass(element, classes);
    }
  }

  // other attributes
  if (attrs) {
    Object.entries(attrs).forEach(pair => {
      let [key, value] = pair;
      element.removeAttribute(key);
    })
  }
}

function addClass(element, className) {
  element.classList.add(className);
}

function removeClass(element, className) {
  element.classList.remove(className);
}

export default { init };
