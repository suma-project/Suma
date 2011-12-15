<?php
class Zend_View_Helper_ListChildLocs
{
    public function listChildLocs($locObj, $first=false) 
    {
        $locKids = $locObj->getChildren(false);

        if (!empty($locKids) && is_array($locKids)) {
            if (true !== $first) {
                echo "<ol>\n";
            }
            foreach ($locKids as $loc) {
                $status = ($loc->getMetadata('enabled')) ? 'enabled-loc' : 'disabled-loc';
                echo "<li class=\"location {$status}\">\n";
                echo "<div><span class=\"locTitle\">{$loc->getMetadata('title')}</span> <span class=\"locDesc\">{$loc->getMetadata('description')}</span><span class=\"locID\">{$loc->getMetadata('id')}</span><a href=\"#\" class=\"editLoc\">Edit</a></div>\n";
                $this->listChildLocs($loc, false);
                echo "</li>\n";
            }

            if (true !== $first) {
                echo "</ol>\n";
            }
        }
    }

}
?>
