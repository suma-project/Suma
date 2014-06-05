<?php

require_once 'vendor/autoload.php';

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

    public function get_readable_errors($convert_to_string = false, $field_class="field", $error_class="error-message")
    {
        if(empty($this->errors)) {
            return ($convert_to_string)? null : array();
        }

        $resp = array();

        foreach($this->errors as $e) {

            $field = ucwords(str_replace(array('_','-'), chr(32), $e['field']));
            $param = $e['param'];

            switch($e['rule']) {
                case 'mismatch' :
                    $resp[] = "There is no validation rule for <span class=\"$field_class\">$field</span>";
                    break;
                case 'validate_required':
                    $resp[] = "The <span class=\"$field_class\">$field</span> field is required";
                    break;
                case 'validate_valid_email':
                    $resp[] = "The <span class=\"$field_class\">$field</span> field is required to be a valid email address";
                    break;
                case 'validate_max_len':
                    if($param == 1) {
                        $resp[] = "The <span class=\"$field_class\">$field</span> field needs to be shorter than $param character";
                    } else {
                        $resp[] = "The <span class=\"$field_class\">$field</span> field needs to be shorter than $param characters";
                    }
                    break;
                case 'validate_min_len':
                    if($param == 1) {
                        $resp[] = "The <span class=\"$field_class\">$field</span> field needs to be longer than $param character";
                    } else {
                        $resp[] = "The <span class=\"$field_class\">$field</span> field needs to be longer than $param characters";
                    }
                    break;
                case 'validate_exact_len':
                    if($param == 1) {
                        $resp[] = "The <span class=\"$field_class\">$field</span> field needs to be exactly $param character in length";
                    } else {
                        $resp[] = "The <span class=\"$field_class\">$field</span> field needs to be exactly $param characters in length";
                    }
                    break;
                case 'validate_alpha':
                    $resp[] = "The <span class=\"$field_class\">$field</span> field may only contain alpha characters(a-z)";
                    break;
                case 'validate_alpha_numeric':
                    $resp[] = "The <span class=\"$field_class\">$field</span> field may only contain alpha-numeric characters";
                    break;
                case 'validate_alpha_dash':
                    $resp[] = "The <span class=\"$field_class\">$field</span> field may only contain alpha characters &amp; dashes";
                    break;
                case 'validate_numeric':
                    $resp[] = "The <span class=\"$field_class\">$field</span> field may only contain numeric characters";
                    break;
                case 'validate_integer':
                    $resp[] = "The <span class=\"$field_class\">$field</span> field may only contain a numeric value";
                    break;
                case 'validate_boolean':
                    $resp[] = "The <span class=\"$field_class\">$field</span> field may only contain a true or false value";
                    break;
                case 'validate_float':
                    $resp[] = "The <span class=\"$field_class\">$field</span> field may only contain a float value";
                    break;
                case 'validate_valid_url':
                    $resp[] = "The <span class=\"$field_class\">$field</span> field is required to be a valid URL";
                    break;
                case 'validate_url_exists':
                    $resp[] = "The <span class=\"$field_class\">$field</span> URL does not exist";
                    break;
                case 'validate_valid_ip':
                    $resp[] = "The <span class=\"$field_class\">$field</span> field needs to contain a valid IP address";
                    break;
                case 'validate_valid_cc':
                    $resp[] = "The <span class=\"$field_class\">$field</span> field needs to contain a valid credit card number";
                    break;
                case 'validate_valid_name':
                    $resp[] = "The <span class=\"$field_class\">$field</span> field needs to contain a valid human name";
                    break;
                case 'validate_contains':
                    $resp[] = "The <span class=\"$field_class\">$field</span> field needs to contain one of these values: ".implode(', ', $param);
                    break;
                case 'validate_street_address':
                    $resp[] = "The <span class=\"$field_class\">$field</span> field needs to be a valid street address";
                    break;
                case 'validate_date':
                    $resp[] = "The <span class=\"$field_class\">$field</span> field needs to be a valid date";
                    break;
                case 'validate_min_numeric':
                    $resp[] = "The <span class=\"$field_class\">$field</span> field needs to be a numeric value, equal to, or higher than $param";
                    break;
                case 'validate_max_numeric':
                    $resp[] = "The <span class=\"$field_class\">$field</span> field needs to be a numeric value, equal to, or lower than $param";
                    break;
                case 'validate_multi_exact_len':
                    $resp[] = "The <span class=\"$field_class\">$field</span> field needs to be the exact length of one of these values (hyphens or colons are not counted): ".implode(', ', $param);
                    break;
                case 'validate_day_of_week':
                    $resp[] = "The <span class=\"$field_class\">$field</span> field should contain one or more of these values (mo, tu, we, th, fr, sa, su) separated by a comma.";
                    break;
                case 'validate_activities':
                    $resp[] = "The <span class=\"$field_class\">$field</span> field should contain numeric ids separated by a comma.";
                    break;
            }
        }

        if(!$convert_to_string) {
            return $resp;
        } else {
            $buffer = '';
            foreach($resp as $s) {
                $buffer .= "<span class=\"$error_class\">$s</span>";
            }
            return $buffer;
        }
    }
}
