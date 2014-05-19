<?php

require_once 'Gump.php';

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
      if (strlen($value) === 3)
      {
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

      $param = explode(chr(32), $param);

      if(in_array($len, $param))
      { // valid, return nothing
        return;
      } else {
        return array(
          'field' => $field,
          'value' => $input[$field],
          'rule'  => __FUNCTION__,
          'param' => $param
        );
      }
    }

    public function validate_day_of_week($field, $input, $param = NULL)
    {
      // Valid day values
      $validDays = array('mo', 'tu', 'we', 'th', 'fr', 'sa', 'su');

      // Error array
      $error = array(
        'field' => $field,
        'value' => $input[$field],
        'rule'  => __FUNCTION__,
        'param' => $param
      );

      // Convert input string into array
      $days = explode(",", $input[$field]);

      // Extra value, generate error
      if (count($days) > 7)
      {
        return $error;
      }

      // If $days contains invalid value, generate error
      foreach ($days as $day)
      {
        if (!in_array($day, $validDays)) {
          return $error;
        }
      }

      // All values valid
      return;
    }

    public function validate_activities($field, $input, $param = NULL)
    {
      // Error array
      $error = array(
        'field' => $field,
        'value' => $input[$field],
        'rule'  => __FUNCTION__,
        'param' => $param
      );

      if ($input[$field] === "" || $input[$field] === '')
      {
        return;
      }

      $acts = explode(",", $input[$field]);

      foreach ($acts as $act)
      {
        if (!is_numeric($act))
        {
          return $error;
        }
      }

      // Valid
      return;
    }
}
