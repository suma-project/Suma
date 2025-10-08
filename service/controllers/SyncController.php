<?php

require_once 'BaseController.php';
require_once 'models/SyncModel.php';


class SyncController extends BaseController
{
    public function indexAction()
    {
        $db = Globals::getDBConn();
        $json = Zend_Filter::filterStatic($this->getRequest()->getParam('json'), 'StripTags');

        // Sanitize incoming JSON to remove invalid activity values (e.g., empty strings)
        $sanitized = $this->sanitizeSyncJson($json);
        if ($sanitized !== null) {
            $json = $sanitized;
        }

        $sync = new SyncModel();

        if ($sync->commit($json))
        {
            $this->view->result = true;
        }
        else
        {
            $this->view->result = false;
            $this->view->error = $sync->getError();
        }
    }

    /**
     * Sanitizes the provided sync JSON by removing invalid/non-numeric entries from
     * each count's activities array and converting numeric strings to integers.
     * Returns a sanitized JSON string if any changes were made, otherwise returns null
     * to indicate no changes.
     *
     * @param string $json The sync JSON to sanitize
     * @return string|null The sanitized JSON string, or null if no changes were made
     */
    private function sanitizeSyncJson($json)
    {
        // Ensure $json is a string and not empty
        if (!is_string($json) || $json === '') {
            return null;
        }

        // Attempt to decode the JSON string
        $decoded = json_decode($json, true);
        if ($decoded === null || $decoded === false) {
            // If the JSON string is malformed, let SyncModel handle logging
            return null;
        }

        // Check that the decoded JSON has a 'sessions' key containing an array of sessions
        if (!isset($decoded['sessions']) || !is_array($decoded['sessions'])) {
            return null;
        }

        // Initialize a counter to keep track of how many count's activities arrays were modified
        $changedCounts = 0;

        // Iterate over each session in the decoded JSON
        foreach ($decoded['sessions'] as &$session) {
            // Check that the session has a 'counts' key containing an array of counts
            if (!isset($session['counts']) || !is_array($session['counts'])) {
                // If the session is missing a 'counts' key, skip it
                continue;
            }

            // Iterate over each count in the session's counts array
            foreach ($session['counts'] as &$count) {
                // Check that the count has an 'activities' key containing an array of activities
                if (!isset($count['activities']) || !is_array($count['activities'])) {
                    // Ensure activities is an array
                    $count['activities'] = array();
                    continue;
                }

                // Initialize a variable to keep track of the original activities array
                $original = $count['activities'];

                // Initialize an empty array to store the filtered activities array
                $filtered = array();

                // Iterate over each activity in the count's activities array
                foreach ($original as $a) {
                    // If the activity is an integer, keep it
                    if (is_int($a)) {
                        $filtered[] = $a;
                    } elseif (is_string($a)) {
                        // Keep numeric strings, cast to int; drop others (including empty strings)
                        if ($a !== '' && ctype_digit($a)) {
                            $filtered[] = (int)$a;
                        }
                    }
                    // drop all other types (null, arrays, objects, floats, etc.)
                }

                // Check if the filtered activities array is different from the original
                if ($filtered !== $original) {
                    // If the filtered activities array is different, update the count's activities array
                    $count['activities'] = $filtered;
                    // Increment the counter to keep track of how many count's activities arrays were modified
                    $changedCounts++;
                    // Log the changed session info
                    Globals::getLog()->info('SYNC SANITIZE - changed session: '.$session['id'].' - count: '.$count['id']);
                }
            }
            unset($count);
        }
        unset($session);

        // Check if any count's activities arrays were modified
        if ($changedCounts > 0) {
            // If any count's activities arrays were modified, log the number of modified counts
            Globals::getLog()->info('SYNC SANITIZE - cleaned counts: '.$changedCounts);
            // Return the sanitized JSON string
            return json_encode($decoded);
        }

        // If no count's activities arrays were modified, return null
        return null;
    }
}
