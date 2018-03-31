(function($){
    $.fn.equalHeightRows = function(options){

        // Extend default settings with options
        var settings = $.extend({
            onInit: null, // Called on initialize (expects function)
            onResize: null, // Called on resize (expects function)
            itemSelector : '.item', // Class of item within the container selector,
            innerSelectors: null, // Comma seperated element selector for equal height within the items
            wrapRows: false // Classname to wrap rows in

        }, options);

        var _this = this;
        var _$this = $(_this);

        var output = {}; // Return object for plugin

        /*
        *   Equal Height
        */
        var _setEqualHeight = function($items){
            var heighest = 0; // Counter

            // Reset height so we can calculate from base heigh
            $items.css({'height' : 'auto'});

            // Go through each item of current row and remember the heighest item if there's more than one item for peformance
            if($items.length > 1){
                $items.each(function(){
                    var itemHeight = $(this).outerHeight();

                    heighest = (itemHeight >= heighest) ? itemHeight : heighest;
                });

                // Set height of current row to the heighest found item
                $items.css({'height' : heighest + 'px'});
            }
        };

        /*
        *   Run calculate rows and set equalHeight
        */
        var _execute = function(element){
            // Build row data
            var rowData = {};
            rowData.selector = $(element);
            rowData.items = rowData.selector.find(settings.itemSelector);
            rowData.itemAmount = rowData.items.length; // Amount of items
            rowData.rowsData = {}; // Save rows information
            rowData.rowsItems = {}; // Save doms

            // Counters
            var previousRow = 0; // Remember previous row
            var currentRow = 1; // Remember current row
            var itemWidthCount = 0; // Item width counter untill reached row width
            var containerWidth = rowData.selector.width();

            // Remove the rows wrap so we can calculate new rows
            if(settings.wrapRows){
                $(rowData.selector).find('[data-type="row"]').contents().unwrap();
            }

            /*
            *   Calculate rows
            */
            rowData.items.each(function(i, e){

                // Save last item in the row (gets overwritten each item untill reached last)
                rowData.rowsData['row' + currentRow] = { lastItem : (i + 1) };

                // Check if the next item is on a different row
                var checkNextRow = function(){
                    var itemWidth = parseFloat( $(e).css('width') );
                    var nextItemWidth =  parseFloat( rowData.selector.find(settings.itemSelector + ':nth-child('+ (i + 2) +')').css('width') );

                    // Add current itemWidth to the counter
                    itemWidthCount = (itemWidthCount + itemWidth);

                    return (itemWidthCount >= containerWidth ||  (i + 1) >= rowData.itemAmount || Math.floor(itemWidthCount + nextItemWidth) > containerWidth);
                };

                if(checkNextRow()){
                    // Calculate first row item
                    var rowItemDifference = (previousRow == 0) ? rowData.rowsData['row' + currentRow].lastItem : (rowData.rowsData['row' + currentRow].lastItem - rowData.rowsData['row' + previousRow].lastItem);
                    var firstRowItem = ((rowData.rowsData['row' + currentRow].lastItem - rowItemDifference) + 1);
                    rowData.rowsData['row' + currentRow].firstItem = firstRowItem; // Set first row item for current row

                    // Find items belonging to current row and save doms as current row
                    rowData.rowsItems['row' + currentRow] = rowData.items.filter(settings.itemSelector + ':nth-child(n+'+ firstRowItem +'):nth-child(-n+'+ rowData.rowsData['row' + currentRow].lastItem +')'); // Set first row item for current row

                    previousRow = currentRow; // Set previous row
                    currentRow ++; // Increment row
                    itemWidthCount = 0; // Reset counter so we can start counting for the new row
                }
            });

            /*
            *   Calculate & set height for each required element
            */

            $.each(rowData.rowsItems, function(i, items){
                _setEqualHeight(items); // Equal height for base row items

                // Wrap items in rows
                if(settings.wrapRows){
                    items.wrapAll('<div class="'+ settings.wrapRows +' '+ i + '" data-type="row"></div>')
                }

                // Optional inner selectors
                if(settings.innerSelectors != null){
                    var innerSelectors = settings.innerSelectors.split(',');

                    // Run equalHeight for every inner selector
                    $.each(innerSelectors, function(int, selector){
                        _setEqualHeight(items.find(selector));
                        _setEqualHeight(items);
                    });
                }
            });

            return rowData;
        };

        /*
        *   Outside callable function: execute()
        *   Parameters:
        *   iteration = which iteration to run
        */
        output.execute = function(selector){
            var data = {};

            selector = (selector !== undefined) ? selector : false;

            // Run _execute() for every element seperate
            _$this.each(function(i, e){

                // Check if execute needs to run for this instance based on the number given
                if( selector === false || ( selector !== false && $(e).is(selector) ) ){
                    data[i] = _execute($(e));
                }
            });

            return data;
        };

        /*
            Run plugin for every found element
        */
        this.each(function(instanceNumber, instanceElement){
            var base = instanceElement;
            var instance = { data : {}};

            $(window).on('resize', function(){
                _execute(instanceElement);

                if ( $.isFunction( settings.onResize ) ) {
                    settings.onResize( instance );
                }
            });

            instance.Initialize = function(){
                instance.data = _execute(instanceElement);

                if ( $.isFunction( settings.onInit ) ) {
                    settings.onInit( instance );
                }
            };

            instance.Initialize();
        });

        return output;
    };
}(jQuery));
