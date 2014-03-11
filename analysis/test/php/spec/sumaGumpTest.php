<?php

require_once 'src/lib/php/SumaGump.php';

class SumaGumpTest extends PHPUnit_Framework_TestCase {

  public function testFilterRmhypen () {
    $original = array('id' => '2014-01-01');
    $expected = array('id' => '20140101');

    $filters = array(
      'id' => 'rmhyphen',
    );

    $gump = new SumaGump();

    $filtered = $gump->filter($original, $filters);

    $this->assertEquals($expected, $filtered);
  }

  public function testFilterPadTimeEqualsThree () {
    $original = array('id' => '300');
    $expected = array('id' => '0300');

    $filters = array(
      'id' => 'pad_time',
    );

    $gump = new SumaGump();

    $filtered = $gump->filter($original, $filters);

    $this->assertEquals($expected, $filtered);
  }

  public function testFilterPadTimeNotEqualsThree () {
    $original = array('id' => '0300');
    $expected = array('id' => '0300');

    $filters = array(
      'id' => 'pad_time',
    );

    $gump = new SumaGump();

    $filtered = $gump->filter($original, $filters);

    $this->assertEquals($expected, $filtered);
  }

  public function testValidatorMultiExactLengthTrue () {
    $original = array('stime' => '0300');
    $expected = array('stime' => '0300');

    $rules = array(
      'stime' => 'multi_exact_len, 0 4',
    );

    $gump = new SumaGump();

    $validated = $gump->validate($original, $rules);

    $this->assertEquals($validated, TRUE);
  }

  public function testValidatorMultiExactLengthFalse () {
    $original = array('stime' => '12345');

    $rules = array(
      'stime' => 'multi_exact_len, 0 4',
    );

    $gump = new SumaGump();

    $validated = $gump->validate($original, $rules);

    $this->assertTrue(is_array($validated));
  }

  public function testValidatorDayOfWeekTrue () {
    $original = array('days' => 'mo,tu,we,th,fr,sa,su');

    $rules = array(
      'days' => 'day_of_week',
    );

    $gump = new SumaGump();

    $validated = $gump->validate($original, $rules);

    $this->assertEquals($validated, TRUE);
  }

  public function testValidatorDayOfWeekFalseTooManyValues () {
    $original = array('days' => 'mo,tu,we,th,fr,sa,su, su');

    $rules = array(
      'days' => 'day_of_week',
    );

    $gump = new SumaGump();

    $validated = $gump->validate($original, $rules);

    $this->assertTrue(is_array($validated));
  }

  public function testValidatorDayOfWeekFalseInvalidValues () {
    $original = array('days' => 'mouse,tub,weep');

    $rules = array(
      'days' => 'day_of_week',
    );

    $gump = new SumaGump();

    $validated = $gump->validate($original, $rules);

    $this->assertTrue(is_array($validated));
  }

  public function testValidatorDayOfWeekFalseNoValues () {
    $original = array('days' => '');

    $rules = array(
      'days' => 'day_of_week',
    );

    $gump = new SumaGump();

    $validated = $gump->validate($original, $rules);

    $this->assertTrue(is_array($validated));
  }
}