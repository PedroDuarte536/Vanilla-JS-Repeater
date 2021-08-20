/**
 * Class for the core Repeater
 * 
 * @class
 */
const Repeater = function (repeaterId) {
  // HTML Elements
  let repeaterElement, lineNode;

  // The repeater object
  let repeater = null;

  // Control line removal
  let removeLineWrapper = (removeFn, line, lineId) => removeFn();
  let removeLineUserCall = (id) => removeLineWrapper(() => removeLine(id), getLine(id), id)

  // Control line append
  let addLineWrapper = (appendFn) => appendFn();
  let addLineUserCall = (data = null) => addLineWrapper(() => addLine(data))

  /**
   * Returns the element to be repeated with the necessary modifications 
   * @returns {HTMLElement}
   */
  let importLineNode = function () {
    let children = repeaterElement.children;
    if (children.length == 0) return null;
    
    var node = children[0].cloneNode(true);
    node.setAttribute('repeater-line', "");
    node.querySelectorAll('[name]').forEach(function (input) {
        var name = input.getAttribute('name');
        input.setAttribute('repeater-input', name);
    });
    return node;
  }

  /**
   * Returns the requested line or the last line if id is null
   * @param {number | null} id 
   * @returns {HTMLElement | null}
   */
  let getLine = function (id=null) {
    var selector = id == null ? ':last-child' : ':nth-child(' + (id+1) + ')';
    return repeaterElement.querySelector('[repeater-line]' + selector);
  }

  /**
   * Fills inputs with data
   * @param {object} data 
   * @param {number | null} id 
   */
  let fillLine = function (data, id=null) {
    let line = getLine(id);
    Object.entries(data).forEach(item => line.querySelectorAll(`[repeater-input="${item[0]}"]`).forEach(input => input.value = item[1]))
  }

  /**
   * Number of active lines in the repeater
   * @returns {number}
   */
  let getLength = function () {
    return repeaterElement.querySelectorAll('[repeater-line]').length
  }

  /**
   * Formats input name attributes
   * @param {number} startLineIdx 
   */
  let refreshInputNames = function (startLineIdx = 0) {
    let lines = repeaterElement.children;

    for (let i = startLineIdx; i < lines.length; i++)
      lines[i].querySelectorAll('[repeater-input]').forEach(
        input => input.setAttribute('name', `${repeaterElement.id}[${lines.length-1}][${input.getAttribute('repeater-input')}]`)
      );
  }

  /**
   * Appends one line to the repeater
   * @returns {HTMLElement}
   */
  let addLine = function (data = null) {
    let node = lineNode.cloneNode(true);
    repeaterElement.appendChild(node);
    let lineIdx = repeaterElement.children.length - 1;

    node.querySelectorAll('[repeater-remove]').forEach(function (btn) { 
      btn.addEventListener('click', function () {
        removeLineUserCall(Array.prototype.indexOf.call(repeaterElement.children, node))
      });
    });

    if (data != null) fillLine(data)
    refreshInputNames(lineIdx)

    repeaterElement.dispatchEvent(new CustomEvent('onLineAppend', { detail: { index: lineIdx, line: node } }))

    return node;
  }

  /**
   * Removes a specific line
   * @param {number} id 
   * @returns {boolean}
   */
  let removeLine = function (id = null) {
    let line = getLine(id);
    if (line != null) {
      line.remove();
      refreshInputNames(id != null? id: getLength() - 1)

      repeaterElement.dispatchEvent(new CustomEvent('onLineRemove', { detail: { index: id } }))
    }
    return line != null;
  }

  /**
   * Setter for the removeLine Wrapper
   * @param {CallableFunction} wrapper 
   * @returns {Repeater}
   */
  let setRemoveLineWrapper = function (wrapper) {
    removeLineWrapper = wrapper;
    return repeater;
  }

  /**
   * Setter for the addLine wrapper
   * @param {CallableFunction} wrapper 
   * @returns {Repeater}
   */
  let setAddLineWrapper = function (wrapper) {
    addLineWrapper = wrapper;
    return repeater;
  }
  
  /**
   * Creates a Repeater object
   * @constructor
   */
  let constructor = function () {
    repeaterElement = document.getElementById(repeaterId);
    if (repeaterElement == null) return null
    lineNode = importLineNode();
    repeaterElement.innerHTML = ''

    let addLineBtns = [ 
      ...document.querySelectorAll('[repeater-add=""]'), 
      ...document.querySelectorAll(`[repeater-add="${repeaterId}"]`) 
    ]
    addLineBtns.forEach(elem => elem.addEventListener('click', () => addLineUserCall(), false))

    repeater = {
      addLine: addLineUserCall,
      removeLine: removeLineUserCall,
      setRemoveLineWrapper,
      setAddLineWrapper,
      getLength,
      fillLine
    }

    return repeater;
  }

  return constructor()
}
