(function($){
    $.fn.equalHeightRows = function(options){

        // Extend default settings with options
        var settings = $.extend({
            onInit: null, // Called on initialize (expects function)
            onResize: null, // Called on resize (expects function)
            itemSelector : '.item', // Class of item within the container selector,
            innerSelectors: null, // Comma seperated element selector for equal height within the items
        }, options);

        var _this = this;
        var _$this = $(_this);

        var output = {};

        /*
        *   Equal Height
        */
        var _setEqualHeight = function($element){
            var heighest = 0; // Counter

            // Reset height so we can calculate from base heigh
            $element.css({'height' : 'auto'});

            // Go through each item of current row and remember the heighest item
            $element.each(function(){
                var itemHeight = $(this).outerHeight();

                heighest = (itemHeight >= heighest) ? itemHeight : heighest;
            });

            // Set height of current row to the heighest found item
            $element.css({'height' : heighest + 'px'});
        }

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

            // Counters
            var previousRow = 0; // Remember previous row
            var currentRow = 1; // Remember current row
            var itemWidthCount = 0; // Item width counter untill reached row width
            var containerWidth = rowData.selector.width();

            /*
            *   Calculate rows
            */
            rowData.items.each(function(i, e){

                // Save last item in the row (gets overwritten each item untill reached last)
                rowData.rowsData['row' + currentRow] = {};
                rowData.rowsData['row' + currentRow].lastItem = (i+1);

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

                    previousRow = currentRow; // Set previous row
                    currentRow ++; // Increment row
                    itemWidthCount = 0; // Reset counter so we can start counting for the new row
                }
            });

            /*
            *   Calculate & set height for each required element
            */
            $.each(rowData.rowsData, function(n, e){

                // Find items for current row
                var $rowItems = rowData.items.filter(settings.itemSelector + ':nth-child(n+'+ e.firstItem +'):nth-child(-n+'+ e.lastItem +')');

                _setEqualHeight($rowItems); // Equal height for base row items

                // Optional inner selectors
                if(settings.innerSelectors != null){
                    var innerSelectors = settings.innerSelectors.split(',');

                    // Run equalHeight for every inner selector
                    $.each(innerSelectors, function(int, selector){
                        _setEqualHeight($rowItems.find(selector));
                        _setEqualHeight($rowItems);
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
        output.execute = function(iteration, selector){
            var data = {};

            // Check if parameter is given
            iteration = (iteration !== undefined) ? iteration : false;
            selector = (selector !== undefined) ? selector : false;

            // Re execute for every instance
            _$this.each(function(i, e){

                // Check if execute needs to run for this instance based on the number given
                if( ( iteration === false && selector === false) || ( iteration === i && (selector === false || $(e).is(selector) ) ) || ( selector !== false && $(e).is(selector) && ( iteration === false || iteration === i) ) ){
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
