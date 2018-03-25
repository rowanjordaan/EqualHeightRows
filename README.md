# EqualHeightRows

Based on how much items fit on one row the script calculates which items belong to which row. The script will equalHeight all items based on which row they belong to. 

Using the innerSelectors option it's also possible to equalHeight elements within each item. With the innerSelectors option you can for example equalHeight all item titles per row. See [simple-example.html](example/simple-example.html)

## Usage

*Javascript:*
```javascript
$(document).ready(function(){
    $('#items').equalHeightRows();
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

| Option | Default value | Description |
| --- | --- | --- |
| onInit | null | (function) Callback function run on initialization |
| onResize | null | (function) Callback on resize |
| itemSelector | .item | (string) Element that acts as Item Selector |
| innerSelectors | null | (string) Elements within the itemSelector to equalHeight aswell. Comma seperated. (example: '.title, .text') will give all the .title divs on the same row the same height and all the .text divs on the same row the same height |
