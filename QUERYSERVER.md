Suma Query Server
=================

API options
------------
* Query servers
	* query/sessions
		* By sending your request to the sessions query server ("query/sessions"), you will ensure that counts are grouped by session and that sessions are always complete. This is more useful for something where collecting sessions are important, such as with head counts.
	* query/counts
		* By sending your request to the count query server ("query/counts"), sessions are ignored. All date filters apply to counts, and no session data is returned. This is more useful for something where individual count timestamps are sufficient, such as with reference desk transactions.
	* query/debugsessions
		* A HTML display of the sessions query service.
	* query/debugcounts
		* A HTML display of the counts query service.
* GET parameters
	* id: Initiative ID.
	* sdate: Starting date range for query. If querying sessions, will return a session that overlaps with any part of the range, otherwise this will return only counts that are within the range. Format: YYYYMMDD, YYYYMMDDThhmm.
	* edate: Ending date range for query. If querying sessions, will return a session that overlaps with any part of the range, otherwise this will return only counts that are within the range. Format: YYYYMMDD, YYYYMMDDThhmm.
	* stime: Starting time slice (applies for all days in sdate/edate range). Format: hhmm (24-hour)
	* etime: Ending time slice (applies for all days in sdate/edate range). Format: hhmm (24-hour)
	* format: one of "cal, cla, alc, lac, lca, ac, lc" (see "Return formats" below). Default: "cal"
    * sum: "true". If requesting a format where the count is at the deepest level (alc, lac, ac, lc), individual counts are combined where possible. While this does not preserve the timestamp for each count, it does result in a more compact set of data. Default: No summing.
    * offset: Starting position of desired database result set
    * limit: Maximum number of database rows to return (override server setting). The server config contains a default number of records to process per transaction. The analysis query library provides several methods to ease the process of stitching the full data set together across multiple requests. Increasing the limit will result in fewer requests to the server (improving performance), but it could also cause the Query Server process to exceed its memory limit, resulting in an error.

Return formats
---------------
* Data is returned as JSON.
* Format names describe the nesting order of the count data. Data associations can be lost in some formats, and most of these are provided for succinctness and processing convenience.
	* C = Counts
	* A = Activities
	* L = Locations
* CAL/CLA
	* This is the most complete representation of the data. For each count, its activities, locations, and initiatives are listed.
* ALC
	* For each activity, the locations where the activity has been recorded are listed. For each of these locations, the counts are listed. This may be useful for reports that focus on where certain activities take place.
* LAC
	* For each location, the activities that have been recorded there are listed. For each of the activities, the counts are listed. This may be useful for reports that focus on what types of activities occur in a given location.
* LCA
	* For each location, the counts for that location are listed. For each of those counts, any activities associated with the count are listed. This is like LAC, but maintains associations between activities.
* AC
	* For each activity, its counts are listed. You don't need any locations.
* LC
	* For each location, its counts are listed. You don't need any activities.
