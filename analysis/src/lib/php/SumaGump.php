<?php

require_once("../vendor/Gump.php");

/**
 * SumaGump - A subclass that extends GUMP
 *
 * @author  Bret Davidson <bret_davidson@ncsu.edu>
 * @uses Gump
 */
class SumaGump extends GUMP
{
    // Removes hyphens from string
    public function filter_rmhyphen($value)
    {
        return $value = str_replace("-", "", $value);
    }

    // Add leading zero to 3 digit string
    public function filter_pad_time($value)
    {
      if (strlen($value) === 3) {
        return '0' . $value;
      } else {
        return $value;
      }
    }

    // Validate multiple exact lengths
    public function validate_multi_exact_len($field, $input, $param = NULL)
    {
      $param = trim(strtolower($param));
      $len = (string)mb_strlen(trim(strtolower($input[$field])));

      if (preg_match_all('#\'(.+?)\'#', $param, $matches, PREG_PATTERN_ORDER)) {
          $param = $matches[1];
      } else  {
          $param = explode(chr(32), $param);
      }

      if(in_array($len, $param)) { // valid, return nothing
          return;
      } else {
          return array(
              'field' => $field,
              'value' => $value,
              'rule'  => __FUNCTION__,
              'param' => $param
          );
      }
    }
}
