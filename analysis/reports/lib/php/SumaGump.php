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

    // Placeholder for custom validation rules
    // public function validate_myvalidator($field, $input, $param = NULL)
    // {
    // }
}
