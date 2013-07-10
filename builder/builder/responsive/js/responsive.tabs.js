/*
* Responsive tabs v1.0.1
*/

/*global jQuery*/
/*jshint expr:true*/
(function ($) {

    "use strict";

    // General variables.
    var supportTransition = $.support.transition,

        tab = function (activePosition, postion, callback) {

            var showEvent = $.Event("show.tabs.responsive"),
                $element = this.$element,
                $childTabs = $element.find("ul.tabs li"),
                $childPanes = $element.children("div"),
                $nextTab = $childTabs.eq(postion),
                $currentPane = $childPanes.eq(activePosition),
                $nextPane = $childPanes.eq(postion);

            this.tabbing = true;

            $element.trigger(showEvent);

            $childTabs.removeClass("tab-active");
            $nextTab.addClass("tab-active");

            // Do some class shuffling to allow the transition.
            $currentPane.addClass("fade-out fade-in");
            $nextPane.addClass("tab-pane-active fade-out");
            $childPanes.filter(".fade-in").removeClass("tab-pane-active fade-in");

            // Force reflow.
            $nextPane[0].offsetWidth;

            $nextPane.addClass("fade-in");

            // Do the callback
            callback.call(this);

        },

    // The Tabs object that contains our methods.
        Tabs = function (element) {

            this.$element = $(element);

            this.$element.on("click.tabs.responsive", "ul.tabs > li > a", function (event) {

                event.preventDefault();

                var $this = $(this),
                    $li = $this.parent(),
                    index = $li.index();

                $(event.delegateTarget).tabs(index);

            });
        };

    Tabs.prototype = {
        constructor: Tabs,
        show: function (position) {

            var $activeItem = this.$element.find(".tab-active"),
                $children = $activeItem.parent().children(),
                activePosition = $children.index($activeItem),
                self = this;

            if (position > ($children.length - 1) || position < 0) {

                return;
            }

            if (this.tabbing) {

                // Fire the tabbed event.
                return this.$element.one("shown.tabs.responsive", function () {
                    // Reset the position.
                    self.show(position + 1);

                });
            }

            if (activePosition === position) {
                return;
            }

            // Call the function with the callback
            return tab.call(this, activePosition, position, function () {

                var shownEvent = $.Event("shown.tabs.responsive"),
                    self = this,
                    complete = function () {

                        self.tabbing = false;
                        self.$element.trigger(shownEvent);

                    };

                // Do our callback
                if (supportTransition) {
                    this.$element.one(supportTransition.end, complete);
                } else { complete(); }

            });

        }
    };

    /* Plug-in definition */
    $.fn.tabs = function (options) {

        return this.each(function () {

            var $this = $(this),
                data = $this.data("tabs");

            if (!data) {
                // Check the data and reassign if not present.
                $this.data("tabs", (data = new Tabs(this)));
            }

            // Show the given number.
            if (typeof options === "number") {
                data.show(options);
            }

        });

    };

    // Set the public constructor.
    $.fn.tabs.Constructor = Tabs;

    $(document).on("ready.tabs.responsive", function () {

        $("[data-tabs]").tabs();

    });

}(jQuery));