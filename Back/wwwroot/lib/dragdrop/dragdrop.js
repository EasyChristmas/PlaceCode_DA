(function ($, window) {
  'use strict';
  var
    defaultOptions = {
      makeClone: false,  // Drag a clone of the source, and not the actual source element
      sourceClass: null, // Class to apply to source element when dragging a clone of the source element
      sourceHide: false, // Specify with true that the source element should hade visibility:hidden while dragging a clone
      dragClass: null,   // Class to apply to the element that is dragged
      canDropClass: null, // Class to apply to the dragged element when dropping is possible
      dropClass: null,
      isActive: true,
      container: null, // if set, dragging is limited to this container
      waitStart: null, // if set, wait click time
      fixedStart: false,
      moveScript: false,

      // Default is to allow all elements to be dragged
      canDrag: function ($src, event) {
        return $src;
      },

      // Default is to allow dropping inside elements with css stylesheet "drop"
      canDrop: function ($dst) {
        return $dst.hasClass("drop") || $dst.parents(".drop").size() > 0;
      },

      // Default is to move the element in the DOM and insert it into the element where it is dropped
      didDrop: function ($src, $dst) {
        $src.appendTo($dst);
      }
    },
    $window = $(window),
    is_touch = 'ontouchstart' in window,
    events = {
      end :  is_touch ? 'touchend.dragdrop' : 'mouseup.dragdrop',
      start: is_touch ? 'touchstart.dragdrop' : 'mousedown.dragdrop',
      move:  is_touch ? 'touchmove.dragdrop' : 'mousemove.dragdrop'
    },

    // Status during a drag-and-drop operation. Only one such operation can be in progress at any given time.
    $sourceElement = null, // Element that user wanted to drag
    $activeElement = null, // Element that is shown moving around during drag operation
    $destElement = null,   // Element currently highlighted as possible drop destination
    parentOffset = null,
    actposition = null,
    dragOffsetX, dragOffsetY, // Position difference from drag-point to active elements left top corner
    limits,

    // Private helper methods
    cancelDestElement = function (options) {
      if ($destElement != null) {
        if (options.dropClass) {
          $destElement.removeClass(options.dropClass);
        }
        $destElement = null;
      }
      if ($activeElement != null) {
        if (options.canDropClass) {
          $activeElement.removeClass(options.canDropClass);
        }
      }
    },
    getEventPosition = function (event) {
      var posX, posY, originalEvent;

      if (event.type === "touchend") {
        event = event.originalEvent.changedTouches[0];
      }

      if (event.type === "touchmove" || event.type === "touchstart") {
        originalEvent = event.originalEvent.touches[0];
        posX = originalEvent.clientX;
        posY = originalEvent.clientY;
      } else {
        posX = event.pageX;
        posY = event.pageY;
      }
      return {x: posX, y: posY};
    },
    startPause = function (self, event, wait) {
      var
        fn = function () {
          if (self.wait) {
            window.clearTimeout(self.wait);
          }
          self.wait = false;
          $window.off(events.end, fn);
        },
        waitFn = function () {
          if (self.wait) {
            methods.onStart.call(self, event);
          }
        };
      $window.on(events.end, fn);
      return window.setTimeout(waitFn, wait);
    },

    // Public methods
    methods = {
      init: function (options) {
        if (this.has_dragdrop) {
          return;
        }
        this.has_dragdrop = true;
        options = $.extend({}, defaultOptions, options);
        this.data("options", options);
        this.on(events.start, methods.onStart);
        this.find('img').add(this).on('dragstart', methods.offDragImage);
        return this;
      },
      destroy: function () {
        this.has_dragdrop = false;
        this.off(events.start);
        this.off('img').on('dragstart', methods.offDragImage);
        return this;
      },
      offDragImage: function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
      },
      on: function () {
        this.data("options").isActive = true;
      },
      off: function () {
        this.data("options").isActive = false;
      },
      isActive: function () {
        return this.has_dragdrop;
      },
      onStart: function (event) {
        var
          $me = $(this),
          $element,
          options = $me.data("options");
        if (!options.isActive) {
          return;
        }
        if (options.waitStart && !this.wait) {
          this.wait = startPause(this, event, options.waitStart);
          return;
        }
        this.wait = false;
        $element = options.canDrag($me, event);
        if ($element) {
          $sourceElement = $element;
          parentOffset = $sourceElement.parent().offset();
          var
            width  = $sourceElement.width(),
            height = $sourceElement.height(),
            event_position = getEventPosition(event),
            offset = $sourceElement.offset(),
            posX = offset.left,
            posY = offset.top,
            $container = options.container,
            container_offset;

          dragOffsetX = event_position.x - posX;
          dragOffsetY = event_position.y - posY;

          if (options.fixedStart) {
            posX += dragOffsetX;
            posY += dragOffsetY;
          }

          if (options.makeClone) {
            $activeElement = $sourceElement.clone(false);

            // Elements that are cloned and dragged around are added to the parent in order
            // to get any cascading styles applied.
            $activeElement.appendTo(window.document.body);
            if (options.sourceClass) {
              $sourceElement.addClass(options.sourceClass);
            } else if (options.sourceHide) {
              $sourceElement.css("visibility", "hidden");
            }
          } else {
            posX -= parentOffset.left;
            posY -= parentOffset.top;
            $activeElement = $sourceElement;
          }

          $activeElement.css({
            position: "absolute",
            left:   posX,
            top:    posY,
            width:  width,
            height: height
          });
          if (options.dragClass) {
            $activeElement.addClass(options.dragClass);
          }

          if (options.container) {
            container_offset = options.container.offset();
            limits = {
              minX: container_offset.left,
              minY: container_offset.top,
              maxX: container_offset.left + $container.outerWidth(),
              maxY: container_offset.top + $container.outerHeight()
            };
          }

          $window.on(events.move, { source: $me }, methods.onMove);
          $window.on(events.end, { source: $me }, methods.onEnd);
          $sourceElement.trigger("dragbegin", {
            source: $sourceElement,
            active: options.makeClone ? $activeElement : $sourceElement,
            position: {x: dragOffsetX, y: dragOffsetY}
          });
          event.stopPropagation();
          return false;
        }
      },

      onMove: function (event) {
        if (!$activeElement) {
          return;
        }

        var
          $me = event.data.source,
          options = $me.data("options"),
          event_position = getEventPosition(event),
          posX = event_position.x,
          posY = event_position.y,
          documentElement = window.document.documentElement,
          documentBody = window.document.body,
          destElement,
          $possibleDestElement;

        $activeElement.css("display", "none");
        destElement = window.document.elementFromPoint(
          posX - documentElement.scrollLeft - documentBody.scrollLeft,
          posY - documentElement.scrollTop - documentBody.scrollTop
        );
        $activeElement.css("display", "");

        if (!options.fixedStart) {
          posX -= dragOffsetX;
          posY -= dragOffsetY;
        }
        if (limits) {
          posX = Math.min(Math.max(posX, limits.minX), limits.maxX);
          posY = Math.min(Math.max(posY, limits.minY), limits.maxY);
        }

        if (!options.makeClone) {
          posX -= parentOffset.left;
          posY -= parentOffset.top;
        }

        $activeElement.css({ left: posX, top: posY });

        if (destElement) {
          if ($destElement == null || $destElement.get(0) != destElement) {
            $possibleDestElement = $(destElement);
            if (options.canDrop($possibleDestElement)) {
              if (options.dropClass) {
                if ($destElement != null) {
                  $destElement.removeClass(options.dropClass);
                }
                $possibleDestElement.addClass(options.dropClass);
              }
              if (options.canDropClass) {
                $activeElement.addClass(options.canDropClass);
              }
              $destElement = $possibleDestElement;
            } else if ($destElement != null) {
              cancelDestElement(options);
            }
          }
        } else if ($destElement != null) {
          cancelDestElement(options);
        }
        actposition = {x: posX, y: posY};
        $sourceElement.trigger("drag", {
          position: actposition,
          dragOffset: {x: dragOffsetX, y: dragOffsetY},
          source: $sourceElement,
          active: options.makeClone ? $activeElement : $sourceElement,
          dest: $(destElement)
        });
        event.stopPropagation();
        return false;
      },

      onEnd: function (event) {
        if (!$activeElement) {
          return;
        }
        var
          $me = event.data.source,
          options = $me.data("options"),
          elementFromPoint;

        if ($destElement) {
          options.didDrop($sourceElement, $destElement);
        }
        cancelDestElement(options);
        if (options.makeClone) {
          $activeElement.remove();
          if (options.sourceClass) {
            $sourceElement.removeClass(options.sourceClass);
          } else if (options.sourceHide) {
            $sourceElement.css("visibility", "visible");
          }
        } else {
          $activeElement.css("width", "");
          $activeElement.css("height", "");
          if (options.dragClass) {
            $activeElement.removeClass(options.dragClass);
          }
        }
        if (actposition) {
          $sourceElement.trigger(
            "dragend",
            {
              position: actposition,
              dragOffset: {x: dragOffsetX, y: dragOffsetY},
              sourcePosition: {x: actposition.x - parentOffset.left, y: actposition.y - parentOffset.top},
              elementFromPoint: window.document.elementFromPoint(actposition.x + (options.fixedStart ? 0 : dragOffsetX), actposition.y + (options.fixedStart ? 0 : dragOffsetY))
            }
          );
        }
        $window.off(events.move).off(events.end);
        $sourceElement = $activeElement = limits = null;

      },

      toggleFixed: function (sate) {
        var
          $self = $(this),
          options = $self.data("options");
        options.fixedStart = (sate !== undefined) ? sate : !options.fixedStart;
        $self.data("options", options);
      }
    };

  $.fn.dragdrop = function (method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    }
    $.error('Method ' + method + ' does not exist on jQuery.dragdrop');
  };
})(jQuery, window);

