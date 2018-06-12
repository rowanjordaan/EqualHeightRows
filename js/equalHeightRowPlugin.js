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
            resizeTimeout: 200, // Run every 150ms
            throttleTimeout: 300, // Wheter to use throttle or debounce
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

        // device detection
        var isMobile = false;
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
            isMobile = true;
        }

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
            var resizeExecute = function(){
                var data = _execute(instanceElement);

                if ( $.isFunction( settings.onResize ) ) {
                    settings.onResize( data );
                }
            };

            var resizeTimer;
            var resizeBlock = 0;

            if(settings.bindOnResize){
                $(window).on('resize', function(){
                    if($(base).attr('data-lastcall') != parseFloat($(base).css('width'))){
                        if(!isMobile){
                            if(settings.throttleTimeout && settings.resizeTimeout){
                                if(resizeBlock <= 0){
                                    resizeBlock++;
                                    resizeExecute();
                                }else if(resizeBlock === 1){
                                    resizeBlock++;

                                    setTimeout(function(){
                                        resizeBlock = 0;
                                    }, settings.throttleTimeout);
                                }
                            }

                            if(settings.resizeTimeout){
                                clearTimeout(resizeTimer);
                                resizeTimer = setTimeout(function(){
                                    resizeExecute();
                                }, settings.resizeTimeout);
                            }else{
                                resizeExecute();
                            }
                        }else{
                            resizeExecute();
                        }
                    }
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
