<?php

require_once 'src/lib/php/Gump.php';
require_once 'src/lib/php/SumaGump.php';

class SumaGumpTest extends PHPUnit_Framework_TestCase {

  public function testFilterRmhypen () {
    $original = array('id' => '2014-01-01');
    $expected = array('id' => '20140101');

    $filters = array(
      'id'         => 'rmhyphen',
    );

    $gump = new SumaGump();

    $filtered = $gump->filter($original, $filters);

    $this->assertEquals($expected, $filtered);
  }

  public function testFilterPadTimeEqualsThree () {
    $original = array('id' => '300');
    $expected = array('id' => '0300');

    $filters = array(
      'id'         => 'pad_time',
    );

    $gump = new SumaGump();

    $filtered = $gump->filter($original, $filters);

    $this->assertEquals($expected, $filtered);
  }

  public function testFilterPadTimeNotEqualsThree () {
    $original = array('id' => '0300');
    $expected = array('id' => '0300');

    $filters = array(
      'id'         => 'pad_time',
    );

    $gump = new SumaGump();

    $filtered = $gump->filter($original, $filters);

    $this->assertEquals($expected, $filtered);
  }
}