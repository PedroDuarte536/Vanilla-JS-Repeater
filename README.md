## **Vanilla JS Repeater**

 1. Initialization
 2. HTML Attributes
 3. Functions

**Initialization**

Example:

    <div id="age_repeater">
	    <div  class="row">
		    <input  type="number"  name="age">
		    <button  type="button"  repeater-remove>Delete</button>
		</div>
	</div>
	<button  type="button"  repeater-add>New Line</button>  

    <script  src="../dist/repeater.min.js"></script>
    <script>  
	    let  r = Repeater("age_repeater");
    </script>

After initializing the repeater will start empty.
Before a line is appended the name tags inside the content are transformed to `*repeater_id*[*line_index*][*old_name_value*]`. When a line is deleted the name attributes are refreshed.

**HTML Attributes**
| Attribute | Result |
|--|--|
| repeater-add | If the attribute has a value, clicking on the respective element will add a line to the corresponding repeater (using the **id**), else clicking it will add a line to every repeater on the page |
| repeater-remove | An element with this attribute needs to be inside of the repeater line, clicking on it will delete the line. The value is ignored. |

**Functions**

*addLine(data = null)*
Appends a line with the repeater. An argument can be passed to set initial input attributes. It should be an object with the keys being the input's initial name tag and the value the new input value.
An **onLineAppend** event will be dispatched on the repeater element. The event will have a detail object with two keys - **index**, the new line index, and **line**, the new line HTMLElement.

*removeLine(id = null)*
Removes a specific line (by index) or removes the last line if no **id** is specified.
An **onLineRemove** event will be dispatched on the repeater element. The event will have a detail object with one keys - **index**, the index of the line deleted.

*setRemoveLineWrapper(wrapper)*
Sets a remove line wrapper function. **wrapper** should be a function that will be called with three arguments: 
 - removeFn - The removeLine function to be called when and if the line should be deleted. This function does not need any argument and will return a boolean representing operation status
 - line - The line that will be deleted (HTMLElement)
 - lineId - The index of the line to be deleted

*setAddLineWrapper(wrapper)*
Sets a add line wrapper function. **wrapper** should be a function that will be called with one arguments: 
 - appendFn - The addLine function to be called when and if the line should be appended. This function does not need any argument and will return the line's HTMLElement

*getLength()*
Returns the number of lines in the repeater

*fillLine(data, id=null)*
Sets the values of a line, the **data** argument works like in the **addLine** function above, the **id** can be a specific line index or can be ignored (changes will be applied to the last line)
