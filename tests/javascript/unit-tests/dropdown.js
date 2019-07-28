(function($d, $rbp, w, test, module) {
  "use strict";

  const dropdownHtml = "<button>Click me to toggle</button>";

  const dropdownTargetHtml =
    '<div class="collapse" id="collapse">' +
    "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod temporincididunt " +
    "ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrudexercitation ullamco " +
    "laboris nisi ut aliquip ex ea commodo consequat. Duis auteirure dolor in reprehenderit in voluptate " +
    "velit esse cillum dolore eu fugiat nullapariatur. Excepteur sint occaecat cupidatat non proident, sunt " +
    "in culpa qui officiadeserunt mollit anim id est laborum.</p>" +
    "</div>";

  module("dropdown");

  // Ensure the plugin is present and accounted for.
  test("Dropdown plugin should be defined on global $rbp object", function(assert) {
    assert.ok($rbp.dropdown, "carousel() method is defined.");
  });

  // Events
  test("Dropdown plugin should fire show and shown events.", function(assert) {
    const $fixture = $d.id("qunit-fixture");
    const $dropdown = $d.fromHtml(dropdownHtml);
    const $dropdownTarget = $d.fromHtml(dropdownTargetHtml);
    $d.append($fixture, $dropdown);
    $d.append($fixture, $dropdownTarget);

    const done = assert.async();
    $d.on($dropdown, "show.rbp.dropdown", null, function(e) {
      assert.ok(true, "Show event fired.");
    });

    $d.on($dropdown, "shown.rbp.dropdown", null, function(e) {
      assert.ok(true, "Shown event fired.");
      done();
    });

    $rbp
      .dropdown($dropdown, {
        target: $dropdownTarget
      })
      .show();
  });

  test("Dropdown plugin should not fire shown event when show event is prevented.", function(assert) {
    const $fixture = $d.id("qunit-fixture");
    const $dropdown = $d.fromHtml(dropdownHtml);
    const $dropdownTarget = $d.fromHtml(dropdownTargetHtml);
    $d.append($fixture, $dropdown);
    $d.append($fixture, $dropdownTarget);

    const done = assert.async();
    $d.on($dropdown, "show.rbp.dropdown", null, function(e) {
      e.preventDefault();
      assert.ok(true, "Show event fired.");
      done();
    });

    $d.on($dropdown, "shown.rbp.dropdown", null, function(e) {
      assert.ok(false, "Shown event fired.");
    });

    $rbp
      .dropdown($dropdown, {
        target: $dropdownTarget
      })
      .show();
  });

  test("Dropdown plugin should fire hide and hidden events.", function(assert) {
    const $fixture = $d.id("qunit-fixture");
    const $dropdown = $d.fromHtml(dropdownHtml);
    const $dropdownTarget = $d.fromHtml(dropdownTargetHtml);
    $d.removeClass($dropdownTarget, "collapse");
    $d.append($fixture, $dropdown);
    $d.append($fixture, $dropdownTarget);

    const done = assert.async();
    $d.on($dropdown, "hide.rbp.dropdown", null, function(e) {
      assert.ok(true, "Hide event fired.");
    });

    $d.on($dropdown, "hidden.rbp.dropdown", null, function(e) {
      assert.ok(true, "Hidden event fired.");
      done();
    });

    $rbp
      .dropdown($dropdown, {
        target: $dropdownTarget
      })
      .hide();
  });

  test("Dropdown plugin should not fire hidden event when hide event is prevented.", function(assert) {
    const $fixture = $d.id("qunit-fixture");
    const $dropdown = $d.fromHtml(dropdownHtml);
    const $dropdownTarget = $d.fromHtml(dropdownTargetHtml);
    $d.removeClass($dropdownTarget, "collapse");

    $d.append($fixture, $dropdown);
    $d.append($fixture, $dropdownTarget);

    const done = assert.async();
    $d.on($dropdown, "hide.rbp.dropdown", null, function(e) {
      e.preventDefault();
      assert.ok(true, "Hide event fired.");
      done();
    });

    $d.on($dropdown, "hidden.rbp.dropdown", null, function(e) {
      assert.ok(false, "Hidden event fired.");
    });

    $rbp
      .dropdown($dropdown, {
        target: $dropdownTarget
      })
      .hide();
  });

  // Accessibility
  test("Collapsed dropdown should have aria-expanded and aria-selected equal to false.", function(assert) {
    const $fixture = $d.id("qunit-fixture");
    const $dropdown = $d.fromHtml(dropdownHtml);
    const $dropdownTarget = $d.fromHtml(dropdownTargetHtml);
    $d.removeClass($dropdownTarget, "collapse");

    $d.append($fixture, $dropdown);
    $d.append($fixture, $dropdownTarget);

    $rbp
      .dropdown($dropdown, {
        target: $dropdownTarget
      })
      .hide();

    assert.equal(
      $d.getAttr($dropdown, "aria-expanded"),
      "false",
      "Collapsed dropdown has aria-expanded = false."
    );

    assert.equal(
      $d.getAttr($dropdown, "aria-selected"),
      "false",
      "Collapsed dropdown has aria-selected = false."
    );
  });

  test("Expanded dropdown should have aria-expanded and aria-selected equal to true.", function(assert) {
    const $fixture = $d.id("qunit-fixture");
    const $dropdown = $d.fromHtml(dropdownHtml);
    const $dropdownTarget = $d.fromHtml(dropdownTargetHtml);

    $d.append($fixture, $dropdown);
    $d.append($fixture, $dropdownTarget);

    $rbp
      .dropdown($dropdown, {
        target: $dropdownTarget
      })
      .show();

    assert.equal(
      $d.getAttr($dropdown, "aria-expanded"),
      "true",
      "Collapsed dropdown has aria-expanded = true."
    );

    assert.equal(
      $d.getAttr($dropdown, "aria-selected"),
      "true",
      "Collapsed dropdown has aria-selected = true."
    );
  });

  test("Collapsed dropdown target should have aria-hidden equal to true.", function(assert) {
    const $fixture = $d.id("qunit-fixture");
    const $dropdown = $d.fromHtml(dropdownHtml);
    const $dropdownTarget = $d.fromHtml(dropdownTargetHtml);
    $d.removeClass($dropdownTarget, "collapse");

    $d.append($fixture, $dropdown);
    $d.append($fixture, $dropdownTarget);

    $rbp
      .dropdown($dropdown, {
        target: $dropdownTarget
      })
      .hide();

    assert.equal(
      $d.getAttr($dropdownTarget, "aria-hidden"),
      "true",
      "Collapsed dropdown has aria-hidden = true."
    );
  });

  test("Expanded dropdown target should have aria-hidden equal to false.", function(assert) {
    const $fixture = $d.id("qunit-fixture");
    const $dropdown = $d.fromHtml(dropdownHtml);
    const $dropdownTarget = $d.fromHtml(dropdownTargetHtml);

    $d.append($fixture, $dropdown);
    $d.append($fixture, $dropdownTarget);

    $rbp
      .dropdown($dropdown, {
        target: $dropdownTarget
      })
      .show();

    assert.equal(
      $d.getAttr($dropdownTarget, "aria-hidden"),
      "false",
      "Collapsed dropdown has aria-hidden = false."
    );
  });

  test("Dropdown trigger and target should have aria connected id's.", function(assert) {
    const $fixture = $d.id("qunit-fixture");
    const $dropdown = $d.fromHtml(dropdownHtml);
    const $dropdownTarget = $d.fromHtml(dropdownTargetHtml);
    $d.removeClass($dropdownTarget, "collapse");

    $d.append($fixture, $dropdown);
    $d.append($fixture, $dropdownTarget);

    $rbp.dropdown($dropdown, {
      target: $dropdownTarget
    });

    const targetId = $d.getAttr($dropdownTarget, "id");
    const triggerId = $d.getAttr($dropdown, "id");

    assert.equal(
      $d.getAttr($dropdownTarget, "aria-labelledby"),
      triggerId,
      "Dropdown target is labelled by tab via aria-labelledby."
    );
    assert.equal(
      $d.getAttr($dropdown, "aria-controls"),
      targetId,
      "Dropdown trigger controls target via aria-controls."
    );
  });
})(window.$d, window.$rbp, window, QUnit.test, QUnit.module);
