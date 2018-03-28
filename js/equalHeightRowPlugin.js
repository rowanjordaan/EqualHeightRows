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

        _execute = function(element){
            /*
            *   Calculate rows and save row details
            */

            $selector = $(element);
            $items = $selector.find(settings.itemSelector);

            // Initialize variables
            var containerWidth = $selector.width();
            var rowData = {};
            rowData.itemAmount = $items.length; // Amount of items
            rowData.rowsData = {}; // Save rows information
            rowData.rowspreviousRow = 0; // Remember previous row
            rowData.rowscurrentRow = 1; // Remember current row
            rowData.rowsitemWidthCount = 0; // Item width counter untill reached row width

            $items.each(function(i, e){

                // Save last item in the row (gets overwritten each item untill reached last)
                rowData.rowsData['row' + rowData.rowscurrentRow] = {};
                rowData.rowsData['row' + rowData.rowscurrentRow].lastItem = (i+1);

                // Check if the next item is on a different row
                function checkNextRow(){
                    var itemWidth = parseFloat( $(e).css('width') );
                    var nextItemWidth =  parseFloat( $selector.find(settings.itemSelector + ':nth-child('+ (i + 2) +')').css('width') );

                    // Add current itemWidth to the counter
                    rowData.rowsitemWidthCount = (rowData.rowsitemWidthCount + itemWidth);

                    return (rowData.rowsitemWidthCount >= containerWidth ||  (i + 1) >= rowData.itemAmount || Math.floor(rowData.rowsitemWidthCount + nextItemWidth) > containerWidth);
                }

                if(checkNextRow()){
                    // Calculate first row item

                    var rowItemDifference = (rowData.rowspreviousRow == 0) ? rowData.rowsData['row' + rowData.rowscurrentRow].lastItem : (rowData.rowsData['row' + rowData.rowscurrentRow].lastItem - rowData.rowsData['row' + rowData.rowspreviousRow].lastItem);

                    var firstRowItem = ((rowData.rowsData['row' + rowData.rowscurrentRow].lastItem - rowItemDifference) + 1);
                    rowData.rowsData['row' + rowData.rowscurrentRow].firstItem = firstRowItem; // Set first row item for current row

                    rowData.rowspreviousRow = rowData.rowscurrentRow; // Set previous row
                    rowData.rowscurrentRow ++; // Increment row
                    rowData.rowsitemWidthCount = 0; // Reset counter so we can start counting for the new row
                }
            });

            /*
            *   Calculate & set height for each required element
            */
            $.each(rowData.rowsData, function(n, e){

                // Find items for current row
                var $rowItems = $items.filter(settings.itemSelector + ':nth-child(n+'+ e.firstItem +'):nth-child(-n+'+ e.lastItem +')');

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

        output.execute = function(){
            var data = {};

            // Re execute for every instance
            _$this.each(function(i, e){
                data[i] = _execute($(e));
            });

            return data;
        };

        /*
            Run plugin for every found element
        */
        this.each(function(instanceNumber, instanceElement){
            var base = instanceElement;
            var instance = {};
            instance.selector = $(instanceElement);
            instance.items = instance.selector.find(settings.itemSelector);

            $(window).on('resize', function(){
                _execute(instanceElement);

                if ( $.isFunction( settings.onResize ) ) {
                    settings.onResize( instance );
                }
            });

            instance.Initialize = function(){
                _execute(instanceElement);

                if ( $.isFunction( settings.onInit ) ) {
                    settings.onInit( instance );
                }
            };

            instance.Initialize();
        });

        return output;
    };
}(jQuery));
