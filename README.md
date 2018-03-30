# EqualHeightRows

Based on how much items fit on one row the script calculates which items belong to which row. The script will equalHeight all items based on which row they belong to.

Using the innerSelectors option it's also possible to equalHeight elements within each item. With the innerSelectors option you can for example equalHeight all item titles per row. See [simple-example.html](example/simple-example.html)

*Live Examples:*

https://rowanjordaan.nl/equalHeightPlugin/example/simple-example.html
https://rowanjordaan.nl/equalHeightPlugin/example/example.html

## Usage

*Javascript:*
```javascript
$(document).ready(function(){
    $('#items').equalHeightRows( options );
});
```

*Example html:*
```html
<div id="items" style="clear: both; overflow: hidden;">
    <div class="item" style="background: #111; float: left; width: 50%;">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin laoreet, felis in tincidunt iaculis, purus justo rhoncus nisi, id aliquet.</p>
    </div>
    <div class="item" style="background: #222; float: left; width: 50%;">
        <p>Proin laoreet, felis in tincidunt iaculis, purus justo rhoncus nisi, id aliquet.</p>
    </div>
    
    <div class="item" style="background: #222; float: left; width: 33.3%;">
        <p>Proin laoreet, felis in tincidunt iaculis, purus justo rhoncus nisi, id aliquet.</p>
    </div>
    
    <div class="item" style="background: #33; float: left; width: 33.3%;">
        <p>Proin laoreet, felis in tincidunt iaculis, purus justo rhoncus nisi, id aliquet.</p>
    </div>
    
    <div class="item" style="background: #44; float: left; width: 33.3%;">
        <p>Proin laoreet, felis in tincidunt iaculis, purus justo rhoncus nisi, id aliquet.</p>
    </div>
</div>
```

*Include to your website:*
```html
<html>
    <body>
        ... your code ...

        <script src="equalHeightRowPlugin.min.js" type="text/javascript"></script>

        <script type="text/javascript">
            $('#example').equalHeightRows();
        </script>
    </body>
</html>
```

## Options

| Option | Default value | Type | Description |
| --- | --- | --- | --- |
| onInit | null | function | Callback function run on initialization |
| onResize | null | function | Callback on resize |
| itemSelector | .item | string |Element that acts as Item Selector |
| innerSelectors | null | string | Elements within the itemSelector to equalHeight aswell. Comma seperated. (example: '.title, .text') will give all the .title divs on the same row the same height and all the .text divs on the same row the same height |

## Callable functions

### execute(iteration, selector)

<table>
    <tr>
        <th>Parameter</th>
        <th>Default value</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    
    <tr>
        <td>Iteration</td>
        <td>false</td>
        <td>int</td>
        <td>Which iteration of found elements to run. execute(1) executes only for the second found element</td>
    </tr>
    
    <tr>
        <td>Selector</td>
        <td>false</td>
        <td>dom selector</td>
        <td>Checks for example if the instance has a class or id</td>
    </tr>
    
    <tr>
        <td>**Return**</td>
        <td colspan="3">test</td>
    </tr>
</table>
    
    

| Parameter | Default value | Type | Description |
| --- | --- | --- | --- |
| Iteration | false | int | Which iteration of found elements to run. execute(1) executes only for the second found element |
| Selector | false | dom selector | Checks for example if the instance has a class or id |
| **Return** | test test test test test |

**Example recalculate rows using selector.execute()**
```javascript
$(document).ready(function(){
    var items = $('#items').equalHeightRows();
    
    $('#mybutton').on('click', function(){
        $('#items > .item:nth-child(1)').append('<p>Proin laoreet, felis in tincidunt iaculis, purus justo rhoncus nisi, id aliquet.</p>');
        items.execute(); // Will recalculate rows
    });
});
```

## Requirements
- jQuery
