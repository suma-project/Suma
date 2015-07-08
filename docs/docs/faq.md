# Frequently Asked Questions

## Analysis Tools

#### How is data captured and represented in Suma?
The core data collection construct in Suma is the `count`, which typically represents an observation of, or interaction with, a patron. A count is captured every time the count button is tapped in the Suma data collection client. This action captures a timestamp and creates associations between the count and its locations and activities, depending on how a particular data collection initiative is configured. 

It's best to think about the count as an action, which may record any number of observed subjects (including zero). In the Suma client, the count button always records counts of 1, but that is only a convention. For example, when a location is selected in the Suma client, a count of 0 is registered. This count will be replaced by the first count, but will remain if there are no counts submitted for this location. This will result in a larger number of counts than observed transactions, since one count will include 0 observed transactions.

In summary, **counts are a counting action, not a total of observed subjects.**

#### What are sessions?
Each count is associated with a `session`, which is the data collection period that starts when the `start collection` action is taken in the data collection client and ends when the `finish collecting` action is taken in the data collection client. Sessions serve as a way of grouping counts across arbitrary times. Sessions will be automatically ended when switching initiatives or closing the browser. While a head count, for example, may correspond to a single session, this is not necessarily always true (e.g. the counter is interrupted by a user and then records the transaction in another initiative before continuing the count).

In the analysis tools, data is first returned from the queryserver grouped by sessions. If any part of a session intersects with the selected date or time filters, it is included in the queryserver results. The analysis tools filters are then applied to these results. The "Classify Counts By" and "Always Include Whole Session" filters play an important role in determining if an individual count is displayed in the analysis tools.

#### What is the "Classify Counts By" filter?
**This filter determines which time to use when filtering counts.** Three times are available: the start time of the session, the end time of the session, and the timestamp of the count. The assigned time will be used in evaluting individual counts for inclusion in the analysis results.

#### What is the "Always Include Whole Session" filter?
This is particularly useful when used in conjunction with the "classify counts by" filter described above. In some instances, for example when analyzing overnight counts or initiatives that may have some slight variance in start time, it can be useful to force the analysis tools to include all counts in the sessions that are returned. Another example is the analysis of head counts, where the start and end time may fall outside of a given window (say, 10:00-11:00 for a 10:00am head count), but you want any session that overlaps with the date or time range to be included in its entirety. **This filter will ignore date and time filters if a session contains counts outside of the selected ranges.**

#### What is the difference between "null" and "zero" counts?
Suma distinguishes between `null` and `zero`. This allows observations of `zero` to be made, for example, when a particular space is empty. When a location is selected in the Suma client, a count of 0 is initially registered to say that "the space has been observed, and no one was there." This allows us to incorporate empty spaces into calculations about average space utilization.

#### How does the "Use Zero Counts for Locations" filter work?
It is possible to observe `zero` when using Suma, but these observations may not be desirable to include in the calculation of averages for locations. This filter will control if zero counts are included in the denominator when calculating averages.

#### How does the "Start 24-Hour Day" filter work?
This filter allows for the selection of an arbitrary start time for a 24-Hour period. Count dates will be adjusted backwards one day if their time is earlier than this value. An extra day will automatically be included in the result set to complete the last day. 

#### How do the activity and location filters work?
Each count has a single location and may have several activities associated with it. The analysis tools include a variety of filtering options to select subsets of counts based on activity and location combinations. The location filter supports the inclusion or exclusion of children locations, and will respond appropriately to user input.

**Please note that the activity filters are applied to the count itself.** For example, if a count has three activities, and one activity is `excluded` in the filter and the other two are `allowed`, then the count will not be included in the result set. Also, `exclude` overrides `require`. This is important to remember when analyzing initiatives that allow multiple selections within one activity group.

#### How do I do a "midnight" report for a single day?
Some initiatives may regularly have collection sessions that intersect with midnight and cross two different days. In order to isolate these collection sessions, use the following filters:

1) Set "Classify Counts By" to "Session End"

2) Set "Always Include Whole Session" to "Yes"

3) Set the "Start Date" and "End Date" to the date of the midnight hour of the day you are analyzing.

4) Set the "No Counts Before" filter to "0000" and the "No Counts After" filter to "0100". This assumes you are doing an hourly observation. You may want to include some buffer time depending on your collection activities.

#### Why is the "Total Sum" and "Total # of Counts" Different in the Summary Data
As mentioned above, a `count` in Suma is the action of making an observation. 
In some cases, the observed value is 0. As a result, "Total # of Counts" represents the total number of observations made and "Total Sum" represents the sum of the observed values.

#### What is the difference between "Avg of Sum" and "Avg of Avg" in the Locations and Activities bar chart?
The "Avg of Sum" value is calculated by adding all of the daily totals and dividing by the number of days in the time period.

The "Avg of Avg" value is calculated by adding all of the daily averages and dividing by the number of days in the time period. The daily average is the sum of each session in a day divided by the number of sessions in that day.

"Avg of Avg" is useful when examining initiatvies that are more census oriented, like headcounts. "Avg of Sum" is useful for exploring initiatives that have more constant data collection, like reference desk transactions.

#### How do I export raw data from Suma?
Please see the [Suma Queryserver Documentation](queryserver.md).
