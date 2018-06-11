/* equalHeightRows */
(function($){
    $.fn.equalHeightRows = function(options){
        var _this = this;
        var _$this = $(_this);

        var output = { settings : {} }; // Return object for plugin

        // Extend default settings with options
        output.settings = $.extend({
            onInit: null, // Called on initialize (expects function)
            onResize: null, // Called on resize (expects function)
            itemSelector : '.item', // Class of item within the container selector,
            innerSelectors: null, // Comma seperated element selector for equal height within the items
            wrapRows: false, // Classname to wrap rows in
            resizeTimeout: 150, // Run every 150ms
            bindOnResize: true, // Wheter to bind the on resize event on init
            reinitImage: 'all', // Reinitialize when images are loaded ("false" wont't run at all, "all" runs when "all" images are loaded, individual runs at every loaded image)
        }, options);

        var settings = output.settings;

        /*
        *   Equal Height function
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
        var _execute = function(element, callback){
            /* save current container size */
            $(element).attr('data-lastcall', parseFloat($(element).css('width')));

            /* Initialize variables */
            var result = {};

            // Constant vars
            result.selector = $(element);
            result.items = result.selector.find(settings.itemSelector);
            result.itemAmount = result.items.length; // Amount of items

            // Row data vars
            result.rowsDom = []; //* Save rows dom data
            result.rowsHeight = []; //* Save rows height data

            // Counter vars
            var currentRow = 1; // Current row iterator
            var itemWidthCount = 0; // Item width counter untill reached row width
            var containerWidth = parseFloat(result.selector.css('width'));
            var rowWidthCounter = 0; //* Counter to check wheter the rows fit in the container

            /* Remove the rows wrap so we can calculate new rows */
            if(settings.wrapRows || $(result.selector).find('[data-type="row"]:nth-child(1)').length > 0){
                $(result.selector).find('[data-type="row"]').contents().unwrap();
            }

            $(result.items).css('height', 'auto'); // Reset height so we can calculate new height

            /* Creating empty row data for the first row */
            result.rowsDom['row' + currentRow] = []; // Create first new row in rowsData
            result.rowsHeight['row' + currentRow] = 0; // Init current row height as 0

            result.items.each(function(i, e){
                // Add the width of the current item to the rowWidthCounter
                rowWidthCounter = parseFloat(rowWidthCounter + parseFloat($(e).css('width')));

                /*
                    If the current rowWidthCounter is higher then the size of the container it means the current item is on a new row
                */
                if(rowWidthCounter > containerWidth){
                    /*
                        Start new row
                    */
                    currentRow++; // increase row number
                    rowWidthCounter = parseFloat($(e).css('width')); // Reset rowWidthCounter to rowWidth at this moment

                    /* Creating empty row data for the current (new) row */
                    result.rowsDom['row' + currentRow] = [];
                    result.rowsHeight['row' + currentRow] = 0; // Init current row height as 0
                }

                // Add current item to current row
                result.rowsDom['row' + currentRow].push(e);

                /*
                    check if next item is on a next row, if so run equalHeight for the items on this row
                */
                if(parseInt(i+1) >= result.itemAmount || parseFloat(rowWidthCounter + parseFloat($(e).next().css('width'))) > containerWidth){
                    var $currentRowItems = $(result.rowsDom['row' + currentRow]);

                    // Optional inner selectors
                    if(settings.innerSelectors != null){
                        var innerSelectors = settings.innerSelectors.split(',');

                        // Run equalHeight for every inner selector
                        $.each(innerSelectors, function(int, selector){
                            _setEqualHeight($currentRowItems.find(selector));
                        });
                    }

                    $currentRowItems.each(function(i, e){
                        result.rowsHeight['row' + currentRow] = (parseFloat($(e).css('height')) > result.rowsHeight['row' + currentRow]) ? parseFloat($(e).css('height')) : result.rowsHeight['row' + currentRow];
                    });

                    // set heigt of row items
                    $currentRowItems.css('height', result.rowsHeight['row' + currentRow] + 'px');

                    /* if wrap rows is enabled wrap rows in row div */
                    if(settings.wrapRows){
                        $currentRowItems.wrapAll('<div class="'+ settings.wrapRows +' '+ i + '" data-type="row"></div>')
                    }
                }
            });

            // Run _execute callback if set
            if ( $.isFunction( callback ) ) {
                callback( result );
            }

            return result;
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

            /*
            *    Resize functionality
            */
            var resizeExecuteTimer;
            var resizeExecute = function(){
                if($(base).attr('data-lastcall') != parseFloat($(base).css('width'))){
                    var data = _execute(instanceElement);

                    if ( $.isFunction( settings.onResize ) ) {
                        settings.onResize( data );
                    }
                }
            };

            if(settings.bindOnResize){
                $(window).on('resize', function(){

                    if(settings.resizeTimeout ){
                        clearTimeout(resizeExecuteTimer);
                        resizeExecuteTimer = setTimeout(function(){
                            resizeExecute();
                        }, settings.resizeTimeout);

                        return true;
                    }

                    resizeExecute();
                    return true;
                });
            }

            /*
            *   Image on load funcitonality
            */
            if(settings.reinitImage){
                reinitImage = (settings.reinitImage == 'all' || 'individual') ? settings.reinitImage : 'all';

                var imageAmount = $(instanceElement).find('img').length;
                var imageCouinter = 0;

                /* function to call when all images are loaded */
                var onLoadAll = function(e){
                    $(instanceElement).attr('loadedImages', true);
                    _execute(instanceElement, function(){
                        setTimeout(function(){
                            // Take into account the stupid transition bug (make sure if some one uses transitions they will always run)
                            $(instanceElement).attr('imagereinit', true);
                        }, 10);

                    });
                };

                var onLoadIndividual = function(e){
                    _execute(instanceElement, function(){
                        setTimeout(function(){
                            // Take into account the stupid transition bug (make sure if some one uses transitions they will always run)
                            $(e).attr('imagereinit', true);
                        }, 50);
                    });
                };

                $(instanceElement).find('img').each(function(i, e){
                    var image = new Image();

                    var handleImage = function(e){
                        imageCouinter++;
                        $(e).attr('loaded', true);

                        if(reinitImage == 'individual'){
                            onLoadIndividual(e);

                            if(imageCouinter >= imageAmount){
                                $(instanceElement).attr('imagereinit', true);
                            }
                        }

                         if(reinitImage == 'all' && imageCouinter >= imageAmount){
                            onLoadAll(e);

                            $(instanceElement).find('img').attr('imagereinit', true);
                         }
                    }

                    image.onload = function () {
                        handleImage(e);
                    }

                    image.onerror = function () {
                       console.error('Cannot load image('+ i +'): '+ $(e).attr('src'));
                      handleImage(e);
                    }

                    image.src =$(this).attr('src');
                });
            }

            /*
            *   Run first instance
            */
            var __initialize = function(){
                var data = _execute(instanceElement);
                if ( $.isFunction( settings.onInit ) ) {
                    settings.onInit( data);
                }

                return data;
            };

            return __initialize();
        });

        return output;
    };
}(jQuery));
