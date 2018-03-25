(function($){
    $.fn.equalHeightRows = function(options){

        // Extend default settings with options
        var settings = $.extend({
            onInit: null, // Called on initialize (expects function)
            onResize: null, // Called on resize (expects function)
            itemSelector : '.item', // Class of item within the container selector,
            innerSelectors: null, // Comma seperated element selector for equal height within the items
            method: 'offset' // Which method to calculate rows options: offset, width
        }, options);

        var _this = this;

        // Run plugin for every found element
        this.each(function(instanceNumber, e){
            var base = this;
            var $selector = $(this);
            var $items = $selector.find(settings.itemSelector)

            /*
            *   Equal height rows
            */
            base.execute = function(){

                /*
                *   Calculate rows and save row details
                */

                // Initialize variables
                var containerWidth = $selector.width();
                var rows = {}; // keeping things clear
                rows.amount = $items.length;
                rows.rows = {}; // Save rows information
                rows.previousRow = 0; // Remember previous row
                rows.currentRow = 1; // Remember current row
                rows.itemWidthCount = 0; // Item width counter untill reached row width

                $items.each(function(i, e){

                    // Save last item in the row (gets overwritten each item untill reached last)
                    rows.rows['row' + rows.currentRow] = {};
                    rows.rows['row' + rows.currentRow].lastItem = (i+1);

                    // Check if the next item is on a different row
                    function checkNextRow(){
                        switch(settings.method){
                            case 'width':
                                var itemWidth = (Math.floor($(e).width() * 1 / 1));
                                var nextItemWidth = $selector.find(settings.itemSelector + ':nth-child(n+'+ (i + 2) +')').width();

                                // Add current itemWidth to the counter
                                rows.itemWidthCount = (rows.itemWidthCount + itemWidth);

                                return (rows.itemWidthCount >= containerWidth ||  (i + 1) >= rows.amount || Math.floor(rows.itemWidthCount + nextItemWidth) > containerWidth);
                            break;

                            default:
                                var itemOffset = $(e).offset().top;
                                var nextItemOffset = (rows.amount < (i + 2)) ? false : $items.filter(':nth-child('+ (i + 2) +')').offset().top;

                                return (itemOffset != nextItemOffset);
                            break;
                        }
                    }

                    if(checkNextRow()){
                        // Calculate first row item
                        var rowItemDifference = (rows.previousRow == 0) ? rows.rows['row' + rows.currentRow].lastItem : (rows.rows['row' + rows.currentRow].lastItem - rows.rows['row' + rows.previousRow].lastItem);
                        var firstRowItem = ((rows.rows['row' + rows.currentRow].lastItem - rowItemDifference) + 1);
                        rows.rows['row' + rows.currentRow].firstItem = firstRowItem; // Set first row item for current row

                        rows.previousRow = rows.currentRow; // Set previous row
                        rows.currentRow ++; // Increment row
                        rows.itemWidthCount = 0; // Reset counter so we can start counting for the new row
                    }
                });

                /*
                *   Equal Height
                */
                var equalHeight = function($element){
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
                *   Calculate & set height for each required element
                */
                $.each(rows.rows, function(n, e){
                    // Find items for current row
                    var $rowItems = $selector.find(settings.itemSelector + ':nth-child(n+'+ e.firstItem +'):nth-child(-n+'+ e.lastItem +')');
                    equalHeight($rowItems); // Equal height for base row items

                    // Optional inner selectors
                    if(settings.innerSelectors != null){
                        var innerSelectors = settings.innerSelectors.split(',');

                        // Run equalHeight for every inner selector
                        $.each(innerSelectors, function(int, selector){
                            equalHeight($rowItems.find(selector));
                            equalHeight($rowItems);
                        });
                    }
                });
            };

            $(window).on('resize', function(){
                base.execute();

                if ( $.isFunction( settings.onResize ) ) {
                    settings.onResize( base );
                }
            });

            base.Initialize = function(){
                base.execute();

                if ( $.isFunction( settings.onInit ) ) {
                    settings.onInit( base );
                }
            };

            base.Initialize();
        });
    };
}(jQuery));
