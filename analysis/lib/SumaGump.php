<?php
require_once("Gump.php");

class SumaGump extends GUMP
{
    public function filter_rmhyphen($value)
    {
        return $value = str_replace("-", "", $value);
    }

    // Placeholder for custom validation rules
    // public function validate_myvalidator($field, $input, $param = NULL)
    // {
    // }
}