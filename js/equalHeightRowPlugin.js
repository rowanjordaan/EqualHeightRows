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

        var output = {};

        output.helloWorld = function(){
            console.log('Hi');

            return true;
        }

        // Run plugin for every found element
        this.each(function(instanceNumber, e){
            var base = e;
            var instance = {};
            instance.selector = $(e);
            instance.items = instance.selector.find(settings.itemSelector);

            /*
            *   Equal height rows
            */
            instance.execute = function(){
                /*
                *   Calculate rows and save row details
                */

                // Initialize variables
                var containerWidth = instance.selector.width();
                instance.rowsitemAmount = instance.items.length;
                instance.rowsData = {}; // Save rows information
                instance.rowspreviousRow = 0; // Remember previous row
                instance.rowscurrentRow = 1; // Remember current row
                instance.rowsitemWidthCount = 0; // Item width counter untill reached row width

                instance.items.each(function(i, e){

                    // Save last item in the row (gets overwritten each item untill reached last)
                    instance.rowsData['row' + instance.rowscurrentRow] = {};
                    instance.rowsData['row' + instance.rowscurrentRow].lastItem = (i+1);

                    // Check if the next item is on a different row
                    function checkNextRow(){
                        var itemWidth = parseFloat( $(e).css('width') );
                        var nextItemWidth =  parseFloat( instance.selector.find(settings.itemSelector + ':nth-child('+ (i + 2) +')').css('width') );

                        // Add current itemWidth to the counter
                        instance.rowsitemWidthCount = (instance.rowsitemWidthCount + itemWidth);

                        return (instance.rowsitemWidthCount >= containerWidth ||  (i + 1) >= instance.rowsitemAmount || Math.floor(instance.rowsitemWidthCount + nextItemWidth) > containerWidth);
                    }

                    if(checkNextRow()){
                        // Calculate first row item
                        var rowItemDifference = (instance.rowspreviousRow == 0) ? instance.rowsData['row' + instance.rowscurrentRow].lastItem : (instance.rowsData['row' + instance.rowscurrentRow].lastItem - instance.rowsData['row' + instance.rowspreviousRow].lastItem);
                        var firstRowItem = ((instance.rowsData['row' + instance.rowscurrentRow].lastItem - rowItemDifference) + 1);
                        instance.rowsData['row' + instance.rowscurrentRow].firstItem = firstRowItem; // Set first row item for current row

                        instance.rowspreviousRow = instance.rowscurrentRow; // Set previous row
                        instance.rowscurrentRow ++; // Increment row
                        instance.rowsitemWidthCount = 0; // Reset counter so we can start counting for the new row
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
                $.each(instance.rowsData, function(n, e){
                    // Find items for current row
                    var $rowItems = instance.items.filter(settings.itemSelector + ':nth-child(n+'+ e.firstItem +'):nth-child(-n+'+ e.lastItem +')');

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

                return instance;
            };

            $(window).on('resize', function(){
                instance.execute();

                if ( $.isFunction( settings.onResize ) ) {
                    settings.onResize( instance );
                }
            });

            instance.Initialize = function(){
                instance.execute();

                if ( $.isFunction( settings.onInit ) ) {
                    settings.onInit( instance );
                }
            };

            instance.Initialize();
        });

        return output;
    };
}(jQuery));
