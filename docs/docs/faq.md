# Frequently Asked Questions

## Analysis Tools

#### How is data captured and represented in Suma?
The core data collection construct in Suma is the `count`, which typically represents an observation of, or interaction with, a patron. A count is captured every time the count button is tapped in the Suma data collection client. This action captures a timestamp and creates associations between the count and its locations and activities, depending on how a particular data collection initiative is configured. 

#### What are sessions?
Each count is associated with a `session`, which is the data collection period that starts when the `start collection` action is taken in the data collection client and ends when the `finish collecting` action is taken in the data collection client. Sessions serve as a way of grouping counts across arbitrary times.

#### What is the "Classify Counts By" filter?
**This filter determines which time to use when filtering counts.** Three times are available: the start time of the session, the end time of the session, and the timestamp of the count. 

#### What is the "Always Include Whole Session" filter?
This is particularly useful when used in conjunction with the "classify counts by" filter described above. In some instances, for example when analyzing overnight counts or initiatives that may have some slight variance in start time, it can be useful to force the analysis tools to include all counts in the sessions that are returned. **This filter will ignore date and time filters if a session contains counts outside of the selected ranges.**

#### What is the difference between "null" and "zero" counts?
Suma distinguishes between `null` and `zero`. This allows observations of `zero` to be made, for example, when a particular space is empty. 

#### How does the "Use Zero Counts for Locations" filter work?
It is possible to observe `zero` when using Suma, but these observations may not be desirable to include in the calculation of averages for locations. This filter

#### How does the "Start 24-Hour Day" filter work?

#### How do the activity and location filters work?
Each count has a single location and may have several activities associated with it. The analysis tools include a variety of filtering options to select subsets of counts based on activity and location combinations. The location filter supports the inclusion or exclusion of children locations, and will respond appropriately to user input.

**Please note that the activity filters are applied to the count itself.** For example, if a count has three activities, and one activity is `excluded` in the filter and the other two are `allowed`, then the count will not be included in the result set. Also, `exclude` overrides `require`. This is important to remember when analyzing initiatives that allow multiple selections within one activity group.

#### How do I do an overnight report?

#### Why is the Total Sum and Total # of Counts Different in the Summary Data

#### What is the difference between "Avg of Sum" and "Avg of Avg" in the Locations and Activities bar chart?

#### How do I export raw data from Suma?
Please see the [Suma Queryserver Documentation](queryserver.md).