(function($d, $rbp, w, test, module) {
  "use strict";

  const carouselHtml =
    '<div id="carousel" class="carousel">' +
    "<ol><li></li><li></li><li></li></ol>" +
    '<figure class="carousel-active"><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.</p></figure>' +
    "<figure><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.</p></figure>" +
    "<figure><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.</p></figure>" +
    "<button>&lt;</button>" +
    '<button class="forward">&gt;</button>' +
    "</div>";

  module("carousel");

  // Ensure the plugin is present and accounted for.
  test("Carousel plugin should be defined on global $rbp object", function(assert) {
    assert.ok($rbp.carousel, "carousel() method is defined.");
  });

  // Events
  test("Carousel plugin should fire slide and slid events.", function(assert) {
    const $fixture = $d.id("qunit-fixture");
    const $carousel = $d.fromHtml(carouselHtml);
    $d.append($fixture, $carousel);
    $rbp.carousel($carousel, {
      interval: 1,
      wrap: false
    });

    const done = assert.async();
    $d.one($carousel, "slide.rbp.carousel", null, function(e) {
      assert.ok(true, "Slide event fired.");
    });

    $d.one($carousel, "slid.rbp.carousel", null, function(e) {
      assert.ok(true, "Slid event fired.");
      done();
    });
  });

  test("Carousel plugin should not fire slid event when slide event is prevented.", function(assert) {
    const $fixture = $d.id("qunit-fixture");
    const $carousel = $d.fromHtml(carouselHtml);
    $d.append($fixture, $carousel);
    $rbp.carousel($carousel, {
      interval: 1,
      wrap: false
    });

    const done = assert.async();
    $d.one($carousel, "slide.rbp.carousel", null, function(e) {
      e.preventDefault();
      assert.ok(true, "Slide event fired.");
      done();
    });

    $d.one($carousel, "slid.rbp.carousel", null, function(e) {
      assert.ok(false, "Slid event fired.");
    });
  });

  // // Accessibility
  test("Carousel plugin should have role and aria-live attributes added.", function(assert) {
    const $fixture = $d.id("qunit-fixture");
    const $carousel = $d.fromHtml(carouselHtml);
    $d.append($fixture, $carousel);
    $rbp.carousel($carousel, {
      wrap: false
    });

    assert.equal(
      $d.getAttr($carousel, "role"),
      "listbox",
      "Carousel has role = listbox."
    );
    assert.equal(
      $d.getAttr($carousel, "aria-live"),
      "polite",
      "Carousel has aria-live = polite."
    );
  });

  test("Selected pane should have aria-selected equal to true.", function(assert) {
    const $fixture = $d.id("qunit-fixture");
    const $carousel = $d.fromHtml(carouselHtml);
    $d.append($fixture, $carousel);
    $rbp.carousel($carousel, {
      wrap: false
    });

    const $active = $d.queryAll("figure.carousel-active", $carousel);

    assert.ok(true, $active.length === 0, "Should be only one active pane.");

    assert.equal(
      $d.getAttr($active[0], "aria-selected"),
      "true",
      "Shown pane has aria-selected = true."
    );
  });

  test("Hidden pane should have aria-selected equal to false.", function(assert) {
    const $fixture = $d.id("qunit-fixture");
    const $carousel = $d.fromHtml(carouselHtml);
    $d.append($fixture, $carousel);
    $rbp.carousel($carousel, {
      wrap: false
    });

    const $inactive = $d.queryAll("figure:not(.carousel-active)", $carousel);
    assert.equal(
      $d.getAttr($inactive[0], "aria-selected"),
      "false",
      "Hidden pane has aria-selected = false."
    );
  });

  test("Carousel plugin should have aria-controls attributes added.", function(assert) {
    const $fixture = $d.id("qunit-fixture");
    const $carousel = $d.fromHtml(carouselHtml);
    $d.append($fixture, $carousel);
    $rbp.carousel($carousel, {
      wrap: false
    });

    const id = $d.getAttr($carousel, "id");

    const $indicators = $d.query("ol > li", $carousel);
    assert.equal(
      $d.getAttr($indicators, "aria-controls"),
      id,
      "Indicators control carousel via aria-controls."
    );

    const $buttons = $d.queryAll("button", $carousel);
    $buttons.forEach(b => {
      assert.equal(
        $d.getAttr(b, "aria-controls"),
        id,
        "Buttons control carousel via aria-controls."
      );
    });
  });
})(window.$d, window.$rbp, window, QUnit.test, QUnit.module);
